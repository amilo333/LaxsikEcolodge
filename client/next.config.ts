import type { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';

const nextConfig: NextConfig = {
  /* config options here */
};

const withNextIntl = createNextIntlPlugin(
  './src/configs/i18n-request.config.ts'
);
export default withNextIntl(nextConfig);
