export const legal={
  name:process.env.NEXT_PUBLIC_LEGAL_NAME||'Tarik Semerci',
  address:process.env.NEXT_PUBLIC_LEGAL_ADDRESS||'',
  email:process.env.NEXT_PUBLIC_LEGAL_EMAIL||'',
  phone:process.env.NEXT_PUBLIC_LEGAL_PHONE||'',
  siteUrl:process.env.NEXT_PUBLIC_SITE_URL||'https://jobwert.pages.dev',
  gaId:process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID||'',
};

export const legalReady=Boolean(legal.name&&legal.address&&legal.email);
