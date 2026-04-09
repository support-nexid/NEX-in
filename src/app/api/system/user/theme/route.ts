import { NextResponse } from 'next/server';
import { withAuth } from '@/lib/auth-wrapper';
import { adminDb } from '@/lib/firebase-admin';

export const dynamic = 'force-dynamic';

// POST /api/system/user/theme — Apply a theme
export const POST = withAuth(['user', 'admin', 'superadmin'], async (req, decodedToken) => {
  try {
    const uid = decodedToken!.uid;
    const { themeId } = await req.json();

    if (!themeId) {
      return NextResponse.json({ error: 'Theme ID is required' }, { status: 400 });
    }

    // Pro theme check
    const proThemes = ['glassmorphism', 'creative-bold', 'neo-brutalist', '3d-depth', 'retro-wave', 'nature-organic', 'cyber-neon', 'pastel-dreams'];
    const userDoc = await adminDb.collection('users').doc(uid).get();
    const userData = userDoc.data();

    if (proThemes.includes(themeId) && userData?.tier !== 'pro' && userData?.tier !== 'enterprise') {
      return NextResponse.json({ error: 'This theme requires a Pro subscription' }, { status: 403 });
    }

    await adminDb.collection('users').doc(uid).update({
      theme: themeId,
      updatedAt: new Date().toISOString(),
    });

    return NextResponse.json({ success: true, theme: themeId });
  } catch (error) {
    console.error('[API] Theme apply error:', error);
    return NextResponse.json({ error: 'Failed to apply theme' }, { status: 500 });
  }
});
