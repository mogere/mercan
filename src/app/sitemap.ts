import { MetadataRoute } from 'next';
import { db } from '@/../db';
import { products, services } from '@/../db/schema';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXTAUTH_URL || process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3002';

  const allProducts = await db.select({ id: products.id, createdAt: products.createdAt }).from(products);
  const allServices = await db.select({ id: services.id }).from(services);

  const productUrls = allProducts.map((product) => ({
    url: `${baseUrl}/products/${product.id}`,
    lastModified: product.createdAt || new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }));

  const serviceUrls = allServices.map((service) => ({
    url: `${baseUrl}/services/${service.id}/book`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }));

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${baseUrl}/shop`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/services`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/cart`,
      lastModified: new Date(),
      changeFrequency: 'always',
      priority: 0.5,
    },
    {
      url: `${baseUrl}/checkout`,
      lastModified: new Date(),
      changeFrequency: 'always',
      priority: 0.5,
    },
    {
      url: `${baseUrl}/auth/login`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.4,
    },
    {
      url: `${baseUrl}/auth/register`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.4,
    },
    ...productUrls,
    ...serviceUrls,
  ];
}
