import type { Metadata } from 'next'
import { Analytics } from '@vercel/analytics/react'
import './globals.css'

export const metadata: Metadata = {
  metadataBase: new URL('https://crust-and-crumb-tawny.vercel.app'),
  applicationName: 'The Bread Baker\'s Glossary',
  title: {
    default: "The Bread Baker's Glossary | Crust & Crumb Academy",
    template: '%s | Crust & Crumb Academy',
  },
  description: "A comprehensive bread baking glossary with 132+ terms and growing, covering sourdough, fermentation, flour, tools, techniques, baker's science and more.",
  keywords: [
    'bread baking glossary',
    'bread baking terms',
    'sourdough glossary',
    'sourdough terms',
    'bread techniques',
    'fermentation terms',
    'baker\'s percentage',
    'bread tools',
    'bread science',
    'Henry Hunter',
    'Crust & Crumb Academy',
  ],
  authors: [{ name: 'Henry Hunter' }],
  creator: 'Henry Hunter',
  publisher: 'Crust & Crumb Academy',
  category: 'Bread Baking Education',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
      'max-video-preview': -1,
    },
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="bg-amber-50 text-slate-800">
        {children}
        <Analytics />
      </body>
    </html>
  )
}
