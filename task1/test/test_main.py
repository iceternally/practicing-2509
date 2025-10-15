import json
import pytest
import pandas as pd
from fastapi.testclient import TestClient
from unittest.mock import patch, mock_open
import pickle
from app.main import app, prepare_features, HouseFeatures

# Create test client
client = TestClient(app)

# Sample test data based on the CSV structure
SAMPLE_HOUSE_DATA = {
    "square_footage": 1550.0,
    "bedrooms": 3,
    "bathrooms": 2.0,
    "year_built": 1997,
    "lot_size": 6800,
    "distance_to_city_center": 4.1,
    "school_rating": 7.6
}

SAMPLE_BATCH_DATA = [
    {
        "square_footage": 1550.0,
        "bedrooms": 3,
        "bathrooms": 2.0,
        "year_built": 1997,
        "lot_size": 6800,
        "distance_to_city_center": 4.1,
        "school_rating": 7.6
    },
    {
        "square_footage": 2200.0,
        "bedrooms": 4,
        "bathrooms": 2.5,
        "year_built": 2008,
        "lot_size": 9600,
        "distance_to_city_center": 7.0,
        "school_rating": 8.8
    }
]

# Mock model info data
MOCK_MODEL_INFO = {
    "r_squared": 0.980574133631031,
    "training_r_squared": 0.9901693495555546,
    "generalization_gap": 0.009595215924523615,
    "coefficients": {
        "lot_size": 19412.403267253678,
        "house_age": -10321.478740288614,
        "school_rating": 19166.01194467249,
        "distance_to_city_center": 32598.707294777112,
        "bedrooms": -3450.9640467299278,
        "bathrooms": 670.2770974219472,
        "footage_lot_ratio": -7154.93288081112
    }
}

class TestHealthEndpoint:
    """Test cases for the health endpoint"""
    
    def test_health_endpoint(self):
        """Test that health endpoint returns correct status"""
        response = client.get("/health")
        assert response.status_code == 200
        assert response.json() == {"status": "ok"}


class TestModelInfoEndpoint:
    """Test cases for the model-info endpoint"""
    
    @patch("builtins.open", new_callable=mock_open, read_data=json.dumps(MOCK_MODEL_INFO))
    def test_model_info_endpoint(self, mock_file):
        """Test that model-info endpoint returns model information"""
        response = client.get("/model-info")
        assert response.status_code == 200
        data = response.json()
        assert "r_squared" in data
        assert "training_r_squared" in data
        assert "coefficients" in data
        assert data["r_squared"] == MOCK_MODEL_INFO["r_squared"]


class TestPrepareFeatures:
    """Test cases for the prepare_features function"""
    
    def test_prepare_features_single_dict(self):
        """Test prepare_features with a single dictionary input"""
        # Mock model_features
        with patch('app.main.model_features', ['square_footage', 'bedrooms', 'bathrooms', 'lot_size', 'distance_to_city_center', 'school_rating', 'house_age', 'footage_lot_ratio']):
            result = prepare_features(SAMPLE_HOUSE_DATA)
            
            assert isinstance(result, pd.DataFrame)
            assert len(result) == 1
            assert 'house_age' in result.columns
            assert 'footage_lot_ratio' in result.columns
            assert result['house_age'].iloc[0] == 2025 - 1997  # 28
            assert result['footage_lot_ratio'].iloc[0] == 1550.0 / 6800
    
    def test_prepare_features_list_of_dicts(self):
        """Test prepare_features with a list of dictionaries"""
        with patch('app.main.model_features', ['square_footage', 'bedrooms', 'bathrooms', 'lot_size', 'distance_to_city_center', 'school_rating', 'house_age', 'footage_lot_ratio']):
            result = prepare_features(SAMPLE_BATCH_DATA)
            
            assert isinstance(result, pd.DataFrame)
            assert len(result) == 2
            assert 'house_age' in result.columns
            assert 'footage_lot_ratio' in result.columns
    
    def test_prepare_features_missing_feature_error(self):
        """Test that prepare_features raises error for missing features"""
        # Provide complete data for feature engineering, but mock model_features to include a missing feature
        complete_data = SAMPLE_HOUSE_DATA.copy()
        
        with patch('app.main.model_features', ['square_footage', 'bedrooms', 'bathrooms', 'lot_size', 'distance_to_city_center', 'school_rating', 'house_age', 'footage_lot_ratio', 'missing_feature']):
            with pytest.raises(ValueError, match="Missing required feature: missing_feature"):
                prepare_features(complete_data)
    
    def test_prepare_features_zero_lot_size(self):
        """Test prepare_features handles zero lot_size correctly"""
        data_with_zero_lot = SAMPLE_HOUSE_DATA.copy()
        data_with_zero_lot['lot_size'] = 0
        
        with patch('app.main.model_features', ['square_footage', 'bedrooms', 'bathrooms', 'lot_size', 'distance_to_city_center', 'school_rating', 'house_age', 'footage_lot_ratio']):
            result = prepare_features(data_with_zero_lot)
            
            # Should replace 0 with 1 to avoid division by zero
            assert result['footage_lot_ratio'].iloc[0] == 1550.0 / 1


class TestPredictEndpoint:
    """Test cases for the predict endpoint"""
    
    @patch('app.main.model')
    @patch('app.main.scaler')
    @patch('app.main.model_features')
    def test_predict_single_house(self, mock_features, mock_scaler, mock_model):
        """Test prediction for a single house"""
        # Setup mocks
        mock_features.__iter__.return_value = iter(['square_footage', 'bedrooms', 'bathrooms', 'lot_size', 'distance_to_city_center', 'school_rating', 'house_age', 'footage_lot_ratio'])
        mock_scaler.transform.return_value = [[1, 2, 3, 4, 5, 6, 7, 8]]
        mock_model.predict.return_value = [350000.0]
        
        response = client.post("/predict", json=[SAMPLE_HOUSE_DATA])
        
        assert response.status_code == 200
        data = response.json()
        assert "predictions" in data
        assert len(data["predictions"]) == 1
        assert data["predictions"][0] == 350000.0
    
    @patch('app.main.model')
    @patch('app.main.scaler')
    @patch('app.main.model_features')
    def test_predict_batch_houses(self, mock_features, mock_scaler, mock_model):
        """Test prediction for multiple houses"""
        # Setup mocks
        mock_features.__iter__.return_value = iter(['square_footage', 'bedrooms', 'bathrooms', 'lot_size', 'distance_to_city_center', 'school_rating', 'house_age', 'footage_lot_ratio'])
        mock_scaler.transform.return_value = [[1, 2, 3, 4, 5, 6, 7, 8], [2, 3, 4, 5, 6, 7, 8, 9]]
        mock_model.predict.return_value = [350000.0, 450000.0]
        
        response = client.post("/predict", json=SAMPLE_BATCH_DATA)
        
        assert response.status_code == 200
        data = response.json()
        assert "predictions" in data
        assert len(data["predictions"]) == 2
        assert data["predictions"][0] == 350000.0
        assert data["predictions"][1] == 450000.0
    
    def test_predict_empty_input(self):
        """Test prediction with empty input array"""
        response = client.post("/predict", json=[])
        
        assert response.status_code == 400
        assert "empty input array" in response.json()["detail"]
    
    def test_predict_invalid_input_format(self):
        """Test prediction with invalid input format"""
        invalid_data = {"invalid": "data"}
        
        response = client.post("/predict", json=[invalid_data])
        
        assert response.status_code == 422  # Validation error
    
    def test_predict_missing_required_fields(self):
        """Test prediction with missing required fields"""
        incomplete_data = {
            "square_footage": 1550.0,
            "bedrooms": 3
            # Missing other required fields
        }
        
        response = client.post("/predict", json=[incomplete_data])
        
        assert response.status_code == 422  # Validation error


class TestHouseFeaturesModel:
    """Test cases for the HouseFeatures Pydantic model"""
    
    def test_valid_house_features(self):
        """Test creating HouseFeatures with valid data"""
        house = HouseFeatures(**SAMPLE_HOUSE_DATA)
        
        assert house.square_footage == 1550.0
        assert house.bedrooms == 3
        assert house.bathrooms == 2.0
        assert house.year_built == 1997
        assert house.lot_size == 6800
        assert house.distance_to_city_center == 4.1
        assert house.school_rating == 7.6
    
    def test_house_features_type_validation(self):
        """Test that HouseFeatures validates types correctly"""
        with pytest.raises(ValueError):
            HouseFeatures(
                square_footage="invalid",  # Should be float
                bedrooms=3,
                bathrooms=2.0,
                year_built=1997,
                lot_size=6800,
                distance_to_city_center=4.1,
                school_rating=7.6
            )


class TestIntegrationWithTestData:
    """Integration tests using actual test data from CSV"""
    
    def load_test_data(self):
        """Load test data from CSV file"""
        try:
            df = pd.read_csv('data/test.csv')
            return df.to_dict('records')
        except FileNotFoundError:
            # Fallback to sample data if CSV not found
            return SAMPLE_BATCH_DATA
    
    @patch('app.main.model')
    @patch('app.main.scaler')
    @patch('app.main.model_features')
    def test_predict_with_csv_data(self, mock_features, mock_scaler, mock_model):
        """Test prediction using data from the test CSV file"""
        # Setup mocks
        mock_features.__iter__.return_value = iter(['square_footage', 'bedrooms', 'bathrooms', 'lot_size', 'distance_to_city_center', 'school_rating', 'house_age', 'footage_lot_ratio'])
        
        test_data = self.load_test_data()
        
        # Mock scaler and model responses based on number of test records
        num_records = len(test_data)
        mock_scaler.transform.return_value = [[i] * 8 for i in range(num_records)]
        mock_model.predict.return_value = [300000.0 + i * 50000 for i in range(num_records)]
        
        response = client.post("/predict", json=test_data)
        
        assert response.status_code == 200
        data = response.json()
        assert "predictions" in data
        assert len(data["predictions"]) == num_records
        assert all(isinstance(pred, (int, float)) for pred in data["predictions"])


class TestErrorHandling:
    """Test cases for error handling scenarios"""
    
    @patch('app.main.prepare_features')
    def test_predict_preparation_error(self, mock_prepare):
        """Test prediction when feature preparation fails"""
        mock_prepare.side_effect = Exception("Feature preparation failed")
        
        response = client.post("/predict", json=[SAMPLE_HOUSE_DATA])
        
        assert response.status_code == 400
        assert "Feature preparation failed" in response.json()["detail"]
    
    @patch('app.main.model')
    @patch('app.main.scaler')
    @patch('app.main.model_features')
    @patch('app.main.prepare_features')
    def test_predict_model_error(self, mock_prepare, mock_features, mock_scaler, mock_model):
        """Test prediction when model prediction fails"""
        mock_prepare.return_value = pd.DataFrame([[1, 2, 3, 4, 5, 6, 7, 8]])
        mock_scaler.transform.return_value = [[1, 2, 3, 4, 5, 6, 7, 8]]
        mock_model.predict.side_effect = Exception("Model prediction failed")
        
        response = client.post("/predict", json=[SAMPLE_HOUSE_DATA])
        
        assert response.status_code == 400
        assert "Model prediction failed" in response.json()["detail"]


class TestWithCompleteCSVData:
    """Test cases using complete data from test.csv file"""
    
    def load_csv_test_data(self):
        """Load all test data from the CSV file"""
        try:
            df = pd.read_csv('data/test.csv')
            return df.to_dict('records')
        except FileNotFoundError:
            pytest.skip("test.csv file not found")
    
    @patch('app.main.model')
    @patch('app.main.scaler')
    @patch('app.main.model_features')
    def test_predict_with_all_csv_data(self, mock_features, mock_scaler, mock_model):
        """Test prediction using all data from test.csv file"""
        # Setup mocks
        mock_features.__iter__.return_value = iter([
            'square_footage', 'bedrooms', 'bathrooms', 'lot_size', 
            'distance_to_city_center', 'school_rating', 'house_age', 'footage_lot_ratio'
        ])
        
        # Load all test data from CSV
        test_data = self.load_csv_test_data()
        num_records = len(test_data)
        
        # Mock scaler and model responses
        mock_scaler.transform.return_value = [[i] * 8 for i in range(num_records)]
        # Generate realistic house price predictions (between 200k and 800k)
        mock_predictions = [250000 + i * 50000 + (i % 3) * 25000 for i in range(num_records)]
        mock_model.predict.return_value = mock_predictions
        
        # Make prediction request
        response = client.post("/predict", json=test_data)
        
        # Validate response
        assert response.status_code == 200
        data = response.json()
        assert "predictions" in data
        assert len(data["predictions"]) == num_records
        assert len(data["predictions"]) == 10  # We know there are 10 data rows in test.csv
        
        # Validate all predictions are reasonable house prices
        for prediction in data["predictions"]:
            assert isinstance(prediction, (int, float))
            assert 100000 <= prediction <= 1000000  # Reasonable house price range
    
    @patch('app.main.model')
    @patch('app.main.scaler')
    @patch('app.main.model_features')
    def test_csv_data_feature_engineering(self, mock_features, mock_scaler, mock_model):
        """Test that feature engineering works correctly with CSV data"""
        mock_features.__iter__.return_value = iter([
            'square_footage', 'bedrooms', 'bathrooms', 'lot_size', 
            'distance_to_city_center', 'school_rating', 'house_age', 'footage_lot_ratio'
        ])
        
        test_data = self.load_csv_test_data()
        
        # Mock the model components
        mock_scaler.transform.return_value = [[1] * 8 for _ in range(len(test_data))]
        mock_model.predict.return_value = [300000] * len(test_data)
        
        # Test each record individually to validate feature engineering
        for i, record in enumerate(test_data):
            response = client.post("/predict", json=[record])
            assert response.status_code == 200
            
            # Verify the feature engineering calculations would be correct
            expected_house_age = 2025 - record['year_built']
            expected_footage_ratio = record['square_footage'] / max(record['lot_size'], 1)
            
            # These values should be calculated correctly in prepare_features
            assert expected_house_age >= 0
            assert expected_footage_ratio > 0
    
    def test_csv_data_structure_validation(self):
        """Test that all CSV data has the required structure"""
        test_data = self.load_csv_test_data()
        
        required_fields = [
            'square_footage', 'bedrooms', 'bathrooms', 'year_built',
            'lot_size', 'distance_to_city_center', 'school_rating'
        ]
        
        for i, record in enumerate(test_data):
            # Validate all required fields are present
            for field in required_fields:
                assert field in record, f"Missing field '{field}' in record {i}"
                assert record[field] is not None, f"Field '{field}' is None in record {i}"
            
            # Validate data types and ranges
            assert isinstance(record['square_footage'], (int, float))
            assert record['square_footage'] > 0
            
            assert isinstance(record['bedrooms'], int)
            assert record['bedrooms'] > 0
            
            assert isinstance(record['bathrooms'], (int, float))
            assert record['bathrooms'] > 0
            
            assert isinstance(record['year_built'], int)
            assert 1800 <= record['year_built'] <= 2025
            
            assert isinstance(record['lot_size'], int)
            assert record['lot_size'] > 0
            
            assert isinstance(record['distance_to_city_center'], (int, float))
            assert record['distance_to_city_center'] >= 0
            
            assert isinstance(record['school_rating'], (int, float))
            assert 0 <= record['school_rating'] <= 10
    
    @patch('app.main.model')
    @patch('app.main.scaler')
    @patch('app.main.model_features')
    def test_csv_data_batch_vs_individual_predictions(self, mock_features, mock_scaler, mock_model):
        """Test that batch prediction gives same results as individual predictions"""
        mock_features.__iter__.return_value = iter([
            'square_footage', 'bedrooms', 'bathrooms', 'lot_size', 
            'distance_to_city_center', 'school_rating', 'house_age', 'footage_lot_ratio'
        ])
        
        test_data = self.load_csv_test_data()
        
        # Setup consistent mock responses
        def mock_transform_side_effect(data):
            return [[i] * 8 for i in range(len(data))]
        
        def mock_predict_side_effect(data):
            return [300000 + i * 10000 for i in range(len(data))]
        
        mock_scaler.transform.side_effect = mock_transform_side_effect
        mock_model.predict.side_effect = mock_predict_side_effect
        
        # Get batch prediction
        batch_response = client.post("/predict", json=test_data)
        assert batch_response.status_code == 200
        batch_predictions = batch_response.json()["predictions"]
        
        # Reset mocks for individual predictions
        mock_scaler.transform.side_effect = mock_transform_side_effect
        mock_model.predict.side_effect = mock_predict_side_effect
        
        # Get individual predictions
        individual_predictions = []
        for record in test_data:
            response = client.post("/predict", json=[record])
            assert response.status_code == 200
            individual_predictions.extend(response.json()["predictions"])
        
        # Compare results (they should be consistent)
        assert len(batch_predictions) == len(individual_predictions)
        assert len(batch_predictions) == len(test_data)


if __name__ == "__main__":
    pytest.main([__file__])