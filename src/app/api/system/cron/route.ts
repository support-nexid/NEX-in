import { NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase-admin';
import { withAuth } from '@/lib/auth-wrapper';
import { Resend } from 'resend';

// Setup Resend using our server keys
const resend = new Resend(process.env.RESEND_API_KEY || 're_mock_key_to_prevent_build_crashes');

// The `internal` auth layer ensures only scripts carrying the local cryptographic keys can execute this mass-scan
export const POST = withAuth(['internal'], async (req) => {
  try {
    const usersSnapshot = await adminDb.collection('users').where('is_active', '==', true).get();
    let deactivatedCount = 0;
    
    const nowTs = new Date().getTime();
    const dayMs = 24 * 60 * 60 * 1000;
    const batch = adminDb.batch();

    for (const doc of usersSnapshot.docs) {
      const u = doc.data();
      if (!u.expiryDate) continue;

      const expiryTs = new Date(u.expiryDate).getTime();
      const differenceMs = expiryTs - nowTs;
      const daysLeft = Math.ceil(differenceMs / dayMs);

      // Early Warning Automation
      if (daysLeft === 7) {
            await resend.emails.send({
                from: 'NexId Reminder <hello@nexid.in>',
                to: u.email,
                subject: 'NexId Requirement: Renewal due in 7 days.',
                html: '<h3>Your NexId is precious.</h3><p>Your custom domain and portfolio will be expiring soon. Please renew your plan inside the Builder.</p>'
            });
      } 
      // Lethal Action Warning Automation 
      else if (daysLeft === 3) {
            await resend.emails.send({
                from: 'NexId Urgent Warning <hello@nexid.in>',
                to: u.email,
                subject: 'NexId CRITICAL WARNING: 3 days remaining!',
                html: '<h3>Urgent Action Recommended!</h3><p>Your portfolio infrastructure is queued to go offline in exactly 3 days!</p>'
            });
      }
      // System Isolation Logic (includes deliberate 1 Day Grace delay)
      else if (daysLeft <= -1) {
          batch.update(doc.ref, { is_active: false });
          deactivatedCount++;
          
          await resend.emails.send({
            from: 'NexId System Notification <hello@nexid.in>',
            to: u.email,
            subject: 'NexId Service Automatically Suspended',
            html: '<h3>Attention Required - Portfolios Rendered Inactive.</h3><p>Your subscription timeline unfortunately eclipsed completely. Service stands isolated awaiting transaction renewal.</p>'
        });
      }
    }

    // Atomic execution for safety to database limits
    if(deactivatedCount > 0){
        await batch.commit();
    }

    return NextResponse.json({ success: true, scanRadiusAnalyzed: usersSnapshot.size, suspensionTriggers: deactivatedCount });
  } catch(e) {
      return NextResponse.json({ error: 'Automation Engine Exception' }, { status: 500 });
  }
});
