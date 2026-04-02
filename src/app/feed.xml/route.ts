import { NextResponse } from 'next/server';
import { getDatabasePagesForRss } from '@/lib/notion';
import { getSettings } from '@/lib/settings';

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://localhost:3000';
const RSS_LIMIT = 20;

function escapeXml(unsafe: string): string {
  return unsafe
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function formatRfc822(dateStr: string): string {
  return new Date(dateStr).toUTCString();
}

export async function GET() {
  const [settings, posts] = await Promise.all([getSettings(), getDatabasePagesForRss()]);
  const items = posts.slice(0, RSS_LIMIT);
  const siteTitle = escapeXml(settings.siteTitle || 'Joohwan Dev Blog');
  const siteDescription = escapeXml(settings.siteDescription || '');

  const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${siteTitle}</title>
    <link>${escapeXml(BASE_URL)}</link>
    <description>${siteDescription}</description>
    <language>ko</language>
    <lastBuildDate>${formatRfc822(new Date().toISOString())}</lastBuildDate>
    <atom:link href="${escapeXml(BASE_URL)}/feed.xml" rel="self" type="application/rss+xml"/>
    ${items
      .map(
        (post) => `
    <item>
      <title>${escapeXml(post.title)}</title>
      <link>${escapeXml(BASE_URL)}/blog/${escapeXml(post.id)}</link>
      <description>${escapeXml(post.description || post.title)}</description>
      <pubDate>${formatRfc822(post.publishedDate)}</pubDate>
      <guid isPermaLink="true">${escapeXml(BASE_URL)}/blog/${escapeXml(post.id)}</guid>
    </item>`
      )
      .join('')}
  </channel>
</rss>`;

  return new NextResponse(rss, {
    headers: {
      'Content-Type': 'application/rss+xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  });
}
