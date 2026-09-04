export const legal={
  name:process.env.NEXT_PUBLIC_LEGAL_NAME||'Tarik Semerci',
  address:process.env.NEXT_PUBLIC_LEGAL_ADDRESS||'Hülsebrockstr. 43, 48165 Münster, Deutschland',
  email:process.env.NEXT_PUBLIC_LEGAL_EMAIL||'kontakt@jobwert.de',
  phone:process.env.NEXT_PUBLIC_LEGAL_PHONE||'',
  siteUrl:process.env.NEXT_PUBLIC_SITE_URL||'https://jobwert.de',
  gaId:process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID||'',
};

export const legalReady=Boolean(legal.name&&legal.address&&legal.email);
