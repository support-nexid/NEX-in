import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/app/', '/admin/', '/support/', '/auth/'],
      },
    ],
    sitemap: 'https://nexid.in/sitemap.xml',
    host: 'https://nexid.in',
  };
}
