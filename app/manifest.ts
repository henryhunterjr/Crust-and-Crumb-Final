import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Crust & Crumb Bread Baking Glossary',
    short_name: 'Crust & Crumb',
    description: 'Clear definitions, real examples, better bread. The interactive bread baking glossary from Henry Hunter.',
    start_url: '/',
    display: 'standalone',
    background_color: '#0d0a07',
    theme_color: '#0d0a07',
    icons: [
      { src: '/icon-192.png', sizes: '192x192', type: 'image/png' },
      { src: '/icon-512.png', sizes: '512x512', type: 'image/png' },
    ],
  };
}
