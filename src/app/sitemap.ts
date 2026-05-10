import type { MetadataRoute } from 'next'

// TODO: replace with custom domain when registered
const SITE_URL = 'https://setka-rockmesh.vercel.app'

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
