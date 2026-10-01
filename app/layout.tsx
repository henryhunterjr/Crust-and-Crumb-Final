import type { Metadata } from 'next'
import { Analytics } from '@vercel/analytics/react'
import { GLOSSARY_DATA as glossaryData } from '@/src/constants'
import './globals.css'

export const metadata: Metadata = {
  title: 'Crust and Crumb - Interactive Bread Baking Glossary',
  description: `Interactive bread baking glossary with ${glossaryData.length} definitions, guided learning paths, source-linked relationships, and baker's tools. Companion to 'Sourdough for the Rest of Us' by Henry Hunter.`,
  keywords: 'sourdough, bread baking, glossary, baking terms, sourdough starter, bread techniques, Henry Hunter',
  authors: [{ name: 'Henry Hunter' }],
  openGraph: {
    title: 'Crust and Crumb - Interactive Bread Baking Glossary',
    description: `Free glossary with ${glossaryData.length} sourdough and bread terms, guided paths, baker's tools, and expert tips from Henry Hunter.`,
    type: 'website',
    siteName: 'Baking Great Bread at Home',
    locale: 'en_US',
    images: [
      {
        url: 'https://crust-and-crumb-tawny.vercel.app/Thumbnail.jpg',
        width: 1200,
        height: 630,
        alt: 'Crust and Crumb - Interactive Bread Baking Glossary',
      }
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Crust and Crumb - Bread Baking Glossary',
    description: `Interactive glossary with ${glossaryData.length} definitions and baker's percentage calculator`,
    creator: '@bakinggreatbread',
    images: ['https://crust-and-crumb-tawny.vercel.app/Thumbnail.jpg'],
  },
  robots: {
    index: true,
    follow: true,
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
