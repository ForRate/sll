import { MetadataRoute } from "next";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  return [
    {
      url: `gounibot.com/`,
    },
    {
      url: `gounibot.com/change-info`,
    },
    {
      url: `gounibot.com/test-bot`,
    },
    {
      url: `gounibot.com/verify-payment`,
    },
  ];
}
