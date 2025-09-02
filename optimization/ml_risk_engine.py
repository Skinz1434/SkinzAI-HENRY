#!/usr/bin/env python3
"""
🧠 HENRY ML Risk Prediction Engine
Advanced machine learning for veteran crisis prevention
Author: Michael Skinner, Marine Veteran & VA AI SME
"""

import numpy as np
import pandas as pd
import joblib
from sklearn.ensemble import RandomForestClassifier, GradientBoostingClassifier
from sklearn.model_selection import train_test_split, GridSearchCV
from sklearn.preprocessing import StandardScaler, LabelEncoder
from sklearn.metrics import classification_report, confusion_matrix
import xgboost as xgb
import tensorflow as tf
from tensorflow import keras
import warnings
warnings.filterwarnings('ignore')

class HENRYRiskPredictor:
    def __init__(self):
        """Initialize the HENRY Risk Prediction Engine"""
        self.models = {}
        self.scalers = {}
        self.encoders = {}
        self.feature_importance = {}
        
    def prepare_features(self, df):
        """Engineer features for maximum predictive power"""
        # Risk factor combinations
        df['disability_mental_combo'] = df['disability_rating'] * df['mental_health_score']
        df['financial_health_ratio'] = df['financial_score'] / (df['health_score'] + 1)
        df['claims_per_year'] = df['claims_count'] / (df['service_years'] + 1)
        df['compensation_adequacy'] = df['monthly_compensation'] / (df['disability_rating'] + 1)
        
        # Categorical risk levels
        df['high_risk_disability'] = (df['disability_rating'] >= 70).astype(int)
        df['young_veteran'] = (df['age'] <= 35).astype(int)
        df['combat_veteran'] = df['combat_service'].astype(int)
        df['multiple_claims'] = (df['claims_count'] >= 3).astype(int)
        
        # Time-based features
        df['months_since_separation'] = pd.to_datetime('now') - pd.to_datetime(df['separation_date'])
        df['months_since_separation'] = df['months_since_separation'].dt.days / 30.44
        
        # Crisis indicators (synthetic for demo)
        df['crisis_risk'] = np.where(
            (df['mental_health_score'] > 70) & 
            (df['financial_score'] > 60) & 
            (df['housing_score'] > 50) &
            (df['claims_count'] >= 2), 1, 0
        )
        
        return df
    
    def train_ensemble_models(self, df):
        """Train multiple ML models for ensemble prediction"""
        print("🤖 Training HENRY ML Risk Models...")
        
        # Prepare data
        df_processed = self.prepare_features(df)
        
        # Feature selection
        feature_cols = [
            'disability_rating', 'mental_health_score', 'financial_score', 
            'health_score', 'housing_score', 'claims_count', 'service_years',
            'monthly_compensation', 'disability_mental_combo', 'financial_health_ratio',
            'claims_per_year', 'compensation_adequacy', 'high_risk_disability',
            'young_veteran', 'combat_veteran', 'multiple_claims', 'months_since_separation'
        ]
        
        X = df_processed[feature_cols]
        y = df_processed['crisis_risk']
        
        # Train/test split
        X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42, stratify=y)
        
        # Scale features
        scaler = StandardScaler()
        X_train_scaled = scaler.fit_transform(X_train)
        X_test_scaled = scaler.transform(X_test)
        self.scalers['main'] = scaler
        
        # 1. Random Forest
        print("Training Random Forest...")
        rf_params = {
            'n_estimators': [100, 200, 300],
            'max_depth': [10, 15, 20],
            'min_samples_split': [2, 5, 10]
        }
        rf = RandomForestClassifier(random_state=42)
        rf_grid = GridSearchCV(rf, rf_params, cv=5, scoring='f1', n_jobs=-1)
        rf_grid.fit(X_train, y_train)
        self.models['random_forest'] = rf_grid.best_estimator_
        
        # 2. XGBoost
        print("Training XGBoost...")
        xgb_model = xgb.XGBClassifier(
            objective='binary:logistic',
            n_estimators=200,
            max_depth=6,
            learning_rate=0.1,
            random_state=42
        )
        xgb_model.fit(X_train, y_train)
        self.models['xgboost'] = xgb_model
        
        # 3. Neural Network
        print("Training Neural Network...")
        nn_model = keras.Sequential([
            keras.layers.Dense(128, activation='relu', input_shape=(X_train_scaled.shape[1],)),
            keras.layers.Dropout(0.3),
            keras.layers.Dense(64, activation='relu'),
            keras.layers.Dropout(0.3),
            keras.layers.Dense(32, activation='relu'),
            keras.layers.Dense(1, activation='sigmoid')
        ])
        
        nn_model.compile(
            optimizer='adam',
            loss='binary_crossentropy',
            metrics=['accuracy']
        )
        
        nn_model.fit(
            X_train_scaled, y_train,
            epochs=100,
            batch_size=32,
            validation_split=0.2,
            verbose=0
        )
        self.models['neural_network'] = nn_model
        
        # Evaluate models
        print("\n📊 Model Performance:")
        for name, model in self.models.items():
            if name == 'neural_network':
                y_pred = (model.predict(X_test_scaled) > 0.5).astype(int)
            else:
                y_pred = model.predict(X_test)
            
            print(f"\n{name.upper()}:")
            print(classification_report(y_test, y_pred))
        
        return X_test, y_test
    
    def predict_risk(self, veteran_data):
        """Predict risk for a single veteran using ensemble"""
        # Prepare features
        processed_data = self.prepare_features(pd.DataFrame([veteran_data]))
        
        feature_cols = [
            'disability_rating', 'mental_health_score', 'financial_score', 
            'health_score', 'housing_score', 'claims_count', 'service_years',
            'monthly_compensation', 'disability_mental_combo', 'financial_health_ratio',
            'claims_per_year', 'compensation_adequacy', 'high_risk_disability',
            'young_veteran', 'combat_veteran', 'multiple_claims', 'months_since_separation'
        ]
        
        X = processed_data[feature_cols].values
        X_scaled = self.scalers['main'].transform(X)
        
        # Ensemble prediction
        predictions = {}
        predictions['random_forest'] = self.models['random_forest'].predict_proba(X)[0][1]
        predictions['xgboost'] = self.models['xgboost'].predict_proba(X)[0][1]
        predictions['neural_network'] = self.models['neural_network'].predict(X_scaled)[0][0]
        
        # Weighted ensemble (Neural Network gets higher weight)
        ensemble_score = (
            predictions['random_forest'] * 0.3 +
            predictions['xgboost'] * 0.3 +
            predictions['neural_network'] * 0.4
        )
        
        # Risk level classification
        if ensemble_score >= 0.8:
            risk_level = "IMMEDIATE"
        elif ensemble_score >= 0.6:
            risk_level = "HIGH"
        elif ensemble_score >= 0.4:
            risk_level = "MODERATE"
        elif ensemble_score >= 0.2:
            risk_level = "LOW"
        else:
            risk_level = "MINIMAL"
        
        return {
            'risk_score': float(ensemble_score),
            'risk_level': risk_level,
            'individual_predictions': predictions,
            'days_until_potential_crisis': max(7, int((1 - ensemble_score) * 90)),
            'recommended_actions': self.get_recommendations(ensemble_score, veteran_data)
        }
    
    def get_recommendations(self, risk_score, veteran_data):
        """Generate actionable recommendations based on risk score"""
        recommendations = []
        
        if risk_score >= 0.8:
            recommendations.extend([
                "URGENT: Contact veteran within 24 hours",
                "Coordinate with mental health services",
                "Activate crisis intervention protocol",
                "Ensure housing stability assessment"
            ])
        elif risk_score >= 0.6:
            recommendations.extend([
                "Schedule check-in within 72 hours",
                "Review recent claims activity",
                "Assess financial assistance needs",
                "Mental health referral recommended"
            ])
        elif risk_score >= 0.4:
            recommendations.extend([
                "Proactive outreach within 1 week",
                "Benefits optimization review",
                "Wellness check recommended"
            ])
        else:
            recommendations.extend([
                "Standard monitoring protocol",
                "Quarterly wellness assessment"
            ])
        
        # Specific recommendations based on veteran data
        if veteran_data.get('mental_health_score', 0) > 70:
            recommendations.append("Priority mental health support indicated")
        
        if veteran_data.get('claims_count', 0) >= 3:
            recommendations.append("Claims acceleration review recommended")
        
        if veteran_data.get('financial_score', 0) > 60:
            recommendations.append("Financial counseling services referral")
        
        return recommendations
    
    def save_models(self, model_dir="models/"):
        """Save trained models for production use"""
        import os
        os.makedirs(model_dir, exist_ok=True)
        
        # Save sklearn models
        joblib.dump(self.models['random_forest'], f"{model_dir}/rf_model.pkl")
        joblib.dump(self.models['xgboost'], f"{model_dir}/xgb_model.pkl")
        joblib.dump(self.scalers['main'], f"{model_dir}/scaler.pkl")
        
        # Save neural network
        self.models['neural_network'].save(f"{model_dir}/nn_model.h5")
        
        print(f"✅ Models saved to {model_dir}")
    
    def load_models(self, model_dir="models/"):
        """Load pre-trained models"""
        self.models['random_forest'] = joblib.load(f"{model_dir}/rf_model.pkl")
        self.models['xgboost'] = joblib.load(f"{model_dir}/xgb_model.pkl")
        self.scalers['main'] = joblib.load(f"{model_dir}/scaler.pkl")
        self.models['neural_network'] = keras.models.load_model(f"{model_dir}/nn_model.h5")
        print(f"✅ Models loaded from {model_dir}")

def generate_sample_data(n_veterans=5000):
    """Generate synthetic veteran data for training"""
    np.random.seed(42)
    
    data = {
        'id': range(1, n_veterans + 1),
        'disability_rating': np.random.normal(40, 25, n_veterans).clip(0, 100),
        'mental_health_score': np.random.exponential(30, n_veterans).clip(0, 100),
        'financial_score': np.random.normal(35, 20, n_veterans).clip(0, 100),
        'health_score': np.random.normal(45, 20, n_veterans).clip(0, 100),
        'housing_score': np.random.normal(25, 15, n_veterans).clip(0, 100),
        'claims_count': np.random.poisson(2, n_veterans),
        'service_years': np.random.normal(8, 4, n_veterans).clip(1, 30),
        'monthly_compensation': np.random.normal(1500, 800, n_veterans).clip(0, 5000),
        'age': np.random.normal(35, 12, n_veterans).clip(18, 80),
        'combat_service': np.random.choice([0, 1], n_veterans, p=[0.4, 0.6]),
        'separation_date': pd.date_range('2000-01-01', '2023-12-31', periods=n_veterans)
    }
    
    return pd.DataFrame(data)

if __name__ == "__main__":
    print("🎖️  HENRY ML Risk Prediction Engine")
    print("="*50)
    
    # Initialize predictor
    predictor = HENRYRiskPredictor()
    
    # Generate sample data
    print("📊 Generating synthetic veteran data...")
    df = generate_sample_data(5000)
    
    # Train models
    predictor.train_ensemble_models(df)
    
    # Test prediction
    sample_veteran = {
        'disability_rating': 70,
        'mental_health_score': 85,
        'financial_score': 75,
        'health_score': 40,
        'housing_score': 65,
        'claims_count': 4,
        'service_years': 12,
        'monthly_compensation': 2800,
        'age': 32,
        'combat_service': 1,
        'separation_date': '2018-06-15'
    }
    
    print("\n🔍 Testing Risk Prediction:")
    result = predictor.predict_risk(sample_veteran)
    print(f"Risk Score: {result['risk_score']:.3f}")
    print(f"Risk Level: {result['risk_level']}")
    print(f"Days Until Crisis: {result['days_until_potential_crisis']}")
    print("\nRecommendations:")
    for rec in result['recommended_actions']:
        print(f"  • {rec}")
    
    # Save models
    predictor.save_models()
    print("\n✅ HENRY ML Engine Ready for Production!")
