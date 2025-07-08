import pandas as pd

df = pd.read_csv("/Users/aryansanganti/Desktop/newMLApp/MLModel/Crop_recommendation.csv")
print(df.shape)        
print(df.columns)
print(df['label'].nunique(), df['label'].unique())
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import classification_report, accuracy_score

X = df[['N','P','K','temperature','humidity','ph','rainfall']]
y = df['label']

X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

clf = RandomForestClassifier(n_estimators=100, random_state=42)
clf.fit(X_train, y_train)

y_pred = clf.predict(X_test)

print("Accuracy:", accuracy_score(y_test, y_pred))
print(classification_report(y_test, y_pred))

import joblib
joblib.dump(clf, 'crop_model.pkl')
