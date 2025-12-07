import type { Metadata } from 'next'
import './globals.css'
import Header from '@/components/Header'

export const metadata: Metadata = {
  title: 'makeyourownpantonecard',
  description: 'Create your own Pantone-style color card',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <body>
        <Header />
        {children}
      </body>
    </html>
  )
}

