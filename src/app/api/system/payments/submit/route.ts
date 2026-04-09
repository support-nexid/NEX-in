import { NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase-admin';
import { withAuth } from '@/lib/auth-wrapper';

export const dynamic = 'force-dynamic';

export const POST = withAuth(['user', 'admin', 'superadmin'], async (req, decodedToken) => {
  try {
    const { utrNumber, screenshotUrl, planTier } = await req.json();

    if (!utrNumber || !screenshotUrl || !planTier) {
      return NextResponse.json({ error: 'Missing Required Fields (UTR, Screenshot, Tier)' }, { status: 400 });
    }

    if (!decodedToken || !decodedToken.uid) {
        return NextResponse.json({ error: 'Identity Missing' }, { status: 400 });
    }

    // Write to our PendingPayments collection 
    const paymentRef = adminDb.collection('PendingPayments').doc(utrNumber);
    const paymentDoc = await paymentRef.get();
    
    if (paymentDoc.exists) {
        return NextResponse.json({ error: 'UTR already exists in verification queue' }, { status: 409 });
    }

    await paymentRef.set({
      uid: decodedToken.uid,
      email: decodedToken.email || '',
      status: 'pending',
      screenshotUrl,
      utrNumber,
      planTier,
      submittedAt: new Date().toISOString(),
    });

    return NextResponse.json({ success: true, message: 'Payment explicitly secured and placed in Admin Queue.' });
    
  } catch (error) {
    console.error("UTR Submit Fault:", error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
});
