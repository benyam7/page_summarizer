import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
    /* config options here */

    // TODO: reenable when ready
    eslint: {
        ignoreDuringBuilds: true,
    },
    typescript: {
        ignoreBuildErrors: true,
    },
};

export default nextConfig;
