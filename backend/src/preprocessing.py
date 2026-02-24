import pandas as pd
import numpy as np
import pickle
from sklearn.preprocessing import StandardScaler, LabelEncoder
from sklearn.model_selection import train_test_split
from sklearn.utils.class_weight import compute_sample_weight
from imblearn.over_sampling import SMOTE
from collections import Counter

# ── Konfigurasi ────────────────────────────────────────────
TARGET_COL         = 'Target'
IMBALANCE_STRATEGY = 'smote'    # 'smote' | 'class_weight' | 'none'
TEST_SIZE          = 0.2
RANDOM_STATE       = 42

def load_data(filepath: str) -> pd.DataFrame:
    df = pd.read_csv(filepath)
    df.columns = df.columns.str.strip().str.replace('\ufeff', '', regex=False)
    print(f"✅ Dataset dimuat: {df.shape[0]} baris × {df.shape[1]} kolom")
    return df

def encode_target(df: pd.DataFrame):
    encoder = LabelEncoder()
    df      = df.copy()
    df[TARGET_COL] = encoder.fit_transform(df[TARGET_COL])
    print(f"✅ Target encoded: {dict(zip(encoder.classes_, encoder.transform(encoder.classes_)))}")
    return df, encoder

def split_and_scale(df: pd.DataFrame, encoder: LabelEncoder):
    feature_cols = [c for c in df.columns if c != TARGET_COL]
    X = df[feature_cols].values
    y = df[TARGET_COL].values

    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=TEST_SIZE,
        random_state=RANDOM_STATE, stratify=y
    )

    scaler         = StandardScaler()
    X_train_scaled = scaler.fit_transform(X_train)  # fit HANYA di train
    X_test_scaled  = scaler.transform(X_test)

    print(f"✅ Split: train={len(X_train)} | test={len(X_test)}")
    return X_train_scaled, X_test_scaled, y_train, y_test, scaler, feature_cols

def handle_imbalance(X_train, y_train, strategy: str = IMBALANCE_STRATEGY):
    sample_weights = None

    if strategy == 'smote':
        smote              = SMOTE(random_state=RANDOM_STATE, k_neighbors=5)
        X_train, y_train   = smote.fit_resample(X_train, y_train)
        print(f"✅ SMOTE: {dict(sorted(Counter(y_train).items()))}")

    elif strategy == 'class_weight':
        sample_weights = compute_sample_weight('balanced', y_train)
        print(f"✅ Class weights dihitung")

    return X_train, y_train, sample_weights

def save_preprocessing(scaler, encoder, feature_cols, path='models/'):
    pkg = {
        'scaler'        : scaler,
        'target_encoder': encoder,
        'feature_cols'  : feature_cols,
        'class_names'   : list(encoder.classes_),
    }
    with open(f'{path}preprocessing.pkl', 'wb') as f:
        pickle.dump(pkg, f)
    print(f"✅ Preprocessing tersimpan di {path}preprocessing.pkl")

if __name__ == '__main__':
    df                = load_data('data/dataset.csv')
    df, encoder       = encode_target(df)
    X_train, X_test, y_train, y_test, scaler, feature_cols = split_and_scale(df, encoder)
    X_train, y_train, _ = handle_imbalance(X_train, y_train)
    save_preprocessing(scaler, encoder, feature_cols)
    print("✅ Preprocessing selesai!")