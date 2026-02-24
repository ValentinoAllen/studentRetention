'use client'

import { useState } from 'react'

type Outcome = 'Dropout' | 'Graduate' | 'Enrolled'

interface OutcomeToggleProps {
  onOutcomeChange: (outcome: Outcome) => void
  selectedOutcome: Outcome
}

export function OutcomeToggle({ onOutcomeChange, selectedOutcome }: OutcomeToggleProps) {
  const outcomes: Array<{ label: string; value: Outcome; color: string; icon: string }> = [
    { label: 'Dropout', value: 'Dropout', color: '#ef4444', icon: '🔴' },
    { label: 'Graduate', value: 'Graduate', color: '#22c55e', icon: '🟢' },
    { label: 'Enrolled', value: 'Enrolled', color: '#3b82f6', icon: '🔵' },
  ]

  return (
    <div className="flex gap-2 mb-8">
      {outcomes.map((outcome) => (
        <button
          key={outcome.value}
          onClick={() => onOutcomeChange(outcome.value)}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-all ${
            selectedOutcome === outcome.value
              ? 'text-white shadow-lg'
              : 'bg-muted text-foreground hover:bg-gray-200'
          }`}
          style={
            selectedOutcome === outcome.value
              ? { backgroundColor: outcome.color }
              : {}
          }
        >
          <span>{outcome.icon}</span>
          <span>{outcome.label}</span>
        </button>
      ))}
    </div>
  )
}
