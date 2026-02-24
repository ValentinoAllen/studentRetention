import './globals.css'

export const metadata = {
  title: 'Student Retention Predictor',
  description: 'SHAP-based student retention prediction, analysis, and reporting system',
  viewport: {
    width: 'device-width',
    initialScale: 1,
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="bg-gray-50">
        {/* Header Navigation */}
        <nav className="bg-white border-b border-gray-200 sticky top-0 z-50 print:hidden">
          <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
            <div className="font-bold text-lg text-gray-900">Student Retention System</div>
            <div className="flex gap-6">
              <a href="/prediction" className="text-gray-700 hover:text-blue-600 transition-colors">
                Make Prediction
              </a>
              <a href="/shap" className="text-gray-700 hover:text-blue-600 transition-colors">
                SHAP Analysis
              </a>
              <a href="/evaluation" className="text-gray-700 hover:text-blue-600 transition-colors">
                Model Evaluation
              </a>
            </div>
          </div>
        </nav>
        {children}
      </body>
    </html>
  )
}
