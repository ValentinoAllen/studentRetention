export interface ShapFeature {
  feature: string
  shap_value: number
  direction?: 'up' | 'down'
  explanation?: string
}

export interface ShapData {
  [key: string]: ShapFeature[]
}

export type Outcome = 'Dropout' | 'Graduate' | 'Enrolled'

// Feature explanation mapping
export const FEATURE_EXPLANATIONS: Record<string, Record<string, string>> = {
  'cu1_approved': {
    'Dropout': 'Students with MORE approved units in Semester 1 are LESS likely to Dropout',
    'Graduate': 'Students with MORE approved units in Semester 1 are MORE likely to Graduate',
    'Enrolled': 'Students with MORE approved units in Semester 1 are LESS likely to stay Enrolled'
  },
  'cu2_approved': {
    'Dropout': 'Students with MORE approved units in Semester 2 are LESS likely to Dropout',
    'Graduate': 'Students with MORE approved units in Semester 2 are MORE likely to Graduate',
    'Enrolled': 'Students with MORE approved units in Semester 2 are LESS likely to stay Enrolled'
  },
  'cu1_grade': {
    'Dropout': 'Students with HIGHER grades in Semester 1 are LESS likely to Dropout',
    'Graduate': 'Students with HIGHER grades in Semester 1 are MORE likely to Graduate',
    'Enrolled': 'Students with HIGHER grades in Semester 1 are LESS likely to stay Enrolled'
  },
  'cu2_grade': {
    'Dropout': 'Students with HIGHER grades in Semester 2 are LESS likely to Dropout',
    'Graduate': 'Students with HIGHER grades in Semester 2 are MORE likely to Graduate',
    'Enrolled': 'Students with HIGHER grades in Semester 2 are LESS likely to stay Enrolled'
  },
  'unemployment_rate': {
    'Dropout': 'Higher unemployment rate INCREASES Dropout risk',
    'Graduate': 'Higher unemployment rate DECREASES likelihood of Graduation',
    'Enrolled': 'Higher unemployment rate affects enrollment'
  },
  'age_at_enrollment': {
    'Dropout': 'Older students at enrollment have different Dropout risk',
    'Graduate': 'Age at enrollment affects Graduation likelihood',
    'Enrolled': 'Age at enrollment impacts enrollment status'
  },
}

export function getExplanation(feature: string, outcome: Outcome): string {
  const featureLower = feature.toLowerCase()
  return FEATURE_EXPLANATIONS[featureLower]?.[outcome] || 
    `Feature "${feature}" impacts ${outcome} likelihood based on SHAP analysis`
}

export function getDirection(
  shap_value: number,
  featureName: string,
  outcome: Outcome
): 'up' | 'down' {
  // For most academic features, positive SHAP values (high values) reduce dropout
  const academicFeatures = ['approved', 'grade', 'credited', 'evaluations']
  const isAcademic = academicFeatures.some(f => featureName.toLowerCase().includes(f))

  if (outcome === 'Dropout') {
    return isAcademic 
      ? (shap_value > 0 ? 'down' : 'up')
      : (shap_value > 0 ? 'up' : 'down')
  }

  if (outcome === 'Graduate') {
    return isAcademic 
      ? (shap_value > 0 ? 'up' : 'down')
      : (shap_value > 0 ? 'down' : 'up')
  }

  return shap_value > 0 ? 'down' : 'up'
}
