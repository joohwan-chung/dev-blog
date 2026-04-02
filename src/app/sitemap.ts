import type { MetadataRoute } from 'next';
import { getSettings } from '@/lib/settings';
import { getDatabasePagesForSitemap } from '@/lib/notion';

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://localhost:3000';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const settings = await getSettings();
  const staticEntries: MetadataRoute.Sitemap = [
    { url: BASE_URL, lastModified: new Date(), changeFrequency: 'weekly', priority: 1 },
    { url: `${BASE_URL}/blog`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
    { url: `${BASE_URL}/about`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${BASE_URL}/tags`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.6 },
    { url: `${BASE_URL}/playground`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
  ];

  if (!settings.generateSitemap) {
    return staticEntries;
  }

  const posts = await getDatabasePagesForSitemap();
  const blogEntries: MetadataRoute.Sitemap = posts.map((post) => ({
    url: `${BASE_URL}/blog/${post.id}`,
    lastModified: new Date(post.lastUpdated),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

  return [...staticEntries, ...blogEntries];
}
