import { NextResponse } from 'next/server';
import { adminAuth } from './firebase-admin';
import type { DecodedIdToken } from 'firebase-admin/auth';

type Role = 'public' | 'user' | 'support' | 'admin' | 'superadmin' | 'internal';

export function withAuth(
  allowedRoles: Role[],
  handler: (req: Request, decodedToken?: DecodedIdToken) => Promise<NextResponse | Response>
) {
  return async (req: Request) => {
    try {
      // 1. SECURITY TUNNEL VALIDATION
      // Ensure the request natively passed through our Cloudflare Worker Proxy
      // If it doesn't have this secret, someone is trying to bypass Cloudflare.
      const proxySecret = req.headers.get('X-Secure-Proxy-Pass');
      
      // In development localhost environments we bypass this check if PROXY_SECRET is not set
      // But in production, an invalid secret means instant rejection.
      if (process.env.NODE_ENV === 'production') {
          if (!proxySecret || proxySecret !== process.env.PROXY_SECRET) {
              // Return 404 instead of 403 to completely hide the API's existence from direct port scanners
              return new NextResponse(null, { status: 404 });
          }
      }

      // Check if route is marked public, we bypass JWT check
      if (allowedRoles.includes('public')) {
          return await handler(req);
      }

      // Check if route is strictly internal cron/system, we bypass JWT but check secret
      if (allowedRoles.includes('internal')) {
          return await handler(req);
      }

      // 2. FIREBASE JWT AUTHORIZATION
      const authHeader = req.headers.get('Authorization');
      if (!authHeader?.startsWith('Bearer ')) {
        return NextResponse.json({ error: 'Unauthorized. Missing valid Bearer Token.' }, { status: 401 });
      }

      const token = authHeader.split('Bearer ')[1];
      const decodedToken = await adminAuth.verifyIdToken(token);
      
      // We assume custom claims are set on the token (e.g. { role: "admin" })
      // If not, default fallback is standard "user"
      const userRole = (decodedToken.role as Role) || 'user';

      // 3. ROLE-BASED ACCESS CONTROL (RBAC)
      if (!allowedRoles.includes(userRole)) {
        return NextResponse.json(
          { error: `Forbidden. Requires one of the following roles: ${allowedRoles.join(', ')}` },
          { status: 403 }
        );
      }

      // 4. EXECUTE ENDPOINT
      return await handler(req, decodedToken);

    } catch (error) {
      console.error("[API Auth Error]", error);
      return NextResponse.json({ error: 'Authentication Failed or Internal Error' }, { status: 500 });
    }
  };
}
