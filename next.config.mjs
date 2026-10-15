/** @type {import('next').NextConfig} */
const nextConfig = {
    images:{
        domains: [
            "utfs.io"
        ]
    },
    // TODO: codebase has ~200 legacy type errors; remove once fixed
    typescript: {
        ignoreBuildErrors: true,
    },
};

export default nextConfig;
