'use client'

import { useState } from 'react'
import { PredictionForm, type PredictionFormData } from '@/components/PredictionForm'
import { PredictionReport } from '@/components/PredictionReport'
import { BottomSheet } from '@/components/BottomSheet'
import type { Outcome, ShapFeature } from '@/lib/types'

// Sample SHAP features for predictions - in production, this would come from the model
const SAMPLE_SHAP_FEATURES: ShapFeature[] = [
  {
    feature: 'cu2_approved',
    shap_value: 0.1245,
    direction: 'down',
    explanation: 'Higher units approved in Semester 2 reduces dropout risk significantly',
  },
  {
    feature: 'cu1_approved',
    shap_value: 0.0987,
    direction: 'down',
    explanation: 'Units approved in Semester 1 is a strong indicator of student engagement',
  },
  {
    feature: 'cu2_grade',
    shap_value: 0.0856,
    direction: 'down',
    explanation: 'Better grades in Semester 2 strongly correlate with completion',
  },
  {
    feature: 'cu1_grade',
    shap_value: 0.0734,
    direction: 'down',
    explanation: 'Semester 1 grades establish foundational academic success',
  },
  {
    feature: 'unemployment_rate',
    shap_value: 0.0562,
    direction: 'up',
    explanation: 'Higher unemployment rate in the economy increases dropout risk',
  },
]

export default function PredictionPage() {
  const [prediction, setPrediction] = useState<{
    outcome: Outcome
    confidence: number
    probabilities: {
      Dropout: number
      Graduate: number
      Enrolled: number
    }
    studentId: string
  } | null>(null)

  const [isLoading, setIsLoading] = useState(false)
  const [showMobileSheet, setShowMobileSheet] = useState(false)

  const simulatePrediction = (data: PredictionFormData) => {
    setIsLoading(true)

    // Simulate API call delay
    setTimeout(() => {
      // Simple rule-based prediction for demo
      const academicScore =
        data.cu1_approved +
        data.cu2_approved +
        data.cu1_grade +
        data.cu2_grade +
        data.cu1_evaluations +
        data.cu2_evaluations

      const economicFactor = Math.max(0, 10 - data.unemployment_rate)
      const financialFactor = data.debtor === 1 ? 0 : 2
      const scholarshipFactor = data.scholarship_holder === 1 ? 1 : 0

      const totalScore = academicScore + economicFactor + financialFactor + scholarshipFactor

      let outcome: Outcome
      let dropoutProb: number
      let graduateProb: number
      let enrolledProb: number

      if (totalScore < 50) {
        outcome = 'Dropout'
        dropoutProb = 0.65
        enrolledProb = 0.25
        graduateProb = 0.1
      } else if (totalScore < 100) {
        outcome = 'Enrolled'
        enrolledProb = 0.55
        dropoutProb = 0.25
        graduateProb = 0.2
      } else {
        outcome = 'Graduate'
        graduateProb = 0.72
        enrolledProb = 0.18
        dropoutProb = 0.1
      }

      setPrediction({
        outcome,
        confidence: Math.max(dropoutProb, Math.max(graduateProb, enrolledProb)),
        probabilities: {
          Dropout: dropoutProb,
          Graduate: graduateProb,
          Enrolled: enrolledProb,
        },
        studentId: data.studentId,
      })
      setShowMobileSheet(true)
      setIsLoading(false)
    }, 1000)
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-6 pb-32 md:pb-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">Student Retention Predictor</h1>
          <p className="text-gray-600 text-sm md:text-base">
            Enter student information to generate a retention risk assessment and exportable report.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
          {/* Form Section */}
          <div className="lg:col-span-1">
            <PredictionForm onSubmit={simulatePrediction} isLoading={isLoading} />
          </div>

          {/* Results Section - Hidden on mobile (shown in bottom sheet instead) */}
          <div className="lg:col-span-2 hidden md:block">
            {prediction ? (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 md:p-8">
                <h2 className="text-xl md:text-2xl font-semibold text-gray-900 mb-6">Prediction Results</h2>

                {/* Export Button */}
                <div className="mb-8 flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={() => window.print()}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors text-sm md:text-base"
                  >
                    Export PDF Report
                  </button>
                  <button
                    onClick={() => {
                      setPrediction(null)
                      setShowMobileSheet(false)
                    }}
                    className="px-6 py-2 bg-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-400 transition-colors text-sm md:text-base"
                  >
                    New Prediction
                  </button>
                </div>

                {/* Prediction Result Box */}
                <div className="mb-8 p-6 rounded-lg border-2 border-gray-300">
                  <h3 className="text-sm font-semibold text-gray-600 mb-3">PREDICTED OUTCOME</h3>
                  <div
                    className={`flex items-center gap-4 ${
                      prediction.outcome === 'Dropout'
                        ? 'bg-red-50'
                        : prediction.outcome === 'Graduate'
                          ? 'bg-green-50'
                          : 'bg-blue-50'
                    } p-6 rounded-lg`}
                  >
                    <div
                      className={`px-6 py-4 text-white font-bold rounded ${
                        prediction.outcome === 'Dropout'
                          ? 'bg-red-600'
                          : prediction.outcome === 'Graduate'
                            ? 'bg-green-600'
                            : 'bg-blue-600'
                      }`}
                    >
                      <div className="text-2xl">{prediction.outcome}</div>
                      <div className="text-sm mt-1">{(prediction.confidence * 100).toFixed(1)}% Confidence</div>
                    </div>
                    <div className="flex-1">
                      <p className="text-gray-700">
                        {prediction.outcome === 'Dropout'
                          ? 'This student shows elevated risk factors and requires intervention support.'
                          : prediction.outcome === 'Graduate'
                            ? 'This student is on track for successful degree completion.'
                            : 'This student is expected to continue their studies.'}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Probability Breakdown */}
                <div className="mb-8">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Probability Breakdown</h3>
                  <div className="space-y-4">
                    {Object.entries(prediction.probabilities).map(([outcome, prob]) => (
                      <div key={outcome}>
                        <div className="flex justify-between mb-2">
                          <span className="text-sm font-medium text-gray-700">{outcome}</span>
                          <span className="text-sm font-bold text-gray-900">{(prob * 100).toFixed(1)}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-3">
                          <div
                            className={`h-3 rounded-full ${
                              outcome === 'Dropout'
                                ? 'bg-red-600'
                                : outcome === 'Graduate'
                                  ? 'bg-green-600'
                                  : 'bg-blue-600'
                            }`}
                            style={{ width: `${prob * 100}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Top Features */}
                <div className="mb-8">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Top 5 Most Influential Features</h3>
                  <div className="space-y-3">
                    {SAMPLE_SHAP_FEATURES.slice(0, 5).map((feature, idx) => (
                      <div key={idx} className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                        <div className="flex justify-between mb-1">
                          <span className="font-semibold text-gray-900">{feature.feature}</span>
                          <span className="text-sm text-gray-600">{feature.shap_value.toFixed(4)}</span>
                        </div>
                        <p className="text-sm text-gray-600">{feature.explanation}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Recommendation */}
                <div className="p-6 bg-blue-50 rounded-lg border border-blue-200">
                  <h3 className="text-lg font-semibold text-blue-900 mb-4">
                    {prediction.outcome === 'Dropout'
                      ? 'High Priority Interventions'
                      : prediction.outcome === 'Graduate'
                        ? 'Support for Success'
                        : 'Engagement and Retention'}
                  </h3>
                  <ul className="space-y-2 text-sm text-blue-800">
                    {(prediction.outcome === 'Dropout'
                      ? [
                          'Schedule immediate academic advising session',
                          'Connect student with peer mentoring programs',
                          'Explore financial assistance options',
                          'Provide resources for course selection and study skills',
                          'Monitor grades closely in remaining semesters',
                        ]
                      : prediction.outcome === 'Graduate'
                        ? [
                            'Encourage participation in research opportunities',
                            'Suggest advanced coursework and seminars',
                            'Provide guidance for postgraduate planning',
                            'Connect with alumni network and career services',
                            'Continue current academic support as needed',
                          ]
                        : [
                            'Maintain regular check-ins with academic advisor',
                            'Encourage involvement in student organizations',
                            'Monitor course completion and progress',
                            'Provide support for course selection',
                            'Identify any emerging challenges early',
                          ]
                    ).map((item, idx) => (
                      <li key={idx} className="flex gap-2">
                        <span className="font-bold">•</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Print-only Report */}
                <PredictionReport
                  studentId={prediction.studentId}
                  prediction={prediction.outcome}
                  confidence={prediction.confidence}
                  probabilities={prediction.probabilities}
                  inputSummary={{}}
                  topFeatures={SAMPLE_SHAP_FEATURES.slice(0, 5)}
                />
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
                <h2 className="text-2xl font-semibold text-gray-900 mb-2">No Prediction Yet</h2>
                <p className="text-gray-600">
                  Fill out the form on the left and click "Make Prediction" to get started.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Navigation Links */}
        <div className="mt-12 flex gap-3 flex-wrap text-sm md:text-base">
          <a
            href="/shap"
            className="px-4 md:px-6 py-2 md:py-3 bg-white text-blue-600 rounded-lg font-medium border border-blue-600 hover:bg-blue-50 transition-colors"
          >
            View SHAP Analysis
          </a>
          <a
            href="/evaluation"
            className="px-4 md:px-6 py-2 md:py-3 bg-white text-blue-600 rounded-lg font-medium border border-blue-600 hover:bg-blue-50 transition-colors"
          >
            View Model Evaluation
          </a>
        </div>
      </div>

      {/* Mobile Bottom Sheet for Results */}
      <BottomSheet
        isOpen={showMobileSheet}
        onClose={() => setShowMobileSheet(false)}
        title="Prediction Results"
      >
        {prediction && (
          <div className="space-y-6">
            {/* Prediction Result Box */}
            <div className="p-4 rounded-lg border-2 border-gray-300">
              <h3 className="text-xs font-semibold text-gray-600 mb-3">PREDICTED OUTCOME</h3>
              <div
                className={`flex items-center gap-4 ${
                  prediction.outcome === 'Dropout'
                    ? 'bg-red-50'
                    : prediction.outcome === 'Graduate'
                      ? 'bg-green-50'
                      : 'bg-blue-50'
                } p-4 rounded-lg`}
              >
                <div
                  className={`px-4 py-3 text-white font-bold rounded flex-shrink-0 ${
                    prediction.outcome === 'Dropout'
                      ? 'bg-red-600'
                      : prediction.outcome === 'Graduate'
                        ? 'bg-green-600'
                        : 'bg-blue-600'
                  }`}
                >
                  <div className="text-lg">{prediction.outcome}</div>
                  <div className="text-xs mt-1">{(prediction.confidence * 100).toFixed(1)}%</div>
                </div>
                <div>
                  <p className="text-sm text-gray-700">
                    {prediction.outcome === 'Dropout'
                      ? 'This student shows elevated risk factors and requires intervention support.'
                      : prediction.outcome === 'Graduate'
                        ? 'This student is on track for successful degree completion.'
                        : 'This student is expected to continue their studies.'}
                  </p>
                </div>
              </div>
            </div>

            {/* Probability Breakdown */}
            <div>
              <h3 className="text-sm font-semibold text-gray-900 mb-3">Probability Breakdown</h3>
              <div className="space-y-3">
                {Object.entries(prediction.probabilities).map(([outcome, prob]) => (
                  <div key={outcome}>
                    <div className="flex justify-between mb-2">
                      <span className="text-xs font-medium text-gray-700">{outcome}</span>
                      <span className="text-xs font-bold text-gray-900">{(prob * 100).toFixed(1)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full ${
                          outcome === 'Dropout'
                            ? 'bg-red-600'
                            : outcome === 'Graduate'
                              ? 'bg-green-600'
                              : 'bg-blue-600'
                        }`}
                        style={{ width: `${prob * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Top Features */}
            <div>
              <h3 className="text-sm font-semibold text-gray-900 mb-3">Top 5 Most Influential Features</h3>
              <div className="space-y-2">
                {SAMPLE_SHAP_FEATURES.slice(0, 5).map((feature, idx) => (
                  <div key={idx} className="p-2 bg-gray-50 rounded text-xs border border-gray-200">
                    <div className="font-semibold text-gray-900">{feature.feature}</div>
                    <p className="text-gray-600 mt-1">{feature.explanation}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Export Button in Sheet */}
            <button
              onClick={() => window.print()}
              className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors text-sm"
            >
              Export PDF Report
            </button>
          </div>
        )}
      </BottomSheet>

      {/* Mobile Floating Action Button */}
      <button
        onClick={(e) => {
          e.preventDefault()
          document.querySelector('form')?.dispatchEvent(new Event('submit', { bubbles: true }))
        }}
        disabled={isLoading}
        className="fixed bottom-6 right-6 md:hidden z-30 w-16 h-16 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-full shadow-lg flex items-center justify-center font-bold text-2xl transition-all active:scale-95"
        aria-label="Make Prediction"
        title="Make Prediction"
      >
        {isLoading ? (
          <svg className="w-6 h-6 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
            />
          </svg>
        ) : (
          '→'
        )}
      </button>
    </main>
  )
}
