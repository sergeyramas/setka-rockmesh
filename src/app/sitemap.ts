import type { MetadataRoute } from 'next'

// TODO: replace placeholder domain with the production URL
const SITE_URL = 'https://rockmesh.example'

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: `${SITE_URL}/`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 1.0,
    },
  ]
}
