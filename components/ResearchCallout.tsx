export function ResearchCallout() {
  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 my-8">
      <div className="flex gap-4">
        <span className="text-2xl flex-shrink-0">📌</span>
        <div>
          <h4 className="font-semibold text-blue-900 mb-2">Research Finding</h4>
          <p className="text-blue-800 leading-relaxed">
            Consistent with Ridwan et al. (2024): Academic performance features (especially units approved and 
            grades in both semesters) contribute the most to dropout prediction, followed by financial indicators. 
            These factors demonstrate strong predictive power for identifying at-risk students early in their academic journey.
          </p>
        </div>
      </div>
    </div>
  )
}
