import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
      // Jika nanti kamu pakai URL dari server/database sendiri, tambahkan di sini
      // {
      //   protocol: 'https',
      //   hostname: 'alamat-api-kamu.com',
      // },
    ],
  },
};

export default nextConfig;