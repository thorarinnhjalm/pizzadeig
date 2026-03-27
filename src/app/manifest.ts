import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Pizzadeig',
    short_name: 'Pizzadeig',
    description: 'Íslenskt pizzusamfélag: Allt frá deigi til diskins',
    start_url: '/',
    display: 'standalone',
    background_color: '#FDF9F2',
    theme_color: '#B91C1C',
    icons: [
      {
        src: '/icon?size=512x512',
        sizes: '512x512',
        type: 'image/png',
      },
      {
        src: '/icon?size=192x192',
        sizes: '192x192',
        type: 'image/png',
      }
    ],
  };
}
