import pickle
import numpy as np
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from dotenv import load_dotenv
import os

load_dotenv()

# ── Load model ─────────────────────────────────────────────
with open('models/deployment_package.pkl', 'rb') as f:
    pkg = pickle.load(f)

model       = pkg['model']
scaler      = pkg['scaler']
encoder     = pkg['target_encoder']
feature_cols= pkg['feature_cols']
class_names = pkg['class_names']

app = FastAPI(title="Student Retention API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins = os.getenv('ALLOWED_ORIGINS', '*').split(','),
    allow_methods = ["*"],
    allow_headers = ["*"],
)

class StudentFeatures(BaseModel):
    marital_status: float             = 1
    application_mode: float           = 1
    application_order: float          = 1
    course: float                     = 9
    daytime_evening_attendance: float = 1
    previous_qualification: float     = 1
    nacionality: float                = 1
    mothers_qualification: float      = 19
    fathers_qualification: float      = 19
    mothers_occupation: float         = 9
    fathers_occupation: float         = 9
    displaced: float                  = 0
    educational_special_needs: float  = 0
    debtor: float                     = 0
    tuition_fees_up_to_date: float    = 1
    gender: float                     = 1
    scholarship_holder: float         = 0
    age_at_enrollment: float          = 20
    international: float              = 0
    cu1_credited: float               = 0
    cu1_enrolled: float               = 6
    cu1_evaluations: float            = 6
    cu1_approved: float               = 5
    cu1_grade: float                  = 12.0
    cu1_without_evaluations: float    = 0
    cu2_credited: float               = 0
    cu2_enrolled: float               = 6
    cu2_evaluations: float            = 6
    cu2_approved: float               = 5
    cu2_grade: float                  = 12.0
    cu2_without_evaluations: float    = 0
    unemployment_rate: float          = 11.1
    inflation_rate: float             = 1.4
    gdp: float                        = 1.7

@app.get("/")
def root():
    return {
        "status"     : "online",
        "model"      : "XGBoost Student Retention",
        "n_features" : len(feature_cols),
        "classes"    : class_names,
    }

@app.post("/predict")
def predict(data: StudentFeatures):
    input_values = [
        data.marital_status, data.application_mode, data.application_order,
        data.course, data.daytime_evening_attendance, data.previous_qualification,
        data.nacionality, data.mothers_qualification, data.fathers_qualification,
        data.mothers_occupation, data.fathers_occupation, data.displaced,
        data.educational_special_needs, data.debtor, data.tuition_fees_up_to_date,
        data.gender, data.scholarship_holder, data.age_at_enrollment,
        data.international, data.cu1_credited, data.cu1_enrolled,
        data.cu1_evaluations, data.cu1_approved, data.cu1_grade,
        data.cu1_without_evaluations, data.cu2_credited, data.cu2_enrolled,
        data.cu2_evaluations, data.cu2_approved, data.cu2_grade,
        data.cu2_without_evaluations, data.unemployment_rate,
        data.inflation_rate, data.gdp
    ]

    X        = np.array(input_values).reshape(1, -1)
    X_scaled = scaler.transform(X)
    pred     = int(model.predict(X_scaled)[0])
    proba    = model.predict_proba(X_scaled)[0].tolist()
    label    = encoder.inverse_transform([pred])[0]

    return {
        "prediction"    : label,
        "probabilities" : {cls: round(p, 4) for cls, p in zip(class_names, proba)},
        "confidence"    : round(max(proba) * 100, 2),
    }

@app.get("/model-info")
def model_info():
    return {
        "algorithm"  : "XGBoost",
        "split"      : "80:20",
        "classes"    : class_names,
        "n_features" : len(feature_cols),
    }

if __name__ == '__main__':
    import uvicorn
    uvicorn.run(
        "api:app",
        host    = "0.0.0.0",
        port    = int(os.getenv('PORT', 8000)),
        reload  = True     # ← auto restart saat kode diubah
    )