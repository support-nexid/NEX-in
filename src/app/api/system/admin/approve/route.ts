import { NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase-admin';
import { withAuth } from '@/lib/auth-wrapper';
import crypto from 'crypto';

export const dynamic = 'force-dynamic';

export const POST = withAuth(['admin', 'superadmin'], async (req, decodedToken) => {
  try {
    const { utrNumber, action } = await req.json(); // action => 'approve' | 'reject'

    if (!utrNumber || !action) {
      return NextResponse.json({ error: 'Missing Tracking Payload' }, { status: 400 });
    }

    const paymentRef = adminDb.collection('PendingPayments').doc(utrNumber);
    const paymentDoc = await paymentRef.get();
    
    if (!paymentDoc.exists) {
        return NextResponse.json({ error: 'Transaction Identifier Missing' }, { status: 404 });
    }

    const paymentData = paymentDoc.data()!;

    if (paymentData.status !== 'pending') {
         return NextResponse.json({ error: 'Already Processed Previously' }, { status: 400 });
    }

    // High Security Admin Logs (The Black Box Module)
    const secureAuditLog = async (logAction: string, targetId: string) => {
        await adminDb.collection('adminLogs').add({
            id: crypto.randomUUID(),
            adminId: decodedToken?.uid,
            action: logAction,
            targetId: targetId,
            details: `Admin Identity (${decodedToken?.email}) locked decision on transaction: ${utrNumber}`,
            timestamp: new Date().toISOString()
        })
    };

    if (action === 'approve') {
       // Atomic Database Updates via Batch
       const batch = adminDb.batch();
       batch.update(paymentRef, { status: 'approved', reviewedBy: decodedToken?.uid, reviewedAt: new Date().toISOString() });
       
       const userRef = adminDb.collection('users').doc(paymentData.uid);
       
       // Advance expiry strictly 1 calendar year out
       const nextYear = new Date();
       nextYear.setFullYear(nextYear.getFullYear() + 1);

       batch.update(userRef, { 
           tier: paymentData.planTier, 
           is_active: true, 
           expiryDate: nextYear.toISOString() 
       });

       await batch.commit();
       await secureAuditLog('approve_payment', paymentData.uid);
       return NextResponse.json({ success: true, message: 'Identity Secured! Upgrade active and logged.' });

    } else if (action === 'reject') {
        await paymentRef.update({ status: 'rejected', reviewedBy: decodedToken?.uid, reviewedAt: new Date().toISOString() });
        await secureAuditLog('reject_payment', paymentData.uid);
        return NextResponse.json({ success: true, message: 'Transaction explicitly rejected.' });
    } else {
         return NextResponse.json({ error: 'Invalid operation' }, { status: 400 });
    }

  } catch (error) {
    return NextResponse.json({ error: 'Internal Core Loop Failed' }, { status: 500 });
  }
});
