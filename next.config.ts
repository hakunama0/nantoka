import type { NextConfig } from "next";
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin();

const nextConfig: NextConfig = {
  images: {
    unoptimized: true,
  },
  turbopack: {}, // Add for Turbopack compatibility
};

export default withNextIntl(nextConfig);
