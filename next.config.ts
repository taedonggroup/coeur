import type { NextConfig } from "next";

const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=()",
  },
];

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com", pathname: "/**" },
      {
        protocol: "https",
        hostname: "*.public.blob.vercel-storage.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "public.blob.vercel-storage.com",
        pathname: "/**",
      },
    ],
  },
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
  async redirects() {
    // CMS에서 홈 CTA 링크가 존재하지 않는 /works로 설정돼 404가 났음 →
    // 라우트는 /portfolio. 어떤 CMS 값이든 안전하도록 영구 리다이렉트.
    return [
      { source: "/works", destination: "/portfolio", permanent: true },
      { source: "/works/:path*", destination: "/portfolio", permanent: true },
    ];
  },
};

export default nextConfig;
