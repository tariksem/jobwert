# JobWert Production Launch

The application is intentionally launch-gated. Do not set `NEXT_PUBLIC_INDEXABLE=true` until the legal and domain values below are complete.

## Cloudflare Pages environment variables

Required before indexing:

- `NEXT_PUBLIC_SITE_URL` — final public origin, e.g. `https://jobwert.de`
- `NEXT_PUBLIC_LEGAL_NAME` — public provider/operator name
- `NEXT_PUBLIC_LEGAL_ADDRESS` — complete summonable postal address
- `NEXT_PUBLIC_LEGAL_EMAIL` — public contact email
- `NEXT_PUBLIC_LEGAL_PHONE` — optional public telephone

Optional analytics:

- `NEXT_PUBLIC_GA_MEASUREMENT_ID` — GA4 measurement ID. Google Analytics is loaded only after explicit consent.

Optional monetization:

- `NEXT_PUBLIC_PREMIUM_REPORT_URL` — hosted checkout/payment link for the premium report
- `NEXT_PUBLIC_PREMIUM_REPORT_PRICE` — display price, default `9,90`
- `NEXT_PUBLIC_JOB_PARTNER_URL` — future affiliate/job partner URL

## Safe launch sequence

1. Connect the final custom domain to the existing Cloudflare Pages project.
2. Set the legal variables and `NEXT_PUBLIC_SITE_URL`.
3. Deploy and verify `/impressum` and `/datenschutz`.
4. Configure analytics only if desired; verify the consent banner blocks GA before opt-in.
5. Configure checkout/partner links only after the corresponding commercial accounts are ready.
6. Set `NEXT_PUBLIC_INDEXABLE=true` and redeploy.
7. Verify `/robots.txt` allows crawling and `/sitemap.xml` uses the final domain.
8. Submit the sitemap to Google Search Console and Bing Webmaster Tools.
9. Test calculator, shared links, negotiation handoff and mobile layout on production.

## CI release gate

Every push to `main` runs dependency install, TypeScript checking, regression tests and the static Next.js build. A failed CI run blocks release confidence and should be fixed before launch.
