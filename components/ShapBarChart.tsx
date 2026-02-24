'use client'

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts'
import { useState } from 'react'
import type { ShapFeature, Outcome } from '@/lib/types'
import { getExplanation, getDirection } from '@/lib/types'

interface ShapBarChartProps {
  data: ShapFeature[]
  outcome: Outcome
}

interface CustomTooltipProps {
  active?: boolean
  payload?: Array<{
    value: number
    payload: ShapFeature & {
      direction: 'up' | 'down'
      explanation: string
    }
  }>
}

export function ShapBarChart({ data, outcome }: ShapBarChartProps) {
  const [hoveredFeature, setHoveredFeature] = useState<string | null>(null)

  const chartData = data.map((item) => {
    const direction = getDirection(item.shap_value, item.feature, outcome)
    const explanation = getExplanation(item.feature, outcome)
    return {
      ...item,
      direction,
      explanation,
    }
  })

  // Color mapping based on direction
  const getBarColor = (item: (typeof chartData)[0]) => {
    if (outcome === 'Dropout') {
      return item.direction === 'up' ? '#ef4444' : '#22c55e'
    }
    if (outcome === 'Graduate') {
      return item.direction === 'up' ? '#22c55e' : '#ef4444'
    }
    return item.direction === 'up' ? '#3b82f6' : '#60a5fa'
  }

  const CustomTooltip = ({ active, payload }: CustomTooltipProps) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload
      const directionArrow = data.direction === 'up' ? '▲' : '▼'
      const arrowColor = data.direction === 'up' ? '#ef4444' : '#3b82f6'

      return (
        <div className="bg-white border border-gray-300 rounded-lg p-4 shadow-lg max-w-xs">
          <p className="font-semibold text-foreground mb-2">{data.feature}</p>
          <p className="text-sm text-muted-foreground mb-2">
            <span style={{ color: arrowColor }} className="font-bold mr-1">
              {directionArrow}
            </span>
            SHAP Value: <span className="font-semibold">{Math.abs(data.shap_value).toFixed(4)}</span>
          </p>
          <p className="text-sm text-gray-700 leading-relaxed">
            {data.explanation}
          </p>
        </div>
      )
    }
    return null
  }

  return (
    <div className="bg-white rounded-lg p-6 border border-border shadow-sm">
      <h3 className="text-lg font-semibold mb-4 text-foreground">
        Feature Importance - {outcome}
      </h3>
      <ResponsiveContainer width="100%" height={400}>
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e5e5" />
          <XAxis
            dataKey="feature"
            angle={-45}
            textAnchor="end"
            height={80}
            tick={{ fontSize: 12 }}
          />
          <YAxis label={{ value: 'SHAP Value', angle: -90, position: 'insideLeft' }} />
          <Tooltip content={<CustomTooltip />} />
          <Bar
            dataKey="shap_value"
            radius={[8, 8, 0, 0]}
            onMouseEnter={(data) => setHoveredFeature(data.feature)}
            onMouseLeave={() => setHoveredFeature(null)}
          >
            {chartData.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={getBarColor(entry)}
                opacity={hoveredFeature === null || hoveredFeature === entry.feature ? 1 : 0.6}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>

      {/* Direction Legend */}
      <div className="flex gap-6 mt-6 justify-center text-sm">
        {outcome === 'Dropout' && (
          <>
            <div className="flex items-center gap-2">
              <span className="text-red-500 font-bold">▲</span>
              <span>High value INCREASES Dropout risk</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-blue-500 font-bold">▼</span>
              <span>Low value INCREASES Dropout risk</span>
            </div>
          </>
        )}
        {outcome === 'Graduate' && (
          <>
            <div className="flex items-center gap-2">
              <span className="text-green-500 font-bold">▲</span>
              <span>High value INCREASES Graduation chance</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-red-500 font-bold">▼</span>
              <span>Low value INCREASES Graduation chance</span>
            </div>
          </>
        )}
        {outcome === 'Enrolled' && (
          <>
            <div className="flex items-center gap-2">
              <span className="text-blue-500 font-bold">▲</span>
              <span>High value increases enrollment</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-blue-400 font-bold">▼</span>
              <span>Low value increases enrollment</span>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
