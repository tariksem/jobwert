import type { MetadataRoute } from 'next';

export const dynamic = 'force-static';

export default function sitemap(): MetadataRoute.Sitemap {
  const base = process.env.NEXT_PUBLIC_SITE_URL || 'https://jobwert.de';
  const lastModified = new Date();
  const paths=[
    '',
    '/jobangebote-vergleichen',
    '/gehaltserhoehung-rechner',
    '/umzug-fuer-job-rechner',
    '/homeoffice-vs-buero-rechner',
    '/gehaltsverhandlung',
    '/jobwechsel-rechner',
    '/pendelkosten-jobwechsel',
    '/lohnt-sich-mehr-gehalt',
    '/weniger-gehalt-mehr-homeoffice',
    '/methodik',
  ];
  if(process.env.NEXT_PUBLIC_PREMIUM_REPORT_URL)paths.push('/premium-report');
  return paths.map((path) => ({
    url: `${base}${path}`,
    lastModified,
    changeFrequency: 'weekly' as const,
    priority: path ? 0.8 : 1,
  }));
}
