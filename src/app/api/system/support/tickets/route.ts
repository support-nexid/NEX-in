import { NextResponse } from 'next/server';
import { withAuth } from '@/lib/auth-wrapper';
import { adminDb } from '@/lib/firebase-admin';

// POST /api/system/support/tickets — Create support ticket
export const POST = withAuth(['user', 'support', 'admin', 'superadmin'], async (req, decodedToken) => {
  try {
    const uid = decodedToken!.uid;
    const { subject, description, priority, category } = await req.json();

    if (!subject || !description) {
      return NextResponse.json({ error: 'Subject and description are required' }, { status: 400 });
    }

    const ticket = {
      uid,
      email: decodedToken!.email || '',
      subject,
      description,
      priority: priority || 'medium',
      category: category || 'general',
      status: 'open',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      messages: [],
    };

    const docRef = await adminDb.collection('tickets').add(ticket);

    return NextResponse.json({ success: true, ticketId: docRef.id });
  } catch (error) {
    console.error('[API] Ticket create error:', error);
    return NextResponse.json({ error: 'Failed to create ticket' }, { status: 500 });
  }
});

// GET /api/system/support/tickets — Get tickets (own for users, all for support/admin)
export const GET = withAuth(['user', 'support', 'admin', 'superadmin'], async (req, decodedToken) => {
  try {
    const uid = decodedToken!.uid;
    const role = (decodedToken!.role as string) || 'user';

    let query;
    if (role === 'support' || role === 'admin' || role === 'superadmin') {
      query = adminDb.collection('tickets').orderBy('createdAt', 'desc').limit(100);
    } else {
      query = adminDb.collection('tickets').where('uid', '==', uid).orderBy('createdAt', 'desc').limit(20);
    }

    const snap = await query.get();
    const tickets = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));

    return NextResponse.json({ tickets });
  } catch (error) {
    console.error('[API] Tickets fetch error:', error);
    return NextResponse.json({ error: 'Failed to fetch tickets' }, { status: 500 });
  }
});
