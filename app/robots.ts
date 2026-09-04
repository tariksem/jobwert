import type { MetadataRoute } from 'next';

export const dynamic = 'force-static';

export default function robots(): MetadataRoute.Robots {
  const base=process.env.NEXT_PUBLIC_SITE_URL || 'https://jobwert.de';
  const indexable=process.env.NEXT_PUBLIC_INDEXABLE!=='false';
  return {
    rules: indexable
      ? { userAgent: '*', allow: '/' }
      : { userAgent: '*', disallow: '/' },
    sitemap: indexable ? `${base}/sitemap.xml` : undefined,
  };
}
