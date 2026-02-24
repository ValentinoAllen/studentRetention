'use client';

import { ConfusionMatrix, ConfusionMatrixSummary } from '@/components/ConfusionMatrix';

export default function EvaluationPage() {
  const confusionMatrixData = [
    [248, 31, 6],      // Dropout: actual vs predicted
    [28, 103, 28],     // Enrolled: actual vs predicted
    [12, 18, 411],     // Graduate: actual vs predicted
  ];

  const classLabels = ['Dropout', 'Enrolled', 'Graduate'];

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Model Evaluation</h1>
          <p className="text-gray-600">
            Comprehensive performance metrics and confusion matrix analysis for the student retention prediction model.
          </p>
        </div>

        {/* Confusion Matrix Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 mb-8">
          <div className="mb-6">
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">Confusion Matrix</h2>
            <p className="text-sm text-gray-600">
              Cell colors indicate prediction frequency (darker = more predictions). Each cell shows the count and 
              percentage of that true class. Hover over cells to see detailed explanations.
            </p>
          </div>

          <ConfusionMatrix data={confusionMatrixData} classLabels={classLabels} />
          
          <div className="mt-6 p-4 bg-gray-50 rounded border border-gray-200 text-sm text-gray-700">
            <strong>How to read this:</strong> Rows represent the actual student outcome. Columns represent what 
            the model predicted. Diagonal cells (red/green/blue background) are correct predictions. Off-diagonal cells 
            are errors. The percentage below each count shows what portion of that true class falls into that cell.
          </div>
        </div>

        {/* Summary */}
        <ConfusionMatrixSummary />

        {/* Detailed Metrics */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 mt-8">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">Key Metrics by Class</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Dropout Metrics */}
            <div className="p-4 border border-red-200 rounded-lg bg-red-50">
              <h4 className="font-semibold text-red-900 mb-3">Dropout Class</h4>
              <div className="space-y-2 text-sm text-red-800">
                <div>
                  <span className="font-medium">True Positives:</span> 248
                </div>
                <div>
                  <span className="font-medium">False Negatives:</span> 37 (missed at-risk students)
                </div>
                <div>
                  <span className="font-medium">Recall:</span> 87.0%
                </div>
                <div>
                  <span className="font-medium">Impact:</span> High priority for improvement
                </div>
              </div>
            </div>

            {/* Enrolled Metrics */}
            <div className="p-4 border border-blue-200 rounded-lg bg-blue-50">
              <h4 className="font-semibold text-blue-900 mb-3">Enrolled Class</h4>
              <div className="space-y-2 text-sm text-blue-800">
                <div>
                  <span className="font-medium">True Positives:</span> 103
                </div>
                <div>
                  <span className="font-medium">False Negatives:</span> 56
                </div>
                <div>
                  <span className="font-medium">Recall:</span> 64.8%
                </div>
                <div>
                  <span className="font-medium">Impact:</span> Moderate performance
                </div>
              </div>
            </div>

            {/* Graduate Metrics */}
            <div className="p-4 border border-green-200 rounded-lg bg-green-50">
              <h4 className="font-semibold text-green-900 mb-3">Graduate Class</h4>
              <div className="space-y-2 text-sm text-green-800">
                <div>
                  <span className="font-medium">True Positives:</span> 411
                </div>
                <div>
                  <span className="font-medium">False Negatives:</span> 30
                </div>
                <div>
                  <span className="font-medium">Recall:</span> 93.2%
                </div>
                <div>
                  <span className="font-medium">Impact:</span> Excellent performance
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Links */}
        <div className="mt-8 flex gap-4">
          <a
            href="/shap"
            className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            View SHAP Analysis
          </a>
        </div>
      </div>
    </main>
  );
}
