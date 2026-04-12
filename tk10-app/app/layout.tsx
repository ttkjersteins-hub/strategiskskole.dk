import type { Metadata, Viewport } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Strategiskskole App',
  description: 'Strategisk procesapp til skoleledelse',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'Strategiskskole App',
  },
}

export const viewport: Viewport = {
  themeColor: '#080F1A',
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="da" className="h-full">
      <body className="h-full overflow-hidden">{children}</body>
    </html>
  )
}
