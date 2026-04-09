import type { Metadata, Viewport } from "next";
import "./globals.css";

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: '#050505',
};

export const metadata: Metadata = {
  metadataBase: new URL('https://nexid.in'),
  title: {
    default: "NexId — Your Next Generation Digital Identity",
    template: "%s | NexId",
  },
  description: "Create stunning portfolio websites in minutes. Claim your unique nexid.in subdomain, showcase your projects with premium animations, and build your professional digital identity — all for free.",
  keywords: [
    "portfolio builder", "nexid", "developer portfolio", "animated portfolio",
    "subdomain portfolio", "professional identity", "portfolio website",
    "digital identity", "portfolio maker", "free portfolio", "online resume",
    "developer showcase", "creative portfolio", "web developer portfolio",
    "nexid.in", "portfolio hosting", "portfolio themes", "portfolio template",
  ],
  authors: [{ name: "NexId", url: "https://nexid.in" }],
  creator: "NexId",
  publisher: "NexId",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    title: "NexId — Your Next Generation Digital Identity",
    description: "Create stunning portfolio websites in minutes. Claim your unique subdomain and showcase your work to the world.",
    type: "website",
    url: "https://nexid.in",
    siteName: "NexId",
    locale: "en_US",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "NexId — Portfolio Builder",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "NexId — Your Next Generation Digital Identity",
    description: "Create stunning portfolio websites in minutes. Claim your unique subdomain today.",
    creator: "@nexid_in",
    images: ["/og-image.png"],
  },
  alternates: {
    canonical: "https://nexid.in",
  },
  verification: {
    google: "YOUR_GOOGLE_SITE_VERIFICATION",
  },
  category: "technology",
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "NexId",
  description: "Create stunning portfolio websites in minutes. Claim your unique nexid.in subdomain.",
  url: "https://nexid.in",
  applicationCategory: "DesignApplication",
  operatingSystem: "Web",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "INR",
    description: "Free portfolio builder with premium themes",
  },
  creator: {
    "@type": "Organization",
    name: "NexId",
    url: "https://nexid.in",
  },
};



export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if (typeof window !== 'undefined' && window.location.hostname === 'www.nexid.in') {
                window.location.replace(window.location.href.replace('www.nexid.in', 'nexid.in'));
              }
            `
          }}
        />
      </head>
      <body className="antialiased overflow-x-hidden font-['Inter',system-ui,sans-serif]">
        {children}
      </body>
    </html>
  );
}
