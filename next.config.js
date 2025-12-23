/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '5000',
        pathname: '/**',
      },
      {
        protocol: 'http',
        hostname: '10.217.28.111',
        port: '5000',
        pathname: '/**',
      },
    ],
  },
  async rewrites() {
    const apiUrl = process.env.API_SERVER_URL || 'http://localhost:5000';
    console.log('Proxying /api requests to:', apiUrl);
    return [
      {
        source: '/api/:path*',
        destination: `${apiUrl}/api/:path*`,
      },
      // Also proxy static uploads if served by backend
      {
        source: '/uploads/:path*',
        destination: `${apiUrl}/uploads/:path*`,
      }
    ]
  },
}

module.exports = nextConfig
