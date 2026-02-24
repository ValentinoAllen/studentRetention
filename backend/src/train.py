import pickle
import time
import numpy as np
from xgboost import XGBClassifier
from sklearn.model_selection import GridSearchCV, StratifiedKFold
from preprocessing import (
    load_data, encode_target, split_and_scale, handle_imbalance
)

def train_baseline(X_train, y_train, X_test, y_test, n_classes):
    print("⏳ Training baseline model...")
    model = XGBClassifier(
        objective         = 'multi:softprob',
        num_class         = n_classes,
        eval_metric       = 'mlogloss',
        use_label_encoder = False,
        n_estimators      = 100,
        random_state      = 42,
        n_jobs            = -1,
    )
    model.fit(X_train, y_train,
              eval_set=[(X_test, y_test)], verbose=False)
    print("✅ Baseline selesai")
    return model

def train_with_gridsearch(X_train, y_train, n_classes, sample_weights=None):
    print("⏳ GridSearchCV dimulai...")
    t0 = time.time()

    param_grid = {
        'n_estimators'    : [100, 200, 300],
        'max_depth'       : [3, 5, 7],
        'learning_rate'   : [0.05, 0.1, 0.2],
        'subsample'       : [0.8, 1.0],
        'colsample_bytree': [0.8, 1.0],
        'min_child_weight': [1, 3],
    }

    base = XGBClassifier(
        objective         = 'multi:softprob',
        num_class         = n_classes,
        eval_metric       = 'mlogloss',
        use_label_encoder = False,
        random_state      = 42,
        n_jobs            = -1,
    )

    grid = GridSearchCV(
        estimator          = base,
        param_grid         = param_grid,
        cv                 = StratifiedKFold(n_splits=5, shuffle=True, random_state=42),
        scoring            = 'f1_weighted',
        n_jobs             = -1,
        verbose            = 1,
        refit              = True,
        return_train_score = True,
    )

    fit_kwargs = {}
    if sample_weights is not None:
        fit_kwargs['sample_weight'] = sample_weights

    grid.fit(X_train, y_train, **fit_kwargs)

    print(f"✅ GridSearch selesai dalam {(time.time()-t0)/60:.1f} menit")
    print(f"   Best params : {grid.best_params_}")
    print(f"   Best CV F1  : {grid.best_score_:.4f}")
    return grid.best_estimator_, grid.best_params_

def save_model(model, scaler, encoder, feature_cols, best_params, path='models/'):
    pkg = {
        'model'         : model,
        'scaler'        : scaler,
        'target_encoder': encoder,
        'feature_cols'  : feature_cols,
        'class_names'   : list(encoder.classes_),
        'best_params'   : best_params,
    }
    with open(f'{path}deployment_package.pkl', 'wb') as f:
        pickle.dump(pkg, f)
    print(f"✅ Model tersimpan di {path}deployment_package.pkl")

if __name__ == '__main__':
    df                   = load_data('data/dataset.csv')
    df, encoder          = encode_target(df)
    X_train, X_test, y_train, y_test, scaler, feature_cols = split_and_scale(df, encoder)
    X_train, y_train, sw = handle_imbalance(X_train, y_train)

    n_classes   = len(encoder.classes_)
    best_model, best_params = train_with_gridsearch(
        X_train, y_train, n_classes, sample_weights=sw
    )
    save_model(best_model, scaler, encoder, feature_cols, best_params)
    print("🎉 Training pipeline selesai!")