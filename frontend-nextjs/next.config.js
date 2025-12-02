/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  
  // 配置 API 代理（可选）
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://localhost:3000/:path*',
      },
    ];
  },

  // 性能优化
  compress: true,
  
  // 图片优化配置
  images: {
    domains: [],
  },
};

module.exports = nextConfig;

