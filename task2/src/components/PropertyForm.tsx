'use client';

import { useState } from 'react';

interface ValidationErrors {
  square_footage?: string;
  bedrooms?: string;
  bathrooms?: string;
  year_built?: string;
  lot_size?: string;
  distance_to_city_center?: string;
  school_rating?: string;
}

interface HistoryEntry {
  id: string;
  timestamp: Date;
  propertyData: {
    square_footage: number;
    bedrooms: number;
    bathrooms: number;
    year_built: number;
    lot_size: number;
    distance_to_city_center: number;
    school_rating: number;
  };
  estimatedValue: number;
}

const PropertyForm = () => {
  const [formData, setFormData] = useState({
    square_footage: '2000',
    bedrooms: '3',
    bathrooms: '2.5',
    year_built: '2010',
    lot_size: '8000',
    distance_to_city_center: '5.2',
    school_rating: '8.5',
  });

  const [prediction, setPrediction] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [history, setHistory] = useState<HistoryEntry[]>([]);

  const validateField = (name: string, value: string): string | undefined => {
    const numValue = parseFloat(value);
    
    switch (name) {
      case 'square_footage':
        if (!value.trim()) return 'Square footage is required';
        if (isNaN(numValue) || numValue <= 0) return 'Square footage must be a positive number';
        if (numValue < 100) return 'Square footage must be at least 100 sq ft';
        if (numValue > 50000) return 'Square footage cannot exceed 50,000 sq ft';
        break;
        
      case 'bedrooms':
        if (!value.trim()) return 'Number of bedrooms is required';
        if (isNaN(numValue) || !Number.isInteger(numValue)) return 'Bedrooms must be a whole number';
        if (numValue < 1) return 'Must have at least 1 bedroom';
        if (numValue > 20) return 'Cannot exceed 20 bedrooms';
        break;
        
      case 'bathrooms':
        if (!value.trim()) return 'Number of bathrooms is required';
        if (isNaN(numValue) || numValue <= 0) return 'Bathrooms must be a positive number';
        if (numValue > 20) return 'Cannot exceed 20 bathrooms';
        break;
        
      case 'year_built':
        if (!value.trim()) return 'Year built is required';
        if (isNaN(numValue) || !Number.isInteger(numValue)) return 'Year must be a valid number';
        const currentYear = new Date().getFullYear();
        if (numValue < 1800) return 'Year built cannot be before 1800';
        if (numValue > currentYear + 2) return `Year built cannot be more than ${currentYear + 2}`;
        break;
        
      case 'lot_size':
        if (!value.trim()) return 'Lot size is required';
        if (isNaN(numValue) || numValue <= 0) return 'Lot size must be a positive number';
        if (numValue < 100) return 'Lot size must be at least 100 sq ft';
        if (numValue > 1000000) return 'Lot size cannot exceed 1,000,000 sq ft';
        break;
        
      case 'distance_to_city_center':
        if (!value.trim()) return 'Distance to city center is required';
        if (isNaN(numValue) || numValue < 0) return 'Distance must be a non-negative number';
        if (numValue > 500) return 'Distance cannot exceed 500 miles';
        break;
        
      case 'school_rating':
        if (!value.trim()) return 'School rating is required';
        if (isNaN(numValue)) return 'School rating must be a number';
        if (numValue < 1 || numValue > 10) return 'School rating must be between 1 and 10';
        break;
        
      default:
        return undefined;
    }
    return undefined;
  };

  const validateForm = (): boolean => {
    const errors: ValidationErrors = {};
    let isValid = true;

    Object.keys(formData).forEach((key) => {
      const error = validateField(key, formData[key as keyof typeof formData]);
      if (error) {
        errors[key as keyof ValidationErrors] = error;
        isValid = false;
      }
    });

    setValidationErrors(errors);
    return isValid;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
    
    // Clear validation error for this field when user starts typing
    if (validationErrors[name as keyof ValidationErrors]) {
      setValidationErrors((prev) => ({
        ...prev,
        [name]: undefined,
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setPrediction(null);

    // Validate form before submission
    if (!validateForm()) {
      setError('Please fix the validation errors before submitting');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('http://127.0.0.1:8001/predict', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          data: {
            square_footage: parseFloat(formData.square_footage),
            bedrooms: parseInt(formData.bedrooms),
            bathrooms: parseFloat(formData.bathrooms),
            year_built: parseInt(formData.year_built),
            lot_size: parseFloat(formData.lot_size),
            distance_to_city_center: parseFloat(formData.distance_to_city_center),
            school_rating: parseFloat(formData.school_rating),
          },
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      
      // Validate the response structure
      // if (result && result.prediction && Array.isArray(result.prediction) && result.prediction.length > 0) {
      if (result && result.prediction) {
        // const predictionValue = result.prediction[0];
        const predictionValue = result.prediction;
        if (typeof predictionValue === 'number' && !isNaN(predictionValue)) {
          setPrediction(predictionValue);
          
          // Add to history
          const historyEntry: HistoryEntry = {
            id: Date.now().toString(),
            timestamp: new Date(),
            propertyData: {
              square_footage: Number(formData.square_footage),
              bedrooms: Number(formData.bedrooms),
              bathrooms: Number(formData.bathrooms),
              year_built: Number(formData.year_built),
              lot_size: Number(formData.lot_size),
              distance_to_city_center: Number(formData.distance_to_city_center),
              school_rating: Number(formData.school_rating),
            },
            estimatedValue: predictionValue,
          };
          
          setHistory(prev => [historyEntry, ...prev]);
        } else {
          throw new Error('Invalid prediction value received from server');
        }
      } else {
        throw new Error('Invalid response structure from server');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred while fetching the prediction');
    } finally {
      setIsSubmitting(false);
    }
  };

  const clearHistory = () => {
    setHistory([]);
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="square_footage" className="block text-sm font-medium text-gray-700 mb-2">
              Square Footage
            </label>
            <input
              type="number"
              id="square_footage"
              name="square_footage"
              value={formData.square_footage}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${
                validationErrors.square_footage ? 'border-red-500' : 'border-gray-300'
              }`}
              required
            />
            {validationErrors.square_footage && (
              <p className="mt-1 text-sm text-red-600">{validationErrors.square_footage}</p>
            )}
          </div>

          <div>
            <label htmlFor="bedrooms" className="block text-sm font-medium text-gray-700 mb-2">
              Bedrooms
            </label>
            <input
              type="number"
              id="bedrooms"
              name="bedrooms"
              value={formData.bedrooms}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${
                validationErrors.bedrooms ? 'border-red-500' : 'border-gray-300'
              }`}
              required
            />
            {validationErrors.bedrooms && (
              <p className="mt-1 text-sm text-red-600">{validationErrors.bedrooms}</p>
            )}
          </div>

          <div>
            <label htmlFor="bathrooms" className="block text-sm font-medium text-gray-700 mb-2">
              Bathrooms
            </label>
            <input
              type="number"
              step="0.5"
              id="bathrooms"
              name="bathrooms"
              value={formData.bathrooms}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${
                validationErrors.bathrooms ? 'border-red-500' : 'border-gray-300'
              }`}
              required
            />
            {validationErrors.bathrooms && (
              <p className="mt-1 text-sm text-red-600">{validationErrors.bathrooms}</p>
            )}
          </div>

          <div>
            <label htmlFor="year_built" className="block text-sm font-medium text-gray-700 mb-2">
              Year Built
            </label>
            <input
              type="number"
              id="year_built"
              name="year_built"
              value={formData.year_built}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${
                validationErrors.year_built ? 'border-red-500' : 'border-gray-300'
              }`}
              required
            />
            {validationErrors.year_built && (
              <p className="mt-1 text-sm text-red-600">{validationErrors.year_built}</p>
            )}
          </div>

          <div>
            <label htmlFor="lot_size" className="block text-sm font-medium text-gray-700 mb-2">
              Lot Size (sq ft)
            </label>
            <input
              type="number"
              id="lot_size"
              name="lot_size"
              value={formData.lot_size}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${
                validationErrors.lot_size ? 'border-red-500' : 'border-gray-300'
              }`}
              required
            />
            {validationErrors.lot_size && (
              <p className="mt-1 text-sm text-red-600">{validationErrors.lot_size}</p>
            )}
          </div>

          <div>
            <label htmlFor="distance_to_city_center" className="block text-sm font-medium text-gray-700 mb-2">
              Distance to City Center (miles)
            </label>
            <input
              type="number"
              step="0.1"
              id="distance_to_city_center"
              name="distance_to_city_center"
              value={formData.distance_to_city_center}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${
                validationErrors.distance_to_city_center ? 'border-red-500' : 'border-gray-300'
              }`}
              required
            />
            {validationErrors.distance_to_city_center && (
              <p className="mt-1 text-sm text-red-600">{validationErrors.distance_to_city_center}</p>
            )}
          </div>

          <div className="md:col-span-2">
            <label htmlFor="school_rating" className="block text-sm font-medium text-gray-700 mb-2">
              School Rating (1-10)
            </label>
            <input
              type="number"
              step="0.1"
              min="1"
              max="10"
              id="school_rating"
              name="school_rating"
              value={formData.school_rating}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${
                validationErrors.school_rating ? 'border-red-500' : 'border-gray-300'
              }`}
              required
            />
            {validationErrors.school_rating && (
              <p className="mt-1 text-sm text-red-600">{validationErrors.school_rating}</p>
            )}
          </div>
        </div>
         
         <div className="pt-4">
           <button 
             type="submit" 
             disabled={isSubmitting}
             className={`w-full px-6 py-3 text-white font-medium rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
               isSubmitting 
                 ? 'bg-gray-400 cursor-not-allowed' 
                 : 'bg-blue-600 hover:bg-blue-700'
             }`}
           >
             {isSubmitting ? 'Estimating...' : 'Get Property Estimate'}
           </button>
         </div>
       </form>
      {prediction !== null && (
        <div className="mt-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded">
          <p><strong>Estimated Property Value:</strong> ${prediction.toLocaleString()}</p>
        </div>
      )}
      {error && (
        <div className="mt-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
          <p><strong>Error:</strong> {error}</p>
        </div>
      )}
      
      {/* History Section */}
      {history.length > 0 && (
        <div className="mt-8">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Previous Estimates</h3>
            <button
              onClick={clearHistory}
              className="px-3 py-1 text-sm text-red-600 hover:text-red-800 border border-red-300 hover:border-red-500 rounded-md"
            >
              Clear History
            </button>
          </div>
          
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {history.map((entry) => (
              <div key={entry.id} className="p-4 bg-gray-50 border border-gray-200 rounded-md">
                <div className="flex justify-between items-start mb-2">
                  <div className="text-lg font-medium text-green-600">
                    ${entry.estimatedValue.toLocaleString()}
                  </div>
                  <div className="text-sm text-gray-500">
                    {entry.timestamp.toLocaleDateString()} {entry.timestamp.toLocaleTimeString()}
                  </div>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm text-gray-600">
                  <div><span className="font-medium">Sq Ft:</span> {entry.propertyData.square_footage.toLocaleString()}</div>
                  <div><span className="font-medium">Bedrooms:</span> {entry.propertyData.bedrooms}</div>
                  <div><span className="font-medium">Bathrooms:</span> {entry.propertyData.bathrooms}</div>
                  <div><span className="font-medium">Year Built:</span> {entry.propertyData.year_built}</div>
                  <div><span className="font-medium">Lot Size:</span> {entry.propertyData.lot_size.toLocaleString()} sq ft</div>
                  <div><span className="font-medium">Distance:</span> {entry.propertyData.distance_to_city_center} miles</div>
                  <div><span className="font-medium">School Rating:</span> {entry.propertyData.school_rating}/10</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
};

export default PropertyForm;