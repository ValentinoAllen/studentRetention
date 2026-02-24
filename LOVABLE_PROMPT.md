# Student Retention Predictor - Lovable Prompt

## Project Overview
Build a **Student Retention Prediction System** frontend with SHAP explainability. The backend is a FastAPI service running XGBoost model that predicts student outcomes: Dropout, Graduate, or Enrolled.

**Backend API:** `http://localhost:8000` (FastAPI)

---

## Backend API Endpoints

### 1. Health Check
```
GET /
Returns: {
  "status": "online",
  "model": "XGBoost Student Retention",
  "n_features": 34,
  "classes": ["Dropout", "Graduate", "Enrolled"]
}
```

### 2. Make Prediction
```
POST /predict
Request Body: StudentFeatures (JSON)
Response: {
  "prediction": "Dropout" | "Graduate" | "Enrolled",
  "probabilities": {
    "Dropout": 0.85,
    "Graduate": 0.10,
    "Enrolled": 0.05
  }
}
```

---

## Student Features (34 Total)

### Demographic Fields
- `marital_status` (float, default: 1)
- `gender` (float, default: 1)
- `age_at_enrollment` (float, default: 20)
- `displaced` (float, default: 0) - 0/1 binary
- `international` (float, default: 0) - 0/1 binary

### Academic Background
- `previous_qualification` (float, default: 1)
- `mothers_qualification` (float, default: 19)
- `fathers_qualification` (float, default: 19)
- `mothers_occupation` (float, default: 9)
- `fathers_occupation` (float, default: 9)

### Application Info
- `application_mode` (float, default: 1)
- `application_order` (float, default: 1)
- `course` (float, default: 9)
- `daytime_evening_attendance` (float, default: 1)

### Financial Status
- `debtor` (float, default: 0) - 0/1 binary
- `scholarship_holder` (float, default: 0) - 0/1 binary
- `tuition_fees_up_to_date` (float, default: 1)

### Educational Special Needs
- `educational_special_needs` (float, default: 0) - 0/1 binary

### Semester 1 (CU1) Performance
- `cu1_enrolled` (float, default: 6) - Units enrolled
- `cu1_evaluations` (float, default: 6) - Evaluations done
- `cu1_approved` (float, default: 5) - Units approved
- `cu1_grade` (float, default: 12.0) - Grade (0-20)
- `cu1_credited` (float, default: 0)
- `cu1_without_evaluations` (float, default: 0)

### Semester 2 (CU2) Performance
- `cu2_enrolled` (float, default: 6)
- `cu2_evaluations` (float, default: 6)
- `cu2_approved` (float, default: 5)
- `cu2_grade` (float, default: 12.0)
- `cu2_credited` (float, default: 0)
- `cu2_without_evaluations` (float, default: 0)

### Economic Indicators
- `unemployment_rate` (float, default: 11.1) - %
- `inflation_rate` (float, default: 1.4) - %
- `gdp` (float, default: 1.7) - billions

---

## Three Main Pages Required

### Page 1: Student Prediction (`/prediction`)

**Purpose:** Students enter academic/personal data, model generates prediction with confidence score and exportable PDF report.

**Features:**
1. **Input Form with Collapsible Sections** (Mobile-optimized)
   - Academic Performance (Semester 1 & 2 units, grades)
   - Economic Factors (Unemployment, inflation, GDP)
   - Demographics (Age, parents' education, debtor status, etc.)
   - On **mobile**: Sections collapse by default with summary line (e.g., "Sem-1 Grade 12.5, 6 units")
   - On **desktop**: All sections expanded

2. **Prediction Results Display**
   - **Desktop**: Right-side panel shows:
     - Predicted outcome (color-coded: Red=Dropout, Green=Graduate, Blue=Enrolled)
     - Confidence % badge
     - Probability breakdown for all 3 outcomes with visual bars
     - Top 5 most influential features with plain-language explanations
   - **Mobile**: Slides up as bottom sheet overlay after prediction

3. **Export PDF Report**
   - Button: "Export PDF Report" → triggers browser print dialog
   - PDF contains: Student summary, prediction result, probabilities, top features, recommendations

4. **Floating Action Button (FAB)**
   - Mobile only: Fixed bottom-right blue button with arrow icon
   - Triggers prediction form submission
   - Shows loading spinner during prediction

**API Calls:**
- `POST /predict` with student data → get prediction + probabilities

---

### Page 2: SHAP Analysis Dashboard (`/shap`)

**Purpose:** Explain which features matter most for each student outcome type using SHAP values.

**Features:**
1. **Outcome Toggle Button Group**
   - Three buttons at top: [🔴 Dropout] [🟢 Graduate] [🔵 Enrolled]
   - Clicking updates both charts instantly
   - Color-coded buttons match outcome colors

2. **Feature Importance Bar Chart**
   - One chart per outcome showing top 10 features
   - **Direction Arrows** on each bar:
     - ▲ **Red** = High feature values increase risk
     - ▼ **Blue** = Low feature values increase risk
   - **Hover Tooltip** shows:
     - Full feature name
     - SHAP value (numeric)
     - Plain-language explanation
     - Example: "Students with MORE approved units in Semester 2 are LESS likely to Dropout"
   - Mobile: Min height 250px, desktop: 400px, horizontally scrollable if needed

3. **Research Finding Callout Box**
   - Blue info box below charts
   - Text: "📌 Consistent with Ridwan et al. (2024): Academic performance features (especially units approved and grades in both semesters) contribute the most to dropout prediction, followed by financial indicators."

4. **Info Section**
   - "How to Read This Dashboard" with 4 bullet points explaining SHAP interpretation

**Data**: Use sample/mock SHAP data (top 10 features per outcome)

---

### Page 3: Model Evaluation (`/evaluation`)

**Purpose:** Show model performance metrics and confusion matrix.

**Features:**
1. **Confusion Matrix Heatmap**
   - 3x3 grid (Dropout, Graduate, Enrolled)
   - Cell colors by true class (darker = more predictions)
   - Each cell shows:
     - Large bold count (e.g., "248")
     - Smaller % of that true class (e.g., "86.5%")
   - **Hover state**: Yellow ring highlight + detailed tooltip
     - True positives: "correctly predicted"
     - False negatives: "missed prediction" + impact warning
   - Mobile: Responsive, scrollable if needed

2. **Performance Summary Callout**
   - Blue box below matrix with key insights:
     - "Model performs best at Graduate detection (93.2% recall)"
     - "Dropout detection catches 87% but misses ~13% (37 students)"
     - "Enrollment stability at 64.8% recall"

3. **Detailed Metrics by Class**
   - Three color-coded cards (Red/Green/Blue):
     - True Positives, False Negatives, Recall %
   - One card per class (Dropout/Graduate/Enrolled)

**Data**: Use sample confusion matrix and metrics

---

## Design Requirements

### Color Scheme (3-5 colors max)
- **Primary Red**: #dc2626 (Dropout risk)
- **Primary Green**: #16a34a (Graduate success)
- **Primary Blue**: #2563eb (Enrolled/continuing)
- **Neutral Gray**: #f3f4f6, #e5e7eb, #6b7280
- **White**: #ffffff (backgrounds)

### Typography
- **Headings**: System-ui / -apple-system (bold, responsive sizes)
- **Body**: Same font, regular weight, 1.5-1.6 line-height
- **No decorative fonts**

### Layout
- **Desktop**: Sidebar or multi-column layouts with flexbox
- **Mobile-first**: Single column, stacked elements, collapsible sections
- **Charts**: Min 250px height on mobile, 400px on desktop, scrollable

### Navigation
- Sticky header with links to all 3 pages
- Hide on print (use `print:hidden` Tailwind class)

### Frameworks/Libraries Required
- **Next.js 15+** (App Router)
- **React 19+**
- **Tailwind CSS**
- **Recharts** (for bar charts and heatmaps)
- **shadcn/ui** (buttons, cards, tooltips)
- **SWR** or **fetch** (API calls to http://localhost:8000)

---

## Mobile Optimization Requirements

1. **Accordions default CLOSED on mobile** with summary lines
2. **Bottom sheet** for prediction results on mobile
3. **FAB button** fixed bottom-right on mobile only
4. **Charts**: Min 250px, horizontally scrollable
5. **Responsive typography**: md: prefix for larger screens
6. **Touch-friendly**: Larger tap targets, 16px+ font on inputs

---

## Plain-Language Explanations (for tooltips & callouts)

Examples for different scenarios:

| Feature | Direction | Example Text |
|---------|-----------|--------------|
| Units Approved (Sem 2) | Low values risky | "Students with FEWER approved units in Semester 2 are MORE likely to Dropout" |
| Grade (Sem 1) | Low values risky | "Students with LOWER grades in Semester 1 are MORE likely to Dropout" |
| Scholarship | High values protective | "Students WITH scholarships are LESS likely to Dropout" |
| Age | High values risky | "Older students at enrollment are SLIGHTLY MORE likely to Dropout" |
| Debtor | High values risky | "Students who are debtors are MORE likely to Dropout" |

---

## Sample SHAP Data (for reference)

```json
{
  "Dropout": [
    {
      "feature": "cu2_approved",
      "shap_value": 0.45,
      "direction": "low",
      "explanation": "Students with FEWER approved units in Semester 2 are MORE likely to Dropout"
    },
    {
      "feature": "cu2_grade",
      "shap_value": 0.42,
      "direction": "low",
      "explanation": "Students with LOWER grades in Semester 2 are MORE likely to Dropout"
    },
    {
      "feature": "cu1_approved",
      "shap_value": 0.38,
      "direction": "low",
      "explanation": "Students with FEWER approved units in Semester 1 are MORE likely to Dropout"
    }
  ]
}
```

---

## API Integration Notes

- Backend runs on `http://localhost:8000`
- CORS enabled for frontend requests
- All API calls are synchronous (no polling needed)
- Prediction takes < 500ms per request
- Use `fetch` or `axios` for API calls

---

## Testing / Demo Data

When testing locally:
1. Backend should be running: `python -m uvicorn backend.src.api:app --reload`
2. Use sample student profiles:
   - **High Risk**: cu1_approved=2, cu1_grade=8, cu2_approved=1, cu2_grade=7, debtor=1
   - **Likely Graduate**: cu1_approved=5, cu1_grade=15, cu2_approved=5, cu2_grade=14, scholarship=1
   - **Average**: cu1_approved=4, cu1_grade=12, cu2_approved=4, cu2_grade=12

---

## Deliverables Checklist

- [ ] 3 pages (Prediction, SHAP, Evaluation) fully functional
- [ ] API integration with backend (POST /predict)
- [ ] Mobile-responsive design with all optimizations
- [ ] SHAP explainability with direction arrows + tooltips
- [ ] PDF export functionality
- [ ] Bottom sheet on mobile for results
- [ ] FAB button on mobile
- [ ] Confusion matrix heatmap with hover states
- [ ] Sticky navigation across all pages
- [ ] Color-coded outcomes (Red/Green/Blue)
- [ ] Plain-language explanations throughout UI
- [ ] Print-friendly CSS for PDF export
