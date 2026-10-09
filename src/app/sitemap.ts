import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/site-config";

/* Three pages. The product, solution and service routes it
   used to enumerate no longer exist. */
export default function sitemap(): MetadataRoute.Sitemap {
  const base = siteConfig.url;
  const lastModified = new Date();

  return [
    { url: `${base}/`, lastModified, changeFrequency: "monthly", priority: 1 },
    { url: `${base}/about`, lastModified, changeFrequency: "monthly", priority: 0.8 },
    { url: `${base}/contact`, lastModified, changeFrequency: "monthly", priority: 0.9 },
  ];
}
