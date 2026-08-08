import type { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
    /* config options here */
  },
};

const withNextIntl = createNextIntlPlugin(
  './src/configs/i18n-request.config.ts'
);
export default withNextIntl(nextConfig);
