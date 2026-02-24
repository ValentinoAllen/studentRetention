'use client'

import { useState, useEffect } from 'react'
import { OutcomeToggle } from '@/components/OutcomeToggle'
import { ShapBarChart } from '@/components/ShapBarChart'
import { ResearchCallout } from '@/components/ResearchCallout'
import type { Outcome, ShapFeature, ShapData } from '@/lib/types'

// Sample SHAP data - in production, this would come from the API
const SAMPLE_SHAP_DATA: ShapData = {
  'Dropout': [
    { feature: 'cu2_approved', shap_value: 0.1245 },
    { feature: 'cu1_approved', shap_value: 0.0987 },
    { feature: 'cu2_grade', shap_value: 0.0856 },
    { feature: 'cu1_grade', shap_value: 0.0734 },
    { feature: 'unemployment_rate', shap_value: 0.0562 },
    { feature: 'age_at_enrollment', shap_value: 0.0421 },
    { feature: 'cu2_evaluations', shap_value: 0.0389 },
    { feature: 'cu1_evaluations', shap_value: 0.0334 },
    { feature: 'inflation_rate', shap_value: 0.0267 },
    { feature: 'debtor', shap_value: 0.0198 },
  ],
  'Graduate': [
    { feature: 'cu2_grade', shap_value: 0.1456 },
    { feature: 'cu2_approved', shap_value: 0.1289 },
    { feature: 'cu1_grade', shap_value: 0.1045 },
    { feature: 'cu1_approved', shap_value: 0.0923 },
    { feature: 'cu2_evaluations', shap_value: 0.0567 },
    { feature: 'cu1_evaluations', shap_value: 0.0478 },
    { feature: 'unemployment_rate', shap_value: 0.0356 },
    { feature: 'gdp', shap_value: 0.0289 },
    { feature: 'age_at_enrollment', shap_value: 0.0234 },
    { feature: 'scholarship_holder', shap_value: 0.0156 },
  ],
  'Enrolled': [
    { feature: 'cu1_approved', shap_value: 0.0876 },
    { feature: 'cu2_approved', shap_value: 0.0734 },
    { feature: 'cu1_grade', shap_value: 0.0612 },
    { feature: 'cu2_grade', shap_value: 0.0545 },
    { feature: 'cu1_evaluations', shap_value: 0.0423 },
    { feature: 'cu2_evaluations', shap_value: 0.0367 },
    { feature: 'age_at_enrollment', shap_value: 0.0289 },
    { feature: 'unemployment_rate', shap_value: 0.0198 },
    { feature: 'inflation_rate', shap_value: 0.0145 },
    { feature: 'mothers_qualification', shap_value: 0.0089 },
  ],
}

export default function ShapAnalysisPage() {
  const [selectedOutcome, setSelectedOutcome] = useState<Outcome>('Dropout')
  const [shapData, setShapData] = useState<ShapData>(SAMPLE_SHAP_DATA)
  const [loading, setLoading] = useState(false)

  const handleOutcomeChange = async (outcome: Outcome) => {
    setSelectedOutcome(outcome)
    // In production, fetch data from API here
    // const response = await fetch(`/api/shap?outcome=${outcome}`)
    // const data = await response.json()
    // setShapData(data)
  }

  const currentData = (shapData[selectedOutcome] || []) as ShapFeature[]

  return (
    <main className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-6 md:py-8">
        <header className="mb-6 md:mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
            SHAP Analysis Dashboard
          </h1>
          <p className="text-muted-foreground text-base md:text-lg">
            Explainable AI for Student Retention Prediction
          </p>
        </header>

        {/* Outcome Toggle */}
        <OutcomeToggle 
          selectedOutcome={selectedOutcome}
          onOutcomeChange={handleOutcomeChange}
        />

        {/* Charts Grid */}
        <div className="grid grid-cols-1 gap-6 md:gap-8 mb-6 md:mb-8">
          <ShapBarChart 
            data={currentData}
            outcome={selectedOutcome}
          />
        </div>

        {/* Research Callout */}
        <ResearchCallout />

        {/* Info Section */}
        <section className="bg-muted rounded-lg p-4 md:p-6 mt-6 md:mt-8">
          <h3 className="text-base md:text-lg font-semibold text-foreground mb-4">
            How to Read This Dashboard
          </h3>
          <ul className="space-y-2 md:space-y-3 text-muted-foreground text-sm md:text-base">
            <li className="flex gap-3">
              <span className="font-bold text-foreground flex-shrink-0">📊</span>
              <span>Select an outcome (Dropout, Graduate, Enrolled) to see which features are most important for that prediction</span>
            </li>
            <li className="flex gap-3">
              <span className="font-bold text-foreground flex-shrink-0">▲▼</span>
              <span>Arrows indicate direction: high values (▲) vs low values (▼) that influence the outcome</span>
            </li>
            <li className="flex gap-3">
              <span className="font-bold text-foreground flex-shrink-0">👆</span>
              <span>Hover over any bar to see the full feature name, SHAP value, and a plain-language explanation</span>
            </li>
            <li className="flex gap-3">
              <span className="font-bold text-foreground flex-shrink-0">🔍</span>
              <span>Larger bars mean the feature has stronger predictive power for that outcome</span>
            </li>
          </ul>
        </section>
      </div>
    </main>
  )
}
