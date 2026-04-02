import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'prod-files-secure.s3.us-west-2.amazonaws.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 's3.us-west-2.amazonaws.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'prod-files-secure.s3.amazonaws.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 's3.us-west-2.amazonaws.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
  // API 라우트 캐싱 비활성화 및 GA4 스크립트 최적화
  experimental: {
    optimizePackageImports: ['@radix-ui/react-icons'],
  },
  serverExternalPackages: ['@notionhq/client'],
  // Firebase 서비스 워커를 위한 리라이트 설정
  async rewrites() {
    return [
      {
        source: '/firebase-messaging-sw.js',
        destination: '/firebase-messaging-sw.js',
      },
    ];
  },
  // GA4 관련 헤더 설정
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
        ],
      },
    ];
  },
};

export default nextConfig;
