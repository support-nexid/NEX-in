export interface Env {
  // Add env vars here
  PROXY_SECRET: string;
}

const ALLOWED_ORIGIN_REGEX = /^https:\/\/(.*\.)?nexid\.in$/;
const MAIN_SITE_URL = "https://nexid.in";
const BACKEND_SECRET_URL = "https://nexid-nextjs-backend-placeholder-url.vercel.app"; // The actual backend API URL

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    const origin = request.headers.get("Origin") || request.headers.get("Referer");
    const userAgent = request.headers.get("User-Agent") || "";
    const url = new URL(request.url);

    // 1. Direct browser access fallback
    if (request.method === "GET" && (!origin || origin === "null") && !request.headers.get("X-NexId-Token")) {
      return Response.redirect(MAIN_SITE_URL, 302);
    }
    
    // 2. Block Crawlers & Bots specifically trying to index the API
    if (userAgent.toLowerCase().includes("googlebot") || userAgent.toLowerCase().includes("bot")) {
      return new Response("Blocked by Gateway", { status: 403 });
    }

    // 3. Handle Preflight CORS (OPTIONS)
    if (request.method === "OPTIONS") {
      return new Response(null, {
        status: 204,
        headers: {
          "Access-Control-Allow-Origin": origin && ALLOWED_ORIGIN_REGEX.test(origin) ? origin : "https://nexid.in",
          "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type, Authorization, X-NexId-Token",
          "Access-Control-Max-Age": "86400",
        }
      });
    }

    // 4. Validate Origin strictly for actual API calls
    if (!origin || !ALLOWED_ORIGIN_REGEX.test(origin)) {
      // Return 403 Forbidden
      return new Response(JSON.stringify({ error: "Forbidden. Invalid Origin Scope." }), {
        status: 403,
        headers: { "Content-Type": "application/json" }
      });
    }

    // 5. Secure Proxy Forwarding
    // Rewrite proxy URL to internal backend URL
    const proxyUrl = new URL(request.url);
    proxyUrl.hostname = new URL(BACKEND_SECRET_URL).hostname;
    
    const proxiedRequest = new Request(proxyUrl.toString(), {
      method: request.method,
      headers: request.headers,
      body: request.body,
      redirect: "manual"
    });
    
    // Inject secret headers so Next.js backend knows it passed through Cloudflare natively
    proxiedRequest.headers.set("X-Forwarded-Host", "api.nexid.in");
    proxiedRequest.headers.set("X-Secure-Proxy-Pass", env.PROXY_SECRET || "nexid-dev-secret");

    try {
      const response = await fetch(proxiedRequest);
      const proxyResponse = new Response(response.body, response);
      // Append CORS to the response coming back from the hidden Next.js
      proxyResponse.headers.set("Access-Control-Allow-Origin", origin);
      return proxyResponse;
    } catch (e) {
      return new Response(JSON.stringify({ error: "API Gateway Timeout" }), { status: 504 });
    }
  },
};
