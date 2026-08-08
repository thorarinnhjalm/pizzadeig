import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/api/', '/admin/'], // Protect private analytical routes from indexing footprint leakage
    },
    sitemap: 'https://www.pizzadeig.is/sitemap.xml',
  };
}
