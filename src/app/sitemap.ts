import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: "https://fulldisclosure.agency/",
      changeFrequency: "monthly",
      priority: 1,
    },
    {
      url: "https://fulldisclosure.agency/dental",
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: "https://fulldisclosure.agency/case-study",
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: "https://fulldisclosure.agency/terms",
      changeFrequency: "yearly",
      priority: 0.3,
    },
  ];
}
