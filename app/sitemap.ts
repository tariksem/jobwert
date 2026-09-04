import type { MetadataRoute } from 'next';
export default function sitemap():MetadataRoute.Sitemap{const base=process.env.NEXT_PUBLIC_SITE_URL||'https://jobwert.pages.dev';return ['','/jobangebote-vergleichen','/gehaltserhoehung-rechner','/umzug-fuer-job-rechner','/homeoffice-vs-buero-rechner'].map(p=>({url:base+p,lastModified:new Date(),changeFrequency:'weekly',priority:p?0.8:1}))}
