import { NextResponse } from 'next/server';
import { withAuth } from '@/lib/auth-wrapper';

// Only 'public' ensures no Firebase Auth context is required, but it still enforces our Proxy Gatekeeper secret
export const GET = withAuth(['public'], async (req) => {
  return NextResponse.json({ 
    status: 'online', 
    message: 'NexId Internal API Layer is Operational and Secure.' 
  });
});
