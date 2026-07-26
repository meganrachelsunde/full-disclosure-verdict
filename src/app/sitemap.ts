import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: "https://fulldisclosure.agency/",
      changeFrequency: "monthly",
      priority: 1,
    },
    {
      url: "https://fulldisclosure.agency/litigation",
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: "https://fulldisclosure.agency/terms",
      changeFrequency: "yearly",
      priority: 0.3,
    },
  ];
}
