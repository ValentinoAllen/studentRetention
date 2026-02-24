import './globals.css'
import type { Viewport } from 'next'
import { Navigation } from '@/components/Navigation'

export const metadata = {
  title: 'Student Retention Predictor',
  description: 'SHAP-based student retention prediction, analysis, and reporting system',
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  userScalable: true,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="bg-gray-50">
        <Navigation />
        {children}
      </body>
    </html>
  )
}
