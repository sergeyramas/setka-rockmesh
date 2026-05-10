import type { MetadataRoute } from 'next'

// TODO: replace placeholder domain with the production URL
const SITE_URL = 'https://rockmesh.example'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  }
}
