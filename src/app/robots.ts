import type { MetadataRoute } from 'next';

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://localhost:3000';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin/', '/api/admin/', '/test-events/', '/test-ga4/', '/api/debug/', '/api/test-event/'],
    },
    sitemap: `${BASE_URL}/sitemap.xml`,
  };
}
