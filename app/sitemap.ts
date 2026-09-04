import type { MetadataRoute } from 'next';

export const dynamic = 'force-static';

export default function sitemap(): MetadataRoute.Sitemap {
  const base = process.env.NEXT_PUBLIC_SITE_URL || 'https://jobwert.pages.dev';
  const lastModified = new Date();
  return [
    '',
    '/jobangebote-vergleichen',
    '/gehaltserhoehung-rechner',
    '/umzug-fuer-job-rechner',
    '/homeoffice-vs-buero-rechner',
  ].map((path) => ({
    url: `${base}${path}`,
    lastModified,
    changeFrequency: 'weekly' as const,
    priority: path ? 0.8 : 1,
  }));
}
