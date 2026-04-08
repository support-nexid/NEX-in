import { NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase-admin';
import { withAuth } from '@/lib/auth-wrapper';

const RESTRICTED_SUBDOMAINS = ['app', 'api', 'admin', 'support', 'auth', 'nexid', 'www', 'mail', 'blog', 'help'];

export const POST = withAuth(['public'], async (req) => {
  try {
    const { subdomain } = await req.json();

    if (!subdomain || typeof subdomain !== 'string') {
      return NextResponse.json({ error: 'Missing subdomain payload' }, { status: 400 });
    }

    const cleanSubdomain = subdomain.trim().toLowerCase();

    // 1. Check RESTRICTED blocklist natively
    if (RESTRICTED_SUBDOMAINS.includes(cleanSubdomain) || cleanSubdomain.length < 3) {
       return NextResponse.json({ available: false, message: 'Reserved or Invalid Name' });
    }

    // 2. Query Firebase to see if it's already occupied
    const snapshot = await adminDb.collection('users')
       .where('subdomain', '==', cleanSubdomain)
       .limit(1)
       .get();

    if (!snapshot.empty) {
        return NextResponse.json({ available: false, message: 'Subdomain already taken' });
    }

    return NextResponse.json({ available: true, message: 'Subdomain is yours to claim!' });

  } catch(e) {
      return NextResponse.json({ error: 'Verification Gateway Error' }, { status: 500 });
  }
});
