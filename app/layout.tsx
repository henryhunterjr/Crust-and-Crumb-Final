import type { Metadata } from 'next'
import { Analytics } from '@vercel/analytics/react'
import './globals.css'

export const metadata: Metadata = {
  title: 'Crust and Crumb - Interactive Bread Baking Glossary',
  description: "Interactive bread baking glossary with 132 definitions, baker's percentage calculator & expert tips. Companion to 'Sourdough for the Rest of Us' by Henry Hunter.",
  keywords: 'sourdough, bread baking, glossary, baking terms, sourdough starter, bread techniques, Henry Hunter',
  authors: [{ name: 'Henry Hunter' }],
  openGraph: {
    title: 'Crust and Crumb - Interactive Bread Baking Glossary',
    description: "Free glossary with 132 sourdough & bread terms, baker's calculator & expert tips from Henry Hunter.",
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
    description: "Interactive glossary with 132 definitions + baker's percentage calculator",
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
      <body className="bg-amber-50 text-slate-800">
        {children}
        <Analytics />
      </body>
    </html>
  )
}
