import { NextResponse } from 'next/server';
import { withAuth } from '@/lib/auth-wrapper';
import { adminDb } from '@/lib/firebase-admin';

// POST /api/system/user/portfolio — Save full portfolio data
export const POST = withAuth(['user', 'admin', 'superadmin'], async (req, decodedToken) => {
  try {
    const uid = decodedToken!.uid;
    const body = await req.json();

    const portfolioData = {
      projects: body.projects || [],
      experience: body.experience || [],
      certifications: body.certifications || [],
      skills: body.skills || [],
      socials: body.socials || {},
      bio: body.bio || '',
      tagline: body.tagline || '',
      location: body.location || '',
    };

    await adminDb.collection('users').doc(uid).update({
      portfolioData,
      updatedAt: new Date().toISOString(),
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[API] Portfolio save error:', error);
    return NextResponse.json({ error: 'Failed to save portfolio' }, { status: 500 });
  }
});

// GET /api/system/user/portfolio — Get portfolio data
export const GET = withAuth(['user', 'admin', 'superadmin'], async (req, decodedToken) => {
  try {
    const uid = decodedToken!.uid;
    const doc = await adminDb.collection('users').doc(uid).get();

    if (!doc.exists) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const data = doc.data();
    return NextResponse.json({
      portfolio: data?.portfolioData || {},
      theme: data?.theme || 'minimal-dark',
      tier: data?.tier || 'free',
    });
  } catch (error) {
    console.error('[API] Portfolio fetch error:', error);
    return NextResponse.json({ error: 'Failed to fetch portfolio' }, { status: 500 });
  }
});
