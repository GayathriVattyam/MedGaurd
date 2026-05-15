import pandas as pd
from sklearn.ensemble import RandomForestClassifier
import pickle

# load dataset
df = pd.read_csv("dataset.csv")

# split features and target
X = df.drop("Disease", axis=1)
y = df["Disease"]

# train model
model = RandomForestClassifier()
model.fit(X, y)

# print feature count (debug)
print("Number of features:", X.shape[1])

# save model
pickle.dump(model, open("model.pkl", "wb"))

print("Disease model trained!")