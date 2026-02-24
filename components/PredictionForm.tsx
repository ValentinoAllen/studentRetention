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

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Student ID */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Student ID</label>
          <input
            type="text"
            name="studentId"
            value={formData.studentId}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Academic Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Semester 1: Grade</label>
            <input
              type="number"
              name="cu1_grade"
              value={formData.cu1_grade}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Semester 2: Grade</label>
            <input
              type="number"
              name="cu2_grade"
              value={formData.cu2_grade}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Semester 1: Evaluations</label>
            <input
              type="number"
              name="cu1_evaluations"
              value={formData.cu1_evaluations}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Semester 2: Evaluations</label>
            <input
              type="number"
              name="cu2_evaluations"
              value={formData.cu2_evaluations}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Economic Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Unemployment Rate (%)</label>
            <input
              type="number"
              name="unemployment_rate"
              value={formData.unemployment_rate}
              onChange={handleChange}
              step="0.1"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">GDP (Billions)</label>
            <input
              type="number"
              name="gdp"
              value={formData.gdp}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Student Demographics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Age at Enrollment</label>
            <input
              type="number"
              name="age_at_enrollment"
              value={formData.age_at_enrollment}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Is Debtor (0/1)</label>
            <input
              type="number"
              name="debtor"
              value={formData.debtor}
              onChange={handleChange}
              min="0"
              max="1"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Mother's Qualification Level</label>
          <input
            type="number"
            name="mothers_qualification"
            value={formData.mothers_qualification}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? 'Making Prediction...' : 'Make Prediction'}
        </button>
      </form>
    </div>
  )
}
