import { NextResponse } from 'next/server';
import { withAuth } from '@/lib/auth-wrapper';
import { adminDb } from '@/lib/firebase-admin';

// POST /api/system/public/contact — Public contact form submission (no auth required)
export const POST = withAuth(['public'], async (req) => {
  try {
    const { to, from, name, subject, message } = await req.json();

    if (!to || !from || !message) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Find user by username/subdomain
    const userSnap = await adminDb.collection('users')
      .where('username', '==', to)
      .limit(1)
      .get();

    if (userSnap.empty) {
      return NextResponse.json({ error: 'Recipient not found' }, { status: 404 });
    }

    const recipientUid = userSnap.docs[0].id;

    // Store message
    await adminDb.collection('messages').add({
      recipientUid,
      from: from,
      senderName: name || 'Anonymous',
      subject: subject || 'No Subject',
      message,
      read: false,
      createdAt: new Date().toISOString(),
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[API] Contact error:', error);
    return NextResponse.json({ error: 'Failed to send message' }, { status: 500 });
  }
});
