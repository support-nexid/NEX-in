import { NextResponse } from 'next/server';
import { withAuth } from '@/lib/auth-wrapper';
import { adminDb } from '@/lib/firebase-admin';

export const dynamic = 'force-dynamic';

// GET /api/system/user/messages — Get user's inbox messages
export const GET = withAuth(['user', 'admin', 'superadmin'], async (req, decodedToken) => {
  try {
    const uid = decodedToken!.uid;

    const messagesSnap = await adminDb.collection('messages')
      .where('recipientUid', '==', uid)
      .orderBy('createdAt', 'desc')
      .limit(50)
      .get();

    const messages = messagesSnap.docs.map((doc: FirebaseFirestore.QueryDocumentSnapshot) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return NextResponse.json({ messages });
  } catch (error) {
    console.error('[API] Messages fetch error:', error);
    return NextResponse.json({ error: 'Failed to fetch messages' }, { status: 500 });
  }
});

// PUT /api/system/user/messages — Mark message as read
export const PUT = withAuth(['user', 'admin', 'superadmin'], async (req, decodedToken) => {
  try {
    const uid = decodedToken!.uid;
    const { messageId, read } = await req.json();

    if (!messageId) {
      return NextResponse.json({ error: 'Message ID required' }, { status: 400 });
    }

    // Verify message belongs to user
    const msgDoc = await adminDb.collection('messages').doc(messageId).get();
    if (!msgDoc.exists || msgDoc.data()?.recipientUid !== uid) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }

    await adminDb.collection('messages').doc(messageId).update({
      read: read !== undefined ? read : true,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[API] Message update error:', error);
    return NextResponse.json({ error: 'Failed to update message' }, { status: 500 });
  }
});
