import type { Metadata } from 'next'
import { Analytics } from '@vercel/analytics/react'
import { GLOSSARY_DATA as glossaryData } from '@/src/constants'
import { SITE_URL, SITE_NAME, SITE_KEYWORDS, AUTHOR_NAME, PUBLISHER_NAME, OG_IMAGE } from '@/src/seo'
import './globals.css'

const termCount = glossaryData.length
const siteDescription = `${termCount} bread baking terms explained by baker Henry Hunter. Clear definitions, real examples, troubleshooting help, and free baker's tools. Search, learn, bake.`

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'Crust & Crumb | Interactive Bread Baking Glossary',
    template: `%s | ${SITE_NAME}`,
  },
  description: siteDescription,
  applicationName: SITE_NAME,
  keywords: SITE_KEYWORDS,
  authors: [{ name: AUTHOR_NAME, url: 'https://www.bakinggreatbread.blog' }],
  creator: AUTHOR_NAME,
  publisher: PUBLISHER_NAME,
  category: 'food',
  alternates: { canonical: '/' },
  openGraph: {
    title: 'Crust & Crumb Interactive Bread Baking Glossary',
    description: `Clear definitions. Real examples. Better bread. ${termCount} sourdough and bread terms from Henry Hunter, with tips from the bench and free baker's tools.`,
    url: '/',
    type: 'website',
    siteName: SITE_NAME,
    locale: 'en_US',
    images: [OG_IMAGE],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Crust & Crumb Interactive Bread Baking Glossary',
    description: `Clear definitions. Real examples. Better bread. ${termCount} bread baking terms from Henry Hunter.`,
    images: [{ url: OG_IMAGE.url, alt: OG_IMAGE.alt }],
  },
  appleWebApp: { capable: true, title: 'Crust & Crumb', statusBarStyle: 'black-translucent' },
  formatDetection: { telephone: false },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-image-preview': 'large', 'max-snippet': -1 },
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,400;0,9..144,500;0,9..144,600;1,9..144,400;1,9..144,500&family=Figtree:wght@400;500;600;700&display=swap"
        />
        <meta name="theme-color" content="#0d0a07" />
      </head>
      <body className="bg-[#0d0a07] text-[#f6ecdc]">
        <div className="app-backdrop" aria-hidden="true" />
        {children}
        <Analytics />
      </body>
    </html>
  )
}
