import type { MetadataRoute } from 'next';

export const dynamic = 'force-static';

export default function robots(): MetadataRoute.Robots {
  const base=process.env.NEXT_PUBLIC_SITE_URL || 'https://jobwert.pages.dev';
  const indexable=process.env.NEXT_PUBLIC_INDEXABLE==='true';
  return {
    rules: indexable
      ? { userAgent: '*', allow: '/' }
      : { userAgent: '*', disallow: '/' },
    sitemap: indexable ? `${base}/sitemap.xml` : undefined,
  };
}
