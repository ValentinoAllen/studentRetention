import './globals.css'

export const metadata = {
  title: 'Student Retention Analysis',
  description: 'SHAP-based student dropout prediction and analysis',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
