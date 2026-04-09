import { NextResponse } from 'next/server';
import { withAuth } from '@/lib/auth-wrapper';
import { adminDb } from '@/lib/firebase-admin';

export const dynamic = 'force-dynamic';

// GET /api/system/user/profile — Get user profile
export const GET = withAuth(['user', 'admin', 'superadmin'], async (req, decodedToken) => {
  try {
    const uid = decodedToken!.uid;
    const doc = await adminDb.collection('users').doc(uid).get();
    
    if (!doc.exists) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
    }

    return NextResponse.json({ profile: { uid, ...doc.data() } });
  } catch (error) {
    console.error('[API] Profile fetch error:', error);
    return NextResponse.json({ error: 'Failed to fetch profile' }, { status: 500 });
  }
});

// PUT /api/system/user/profile — Update user profile
export const PUT = withAuth(['user', 'admin', 'superadmin'], async (req, decodedToken) => {
  try {
    const uid = decodedToken!.uid;
    const body = await req.json();

    // Allowed fields to update
    const allowedFields = [
      'name', 'tagline', 'bio', 'location', 'avatar', 'theme',
      'onboardingComplete', 'skills', 'socials', 'projects',
      'experience', 'certifications', 'portfolioData',
    ];

    const updates: Record<string, any> = {};
    for (const field of allowedFields) {
      if (body[field] !== undefined) {
        updates[field] = body[field];
      }
    }

    if (Object.keys(updates).length === 0) {
      return NextResponse.json({ error: 'No valid fields to update' }, { status: 400 });
    }

    updates.updatedAt = new Date().toISOString();

    await adminDb.collection('users').doc(uid).update(updates);

    return NextResponse.json({ success: true, updated: Object.keys(updates) });
  } catch (error) {
    console.error('[API] Profile update error:', error);
    return NextResponse.json({ error: 'Failed to update profile' }, { status: 500 });
  }
});
