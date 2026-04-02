import { Metadata } from 'next';
import { getSettings } from './settings';

export async function generateSiteMetadata(): Promise<Metadata> {
  const settings = await getSettings();
  
  const metadata: Metadata = {
    title: settings.metaTitle || settings.siteTitle,
    description: settings.metaDescription || settings.siteDescription,
    keywords: settings.siteKeywords.split(',').map(k => k.trim()),
    authors: [{ name: "주환" }],
    creator: "주환",
    openGraph: {
      title: settings.metaTitle || settings.siteTitle,
      description: settings.metaDescription || settings.siteDescription,
      type: "website",
      locale: "ko_KR",
    },
    twitter: {
      card: "summary_large_image",
      title: settings.metaTitle || settings.siteTitle,
      description: settings.metaDescription || settings.siteDescription,
    },
    robots: {
      index: settings.allowIndexing,
      follow: settings.allowIndexing,
    },
  };

  // 파비콘 설정
  if (settings.faviconUrl) {
    metadata.icons = {
      icon: settings.faviconUrl,
      shortcut: settings.faviconUrl,
      apple: settings.faviconUrl,
    };
  }

  return metadata;
}
