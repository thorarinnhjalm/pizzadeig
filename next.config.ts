import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');

import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  async redirects() {
    return [
      // Legacy shop URL still earning impressions in Google (44 impr, pos 10 in GSC)
      { source: '/budin', destination: '/is/vorur', permanent: true },
      { source: '/:locale(is|en)/budin', destination: '/:locale/vorur', permanent: true },
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
    ],
  },
};

export default withNextIntl(nextConfig);
