import type { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';

const nextConfig: NextConfig = {
  images: {
    qualities: [75, 90],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
};

const withNextIntl = createNextIntlPlugin(
  './src/configs/i18n-request.config.ts'
);
export default withNextIntl(nextConfig);
