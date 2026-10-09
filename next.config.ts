import type { NextConfig } from "next";

/* ============================================================
   Redirects exist because the previous revision published a
   product portfolio — /products/flow, /solutions/workflow,
   /services/integration and so on — that has been withdrawn.
   Those URLs may be in someone's history or an index, so they
   send visitors to the nearest honest equivalent rather than
   a 404.
   ============================================================ */

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  images: {
    formats: ["image/avif", "image/webp"],
  },
  experimental: {
    optimizePackageImports: ["motion"],
  },
  async redirects() {
    return [
      { source: "/products", destination: "/#what-we-do", permanent: true },
      { source: "/products/:slug*", destination: "/#what-we-do", permanent: true },
      { source: "/solutions", destination: "/#what-we-do", permanent: true },
      { source: "/solutions/:slug*", destination: "/#what-we-do", permanent: true },
      { source: "/services", destination: "/#what-we-do", permanent: true },
      { source: "/services/:slug*", destination: "/#what-we-do", permanent: true },
      { source: "/company", destination: "/about", permanent: true },
      { source: "/company/about", destination: "/about", permanent: true },
      { source: "/company/engineering", destination: "/#our-approach", permanent: true },
    ];
  },
};

export default nextConfig;
