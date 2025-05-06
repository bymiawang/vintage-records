import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Public Records',
  description: 'A vintage vinyl record player experience',
  generator: 'v0.dev',
  icons: {
    icon: '/images/public-records.svg',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
