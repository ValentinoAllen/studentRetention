import pickle
import numpy as np
import shap
import matplotlib.pyplot as plt
import pandas as pd
from sklearn.metrics import (
    classification_report, confusion_matrix,
    roc_auc_score, roc_curve, auc
)
from sklearn.preprocessing import label_binarize

def load_package(path='models/deployment_package.pkl'):
    with open(path, 'rb') as f:
        return pickle.load(f)

def evaluate_model(model, X_test, y_test, class_names):
    y_pred       = model.predict(X_test)
    y_pred_proba = model.predict_proba(X_test)

    print(classification_report(y_test, y_pred, target_names=class_names))

    roc_auc = roc_auc_score(
        y_test, y_pred_proba, multi_class='ovr', average='weighted'
    )
    print(f"ROC-AUC (weighted): {roc_auc:.4f}")
    return y_pred, y_pred_proba

def run_shap_analysis(model, X_test, feature_cols, class_names,
                      output_dir='outputs/'):
    print("⏳ Menghitung SHAP values...")
    explainer   = shap.TreeExplainer(model)
    shap_values = explainer.shap_values(X_test)

    for cls_name in ['Dropout', 'Graduate']:
        cls_idx  = class_names.index(cls_name)
        shap_cls = shap_values[:, :, cls_idx]

        # Export top 10 ke CSV
        mean_abs = np.abs(shap_cls).mean(axis=0)
        df_shap  = pd.DataFrame({
            'feature'   : feature_cols,
            'shap_value': mean_abs
        }).sort_values('shap_value', ascending=False).head(10)

        df_shap.to_csv(f'{output_dir}top10_shap_{cls_name.lower()}.csv',
                       index=False)
        print(f"✅ SHAP {cls_name} → {output_dir}top10_shap_{cls_name.lower()}.csv")

if __name__ == '__main__':
    from preprocessing import load_data, encode_target, split_and_scale, handle_imbalance
    import os
    os.makedirs('outputs', exist_ok=True)

    pkg         = load_package()
    model       = pkg['model']
    scaler      = pkg['scaler']
    encoder     = pkg['target_encoder']
    feature_cols= pkg['feature_cols']
    class_names = pkg['class_names']

    df                   = load_data('data/dataset.csv')
    df, _                = encode_target(df)
    _, X_test, _, y_test, _, _ = split_and_scale(df, encoder)

    y_pred, y_pred_proba = evaluate_model(model, X_test, y_test, class_names)
    run_shap_analysis(model, X_test, feature_cols, class_names)
    print("🎉 Evaluasi selesai!")