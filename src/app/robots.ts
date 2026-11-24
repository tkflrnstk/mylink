import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/links", "/stats"],
    },
    sitemap: "https://mylink-swart.vercel.app/sitemap.xml",
  };
}
