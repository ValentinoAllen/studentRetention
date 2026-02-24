'use client'

import { useState } from 'react'
import type { Outcome } from '@/lib/types'

export interface PredictionFormData {
  studentId: string
  cu1_approved: number
  cu2_approved: number
  cu1_grade: number
  cu2_grade: number
  cu1_evaluations: number
  cu2_evaluations: number
  unemployment_rate: number
  inflation_rate: number
  gdp: number
  age_at_enrollment: number
  debtor: number
  scholarship_holder: number
  mothers_qualification: number
}

export interface PredictionFormProps {
  onSubmit: (data: PredictionFormData) => void
  isLoading?: boolean
}

export function PredictionForm({ onSubmit, isLoading = false }: PredictionFormProps) {
  const [formData, setFormData] = useState<PredictionFormData>({
    studentId: 'STU001',
    cu1_approved: 0,
    cu2_approved: 0,
    cu1_grade: 0,
    cu2_grade: 0,
    cu1_evaluations: 0,
    cu2_evaluations: 0,
    unemployment_rate: 0,
    inflation_rate: 0,
    gdp: 0,
    age_at_enrollment: 0,
    debtor: 0,
    scholarship_holder: 0,
    mothers_qualification: 0,
  })

  // Track which accordion sections are open on mobile (default to closed)
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    academic: false,
    economic: false,
    demographics: false,
  })

  const toggleSection = (section: string) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }))
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'number' ? parseFloat(value) || 0 : value,
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
  }

  const sampleDataSets = [
    {
      label: 'High Risk Dropout',
      data: {
        ...formData,
        cu1_approved: 8,
        cu2_approved: 6,
        cu1_grade: 10,
        cu2_grade: 9,
        cu1_evaluations: 12,
        cu2_evaluations: 10,
        unemployment_rate: 7.5,
      },
    },
    {
      label: 'Likely Graduate',
      data: {
        ...formData,
        cu1_approved: 28,
        cu2_approved: 30,
        cu1_grade: 16,
        cu2_grade: 17,
        cu1_evaluations: 28,
        cu2_evaluations: 30,
        unemployment_rate: 4.2,
      },
    },
    {
      label: 'Average Student',
      data: {
        ...formData,
        cu1_approved: 18,
        cu2_approved: 20,
        cu1_grade: 12,
        cu2_grade: 13,
        cu1_evaluations: 18,
        cu2_evaluations: 20,
        unemployment_rate: 5.8,
      },
    },
  ]

  const loadSampleData = (data: PredictionFormData) => {
    setFormData(data)
  }

  // Helper functions for summary lines
  const getAcademicSummary = () => {
    const parts = []
    if (formData.cu1_grade > 0) parts.push(`Sem-1 Grade ${formData.cu1_grade}`)
    if (formData.cu1_approved > 0) parts.push(`${formData.cu1_approved} units`)
    if (formData.cu2_grade > 0) parts.push(`Sem-2 Grade ${formData.cu2_grade}`)
    if (formData.cu2_approved > 0) parts.push(`${formData.cu2_approved} units`)
    return parts.length > 0 ? parts.slice(0, 2).join(', ') : 'No data entered'
  }

  const getEconomicSummary = () => {
    const parts = []
    if (formData.unemployment_rate > 0) parts.push(`Unemp. ${formData.unemployment_rate}%`)
    if (formData.inflation_rate > 0) parts.push(`Infl. ${formData.inflation_rate}%`)
    if (formData.gdp > 0) parts.push(`GDP ${formData.gdp}B`)
    return parts.length > 0 ? parts.slice(0, 2).join(', ') : 'No data entered'
  }

  const getDemographicsSummary = () => {
    const parts = []
    if (formData.age_at_enrollment > 0) parts.push(`Age ${formData.age_at_enrollment}`)
    if (formData.debtor === 1) parts.push('Debtor')
    if (formData.scholarship_holder === 1) parts.push('Scholarship')
    return parts.length > 0 ? parts.join(', ') : 'No data entered'
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
      <h2 className="text-2xl font-semibold text-gray-900 mb-6">Make a Prediction</h2>

      {/* Sample Data Buttons */}
      <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
        <p className="text-sm font-medium text-blue-900 mb-3">Quick Load Sample Data:</p>
        <div className="flex flex-wrap gap-2">
          {sampleDataSets.map((sample) => (
            <button
              key={sample.label}
              onClick={() => loadSampleData(sample.data)}
              className="px-4 py-2 bg-blue-600 text-white rounded text-sm font-medium hover:bg-blue-700 transition-colors"
            >
              {sample.label}
            </button>
          ))}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
        {/* Student ID */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Student ID</label>
          <input
            type="text"
            name="studentId"
            value={formData.studentId}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-base md:text-sm"
          />
        </div>

        {/* Accordion: Academic Features */}
        <div className="border border-gray-300 rounded-lg">
          <button
            type="button"
            onClick={() => toggleSection('academic')}
            className="w-full px-4 py-3 flex items-center justify-between bg-gray-50 hover:bg-gray-100 transition-colors rounded-lg"
          >
            <span className="font-medium text-gray-900">Academic Performance</span>
            <svg
              className={`w-5 h-5 text-gray-600 transition-transform ${expandedSections.academic ? 'rotate-180' : ''}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </button>

          {/* Summary line on mobile when collapsed */}
          {!expandedSections.academic && (
            <div className="px-4 py-2 text-sm text-gray-600 bg-white md:hidden">{getAcademicSummary()}</div>
          )}

          {/* Expanded content */}
          {expandedSections.academic && (
            <div className="px-4 py-4 bg-white border-t border-gray-200 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Semester 1: Units Approved</label>
                  <input
                    type="number"
                    name="cu1_approved"
                    value={formData.cu1_approved}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-base md:text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Semester 2: Units Approved</label>
                  <input
                    type="number"
                    name="cu2_approved"
                    value={formData.cu2_approved}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-base md:text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Semester 1: Grade</label>
                  <input
                    type="number"
                    name="cu1_grade"
                    value={formData.cu1_grade}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-base md:text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Semester 2: Grade</label>
                  <input
                    type="number"
                    name="cu2_grade"
                    value={formData.cu2_grade}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-base md:text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Semester 1: Evaluations</label>
                  <input
                    type="number"
                    name="cu1_evaluations"
                    value={formData.cu1_evaluations}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-base md:text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Semester 2: Evaluations</label>
                  <input
                    type="number"
                    name="cu2_evaluations"
                    value={formData.cu2_evaluations}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-base md:text-sm"
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Accordion: Economic Features */}
        <div className="border border-gray-300 rounded-lg">
          <button
            type="button"
            onClick={() => toggleSection('economic')}
            className="w-full px-4 py-3 flex items-center justify-between bg-gray-50 hover:bg-gray-100 transition-colors rounded-lg"
          >
            <span className="font-medium text-gray-900">Economic Factors</span>
            <svg
              className={`w-5 h-5 text-gray-600 transition-transform ${expandedSections.economic ? 'rotate-180' : ''}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </button>

          {/* Summary line on mobile when collapsed */}
          {!expandedSections.economic && (
            <div className="px-4 py-2 text-sm text-gray-600 bg-white md:hidden">{getEconomicSummary()}</div>
          )}

          {/* Expanded content */}
          {expandedSections.economic && (
            <div className="px-4 py-4 bg-white border-t border-gray-200 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Unemployment Rate (%)</label>
                  <input
                    type="number"
                    name="unemployment_rate"
                    value={formData.unemployment_rate}
                    onChange={handleChange}
                    step="0.1"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-base md:text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Inflation Rate (%)</label>
                  <input
                    type="number"
                    name="inflation_rate"
                    value={formData.inflation_rate}
                    onChange={handleChange}
                    step="0.1"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-base md:text-sm"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">GDP (Billions)</label>
                <input
                  type="number"
                  name="gdp"
                  value={formData.gdp}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-base md:text-sm"
                />
              </div>
            </div>
          )}
        </div>

        {/* Accordion: Demographics */}
        <div className="border border-gray-300 rounded-lg">
          <button
            type="button"
            onClick={() => toggleSection('demographics')}
            className="w-full px-4 py-3 flex items-center justify-between bg-gray-50 hover:bg-gray-100 transition-colors rounded-lg"
          >
            <span className="font-medium text-gray-900">Demographics</span>
            <svg
              className={`w-5 h-5 text-gray-600 transition-transform ${expandedSections.demographics ? 'rotate-180' : ''}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </button>

          {/* Summary line on mobile when collapsed */}
          {!expandedSections.demographics && (
            <div className="px-4 py-2 text-sm text-gray-600 bg-white md:hidden">{getDemographicsSummary()}</div>
          )}

          {/* Expanded content */}
          {expandedSections.demographics && (
            <div className="px-4 py-4 bg-white border-t border-gray-200 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Age at Enrollment</label>
                  <input
                    type="number"
                    name="age_at_enrollment"
                    value={formData.age_at_enrollment}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-base md:text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Mother's Qualification</label>
                  <input
                    type="number"
                    name="mothers_qualification"
                    value={formData.mothers_qualification}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-base md:text-sm"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Is Debtor (0/1)</label>
                  <input
                    type="number"
                    name="debtor"
                    value={formData.debtor}
                    onChange={handleChange}
                    min="0"
                    max="1"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-base md:text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Scholarship Holder (0/1)</label>
                  <input
                    type="number"
                    name="scholarship_holder"
                    value={formData.scholarship_holder}
                    onChange={handleChange}
                    min="0"
                    max="1"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-base md:text-sm"
                  />
                </div>
              </div>
            </div>
          )}
        </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Semester 1: Units Approved</label>
            <input
              type="number"
              name="cu1_approved"
              value={formData.cu1_approved}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Semester 2: Units Approved</label>
            <input
              type="number"
              name="cu2_approved"
              value={formData.cu2_approved}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        {/* Submit Button - visible on desktop, hidden on mobile (FAB used instead) */}
        <button
          type="submit"
          disabled={isLoading}
          className="hidden md:block w-full px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? 'Making Prediction...' : 'Make Prediction'}
        </button>
      </form>
    </div>
  )
}
