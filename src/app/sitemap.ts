import type { MetadataRoute } from "next";
import { PAGE_DATA } from "@/data/pages";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://mylink-swart.vercel.app";

  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1.0,
    },
  ];

  const dummyPages: MetadataRoute.Sitemap = Object.keys(PAGE_DATA).map((slug) => ({
    url: `${baseUrl}/p/${slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  return [...staticPages, ...dummyPages];
}
