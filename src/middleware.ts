import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const url = request.nextUrl;
  let hostname = request.headers.get('host') || '';

  // Remove port if present
  hostname = hostname.replace(/:\d+$/, '');

  const rootDomain = 'nexid.in'; 
  const isLocalhost = hostname.includes('localhost');

  let subdomain = '';
  if (hostname.endsWith(`.${rootDomain}`)) {
    subdomain = hostname.replace(`.${rootDomain}`, '');
  } else if (isLocalhost && hostname.includes('.')) {
    subdomain = hostname.split('.')[0];
  }

  // --- 0. Allow direct API access from subdomains & subdirectories ---
  if (
    (url.pathname.startsWith('/api') && subdomain !== 'api') || 
    url.pathname.startsWith('/icon') || 
    url.pathname.startsWith('/apple-icon') ||
    url.pathname.startsWith('/__/') // Allow Firebase Auth Proxies
  ) {
    return NextResponse.next();
  }

  // --- 1. API Protection Logic ---
  if (subdomain === 'api') {
    // If it's literally just the api homepage (api.nexid.in/), redirect to main domain
    if (url.pathname === '/') {
      return NextResponse.redirect(new URL(`https://${rootDomain}`));
    }

    // CORS Validation:
    // Only allow main domain or any subdomain of nexid.in to use the API
    const origin = request.headers.get('origin') || request.headers.get('referer');
    if (origin) {
      try {
        const originUrl = new URL(origin);
        const originHostname = originUrl.hostname.replace(/:\d+$/, '');
        
        const isAllowedOrigin = originHostname === rootDomain || originHostname.endsWith(`.${rootDomain}`) || isLocalhost;
        
        if (!isAllowedOrigin) {
          return new NextResponse(
            JSON.stringify({ error: 'Forbidden. Access restricted to nexid.in network.' }),
            { status: 403, headers: { 'Content-Type': 'application/json' } }
          );
        }
      } catch (e) {
        return new NextResponse(
          JSON.stringify({ error: 'Malformed Origin header' }),
          { status: 400, headers: { 'Content-Type': 'application/json' } }
        );
      }
    }

    // Rewrite api requests to our internal folder
    return NextResponse.rewrite(new URL(`/api/system${url.pathname}`, request.url));
  }

  // --- 2. System Subdomains ---
  const customSubdomains = ['app', 'auth', 'admin', 'support'];
  if (customSubdomains.includes(subdomain)) {
     return NextResponse.rewrite(new URL(`/${subdomain}${url.pathname}`, request.url));
  }

  // --- 3. Portfolio Subdomains or Custom Domains ---
  const isVercel = hostname.endsWith('.vercel.app');
  const isWWW = subdomain === 'www';

  // Enable subdirectory access for system folders (e.g. nexid.in/app instead of app.nexid.in)
  const basePath = url.pathname.split('/')[1];
  const internalFolders = ['app', 'auth', 'admin', 'support', 'chat', 'onboarding', 'portfolio'];
  
  if ((!subdomain || isWWW || isVercel) && internalFolders.includes(basePath)) {
      return NextResponse.next();
  }

  if (!isWWW && (subdomain || (hostname !== rootDomain && !isLocalhost && !isVercel))) {
    let identifier = subdomain || hostname;

    // Handle chat subdomain specifically (e.g. chat.veer.nexid.in -> chat.veer)
    if (identifier.startsWith('chat.')) {
      const username = identifier.replace('chat.', '');
      return NextResponse.rewrite(new URL(`/chat/${username}${url.pathname}`, request.url));
    }

    return NextResponse.rewrite(new URL(`/portfolio/${identifier}${url.pathname}`, request.url));
  }

  // --- 4. Main Landing Page ---
  return NextResponse.rewrite(new URL(`/landing${url.pathname}`, request.url));
}

export const config = {
  matcher: [
    // Next.js static files or special routes should be bypassed
    '/((?!_next/static|_next/image|favicon.ico|api/system|themes/).*)',
  ],
}
