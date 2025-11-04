/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
          {
            protocol: 'https',
            hostname: 'rizwancars.com',
          },
        ],
      },
    // Proper handling of static files
    poweredByHeader: false,
    // Optimize static file serving
    compress: true,
};

export default nextConfig;
