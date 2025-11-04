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
};

export default nextConfig;
