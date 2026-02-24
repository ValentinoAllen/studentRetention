'use client';

import { useState } from 'react';

interface MatrixCell {
  count: number;
  percentage: number;
  actualClass: string;
  predictedClass: string;
}

interface ConfusionMatrixProps {
  data: number[][];
  classLabels: string[];
}

export function ConfusionMatrix({ data, classLabels }: ConfusionMatrixProps) {
  const [hoveredCell, setHoveredCell] = useState<[number, number] | null>(null);

  // Calculate percentages for each true class (row)
  const percentages: number[][] = [];
  const rowTotals = data.map(row => row.reduce((a, b) => a + b, 0));

  for (let i = 0; i < data.length; i++) {
    percentages[i] = [];
    for (let j = 0; j < data[i].length; j++) {
      percentages[i][j] = (data[i][j] / rowTotals[i]) * 100;
    }
  }

  // Color mapping for each row (true class)
  const getRowColor = (rowIndex: number, value: number, maxValue: number) => {
    const intensity = value / maxValue;
    const colors = ['bg-red', 'bg-green', 'bg-blue'];
    const colorName = colors[rowIndex];

    // Create color intensity scale
    if (intensity < 0.3) {
      return colorName === 'bg-red' ? 'bg-red-100' : colorName === 'bg-green' ? 'bg-green-100' : 'bg-blue-100';
    } else if (intensity < 0.6) {
      return colorName === 'bg-red' ? 'bg-red-300' : colorName === 'bg-green' ? 'bg-green-300' : 'bg-blue-300';
    } else {
      return colorName === 'bg-red' ? 'bg-red-600' : colorName === 'bg-green' ? 'bg-green-600' : 'bg-blue-600';
    }
  };

  const getTextColor = (rowIndex: number, value: number, maxValue: number) => {
    const intensity = value / maxValue;
    if (intensity > 0.5) return 'text-white';
    return 'text-gray-900';
  };

  const getTooltip = (rowIndex: number, colIndex: number): string => {
    const count = data[rowIndex][colIndex];
    const actualClass = classLabels[rowIndex];
    const predictedClass = classLabels[colIndex];
    const percentage = percentages[rowIndex][colIndex].toFixed(1);

    if (rowIndex === colIndex) {
      return `${count} students were actually ${actualClass} and were CORRECTLY predicted as ${predictedClass} (True Positive)\n${percentage}% recall`;
    } else {
      const isHighPriority = actualClass === 'Dropout' ? ' — most critical error for intervention' : '';
      return `${count} students were actually ${actualClass} but were INCORRECTLY predicted as ${predictedClass} (False ${predictedClass === classLabels[rowIndex] ? 'Positive' : 'Negative'}${isHighPriority})\n${percentage}% misclassification`;
    }
  };

  const maxValue = Math.max(...data.flat());

  return (
    <div className="w-full">
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr>
              <th className="p-3 text-left text-sm font-semibold text-gray-700 border border-gray-200">
                Actual / Predicted
              </th>
              {classLabels.map((label) => (
                <th
                  key={label}
                  className="p-3 text-center text-sm font-semibold text-gray-700 border border-gray-200 w-32"
                >
                  {label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {classLabels.map((actualLabel, rowIndex) => (
              <tr key={actualLabel}>
                <td className="p-3 text-sm font-semibold text-gray-700 border border-gray-200 bg-gray-50">
                  {actualLabel}
                </td>
                {data[rowIndex].map((count, colIndex) => {
                  const cellColor = getRowColor(rowIndex, count, maxValue);
                  const textColor = getTextColor(rowIndex, count, maxValue);
                  const isHovered = hoveredCell?.[0] === rowIndex && hoveredCell?.[1] === colIndex;
                  const percentage = percentages[rowIndex][colIndex].toFixed(1);

                  return (
                    <td
                      key={`${rowIndex}-${colIndex}`}
                      className={`p-4 text-center border border-gray-200 cursor-help relative transition-all ${cellColor} ${textColor} ${
                        isHovered ? 'ring-2 ring-yellow-400 ring-offset-1' : ''
                      }`}
                      onMouseEnter={() => setHoveredCell([rowIndex, colIndex])}
                      onMouseLeave={() => setHoveredCell(null)}
                      title={getTooltip(rowIndex, colIndex)}
                    >
                      <div className="flex flex-col items-center gap-1">
                        <div className="text-lg font-bold">{count}</div>
                        <div className="text-xs opacity-90">{percentage}%</div>
                      </div>
                      {isHovered && (
                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded shadow-lg whitespace-nowrap z-10 pointer-events-none">
                          {getTooltip(rowIndex, colIndex).split('\n')[0]}
                        </div>
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export function ConfusionMatrixSummary() {
  // Data: Dropout, Enrolled, Graduate
  const data = [
    [248, 31, 6],    // Dropout row
    [28, 103, 28],   // Enrolled row
    [12, 18, 411],   // Graduate row
  ];
  
  const rowTotals = data.map(row => row.reduce((a, b) => a + b, 0));
  
  // Calculate recall (true positive rate) for each class
  const dropoutRecall = (data[0][0] / rowTotals[0]) * 100;
  const enrolledRecall = (data[1][1] / rowTotals[1]) * 100;
  const graduateRecall = (data[2][2] / rowTotals[2]) * 100;
  
  const dropoutMissedCount = rowTotals[0] - data[0][0];
  const dropoutMissedPer100 = (dropoutMissedCount / rowTotals[0]) * 100;

  return (
    <div className="mt-8 p-6 bg-blue-50 border border-blue-200 rounded-lg">
      <h3 className="text-lg font-semibold text-blue-900 mb-3">Performance Summary</h3>
      <div className="space-y-2 text-sm text-blue-800">
        <p>
          <strong>Graduate Detection (Best Performer):</strong> The model performs best at identifying 
          graduate students with <span className="font-semibold">{graduateRecall.toFixed(1)}%</span> recall.
        </p>
        <p>
          <strong>Dropout Detection (Critical):</strong> The model catches 
          <span className="font-semibold"> {dropoutRecall.toFixed(1)}%</span> of at-risk students, 
          missing approximately <span className="font-semibold">{dropoutMissedPer100.toFixed(1)}%</span> ({dropoutMissedCount} students per 285 at-risk cases). 
          These missed students are the highest priority for intervention strategies.
        </p>
        <p>
          <strong>Enrollment Stability:</strong> The model identifies 
          <span className="font-semibold"> {enrolledRecall.toFixed(1)}%</span> of currently enrolled students correctly.
        </p>
      </div>
    </div>
  );
}
