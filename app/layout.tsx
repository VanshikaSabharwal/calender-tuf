import '../styles/globals.css'
import '../styles/shepherd.css'
import type { Metadata, Viewport } from 'next'

export const metadata: Metadata = {
  title: 'Wall Calendar',
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
}

type RootLayoutProps = {
  children: React.ReactNode
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}