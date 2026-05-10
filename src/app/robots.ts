import type { MetadataRoute } from 'next'

// TODO: replace with custom domain when registered
const SITE_URL = 'https://setka-rockmesh.vercel.app'

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
