import pandas as pd
from sklearn.linear_model import LinearRegression
from sklearn.model_selection import train_test_split
import pickle

# Load the dataset
df = pd.read_csv('data/housing.csv')

# Select features and target
# features engineering if nedded
features = ['square_footage', 'bedrooms', 'bathrooms', 'year_built', 'lot_size', 'distance_to_city_center', 'school_rating']
target = 'price'

X = df[features]
y = df[target]

# Split the data
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# Create and train the model
model = LinearRegression()
model.fit(X_train, y_train)

# Save the model
with open('app/model.pkl', 'wb') as f:
    pickle.dump(model, f)

# Save the model performance metrics
with open('app/model_info.txt', 'w') as f:
    f.write(f'R-squared: {model.score(X_test, y_test)}\n')
    f.write('Coefficients:\n')
    for feature, coef in zip(features, model.coef_):
        f.write(f'{feature}: {coef}\n')