'use client';

import React, { useState, useRef, useEffect } from 'react';
import { ComparisonProperty } from './PropertyComparison';
import PropertyResults from './PropertyResults';

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

interface PropertyFormProps {
  onAddToComparison?: (property: ComparisonProperty) => void;
}

const PropertyForm = ({ onAddToComparison }: PropertyFormProps) => {
  const [formData, setFormData] = useState({
    property_name: '',
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
  const [announceMessage, setAnnounceMessage] = useState<string>('');
  
  // Refs for accessibility
  const errorSummaryRef = useRef<HTMLDivElement>(null);
  const resultRef = useRef<HTMLDivElement>(null);

  // Announce messages to screen readers
  useEffect(() => {
    if (announceMessage) {
      const timer = setTimeout(() => setAnnounceMessage(''), 1000);
      return () => clearTimeout(timer);
    }
  }, [announceMessage]);

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
    
    if (!isValid) {
      const errorCount = Object.keys(errors).length;
      setAnnounceMessage(`Form has ${errorCount} validation error${errorCount > 1 ? 's' : ''}. Please review and correct the highlighted fields.`);
      
      // Focus on error summary after a brief delay
      setTimeout(() => {
        errorSummaryRef.current?.focus();
      }, 100);
    }
    
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
      const response = await fetch('http://127.0.0.1:8000/predict', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify([
          {
            square_footage: parseFloat(formData.square_footage),
            bedrooms: parseInt(formData.bedrooms),
            bathrooms: parseFloat(formData.bathrooms),
            year_built: parseInt(formData.year_built),
            lot_size: parseFloat(formData.lot_size),
            distance_to_city_center: parseFloat(formData.distance_to_city_center),
            school_rating: parseFloat(formData.school_rating),
          },
        ]),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      
      // Validate the response structure for the new API contract (array of predictions)
      if (Array.isArray(result.predictions) && result.predictions.length > 0) {
        const predictionValue = result.predictions[0];
        if (typeof predictionValue === 'number' && !isNaN(predictionValue)) {
          setPrediction(predictionValue);
          setAnnounceMessage(`Property estimate completed. Estimated value is $${predictionValue.toLocaleString()}.`);
          
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
          
          // Focus on result after a brief delay
          setTimeout(() => {
            resultRef.current?.focus();
          }, 100);
        } else {
          throw new Error('Invalid prediction value received from server');
        }
      } else {
        throw new Error('Invalid response structure from server');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred while fetching the prediction';
      setError(errorMessage);
      setAnnounceMessage(`Error occurred: ${errorMessage}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const clearHistory = () => {
    setHistory([]);
  };

  const addToComparison = () => {
    if (prediction !== null && onAddToComparison) {
      const propertyName = formData.property_name.trim() || `Property ${Date.now()}`;
      
      const comparisonProperty: ComparisonProperty = {
        id: Date.now().toString(),
        name: propertyName,
        propertyData: {
          square_footage: Number(formData.square_footage),
          bedrooms: Number(formData.bedrooms),
          bathrooms: Number(formData.bathrooms),
          year_built: Number(formData.year_built),
          lot_size: Number(formData.lot_size),
          distance_to_city_center: Number(formData.distance_to_city_center),
          school_rating: Number(formData.school_rating),
        },
        estimatedValue: prediction,
        addedAt: new Date(),
      };
      
      onAddToComparison(comparisonProperty);
    }
  };

  return (
    <div className="property-form-container">
      {/* Screen reader announcements */}
      <div 
        aria-live="polite" 
        aria-atomic="true" 
        className="sr-only"
        role="status"
      >
        {announceMessage}
      </div>

      {/* Error Summary for screen readers */}
      {Object.keys(validationErrors).length > 0 && (
        <div 
          ref={errorSummaryRef}
          tabIndex={-1}
          role="alert"
          aria-labelledby="error-summary-title"
          className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md"
        >
          <h2 id="error-summary-title" className="text-lg font-medium text-red-800 mb-2">
            Form Validation Errors
          </h2>
          <p className="text-sm text-red-700 mb-2">
            Please correct the following {Object.keys(validationErrors).length} error{Object.keys(validationErrors).length > 1 ? 's' : ''}:
          </p>
          <ul className="list-disc list-inside text-sm text-red-700 space-y-1">
            {Object.entries(validationErrors).map(([field, error]) => (
              <li key={field}>
                <a 
                  href={`#${field}`}
                  className="underline hover:no-underline focus:outline-none focus:ring-2 focus:ring-red-500"
                  onClick={(e) => {
                    e.preventDefault();
                    document.getElementById(field)?.focus();
                  }}
                >
                  {field.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}: {error}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div>
        <form 
        onSubmit={handleSubmit} 
        className="space-y-6"
        noValidate
        aria-describedby="form-instructions"
      >
        <div id="form-instructions" className="text-sm text-gray-600 mb-4">
          Fill out the property details below to get an estimated value. Required fields are marked with an asterisk (*).
        </div>

        {/* Property Name Field */}
        <fieldset className="mb-6">
          <legend className="sr-only">Property Identification</legend>
          <div>
            <label htmlFor="property_name" className="block text-sm font-medium text-gray-700 mb-2">
              Property Name (Optional)
            </label>
            <input
              type="text"
              id="property_name"
              name="property_name"
              value={formData.property_name}
              onChange={handleChange}
              placeholder="e.g., Downtown Condo, Suburban House, etc."
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              aria-describedby="property_name_help"
            />
            <div id="property_name_help" className="mt-1 text-xs text-gray-500">
              Optional: Give your property a memorable name for easier identification
            </div>
          </div>
        </fieldset>

        <fieldset>
          <legend className="text-lg font-medium text-gray-900 mb-4">Property Details</legend>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="square_footage" className="block text-sm font-medium text-gray-700 mb-2">
                Square Footage *
              </label>
              <input
                type="number"
                id="square_footage"
                name="square_footage"
                value={formData.square_footage}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                  validationErrors.square_footage ? 'border-red-500 focus:ring-red-500' : 'border-gray-300'
                }`}
                required
                aria-required="true"
                aria-invalid={validationErrors.square_footage ? 'true' : 'false'}
                aria-describedby={validationErrors.square_footage ? 'square_footage_error square_footage_help' : 'square_footage_help'}
                min="100"
                max="50000"
              />
              <div id="square_footage_help" className="mt-1 text-xs text-gray-500">
                Enter the total square footage (100 - 50,000 sq ft)
              </div>
              {validationErrors.square_footage && (
                <p id="square_footage_error" className="mt-1 text-sm text-red-600" role="alert">
                  {validationErrors.square_footage}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="bedrooms" className="block text-sm font-medium text-gray-700 mb-2">
                Bedrooms *
              </label>
              <input
                type="number"
                id="bedrooms"
                name="bedrooms"
                value={formData.bedrooms}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                  validationErrors.bedrooms ? 'border-red-500 focus:ring-red-500' : 'border-gray-300'
                }`}
                required
                aria-required="true"
                aria-invalid={validationErrors.bedrooms ? 'true' : 'false'}
                aria-describedby={validationErrors.bedrooms ? 'bedrooms_error bedrooms_help' : 'bedrooms_help'}
                min="1"
                max="20"
              />
              <div id="bedrooms_help" className="mt-1 text-xs text-gray-500">
                Number of bedrooms (1 - 20)
              </div>
              {validationErrors.bedrooms && (
                <p id="bedrooms_error" className="mt-1 text-sm text-red-600" role="alert">
                  {validationErrors.bedrooms}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="bathrooms" className="block text-sm font-medium text-gray-700 mb-2">
                Bathrooms *
              </label>
              <input
                type="number"
                step="0.5"
                id="bathrooms"
                name="bathrooms"
                value={formData.bathrooms}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                  validationErrors.bathrooms ? 'border-red-500 focus:ring-red-500' : 'border-gray-300'
                }`}
                required
                aria-required="true"
                aria-invalid={validationErrors.bathrooms ? 'true' : 'false'}
                aria-describedby={validationErrors.bathrooms ? 'bathrooms_error bathrooms_help' : 'bathrooms_help'}
                min="0.5"
                max="20"
              />
              <div id="bathrooms_help" className="mt-1 text-xs text-gray-500">
                Number of bathrooms (0.5 - 20, half bathrooms allowed)
              </div>
              {validationErrors.bathrooms && (
                <p id="bathrooms_error" className="mt-1 text-sm text-red-600" role="alert">
                  {validationErrors.bathrooms}
                </p>
              )}
            </div>

          <div>
            <label htmlFor="year_built" className="block text-sm font-medium text-gray-700 mb-2">
              Year Built *
            </label>
            <input
              type="number"
              id="year_built"
              name="year_built"
              value={formData.year_built}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                validationErrors.year_built ? 'border-red-500 focus:ring-red-500' : 'border-gray-300'
              }`}
              required
              aria-required="true"
              aria-invalid={validationErrors.year_built ? 'true' : 'false'}
              aria-describedby={validationErrors.year_built ? 'year_built_error year_built_help' : 'year_built_help'}
              min="1800"
              max={new Date().getFullYear() + 2}
            />
            <div id="year_built_help" className="mt-1 text-xs text-gray-500">
              Year the property was built (1800 - {new Date().getFullYear() + 2})
            </div>
            {validationErrors.year_built && (
              <p id="year_built_error" className="mt-1 text-sm text-red-600" role="alert">
                {validationErrors.year_built}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="lot_size" className="block text-sm font-medium text-gray-700 mb-2">
              Lot Size (sq ft) *
            </label>
            <input
              type="number"
              id="lot_size"
              name="lot_size"
              value={formData.lot_size}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                validationErrors.lot_size ? 'border-red-500 focus:ring-red-500' : 'border-gray-300'
              }`}
              required
              aria-required="true"
              aria-invalid={validationErrors.lot_size ? 'true' : 'false'}
              aria-describedby={validationErrors.lot_size ? 'lot_size_error lot_size_help' : 'lot_size_help'}
              min="100"
              max="1000000"
            />
            <div id="lot_size_help" className="mt-1 text-xs text-gray-500">
              Total lot size in square feet (100 - 1,000,000 sq ft)
            </div>
            {validationErrors.lot_size && (
              <p id="lot_size_error" className="mt-1 text-sm text-red-600" role="alert">
                {validationErrors.lot_size}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="distance_to_city_center" className="block text-sm font-medium text-gray-700 mb-2">
              Distance to City Center (miles) *
            </label>
            <input
              type="number"
              step="0.1"
              id="distance_to_city_center"
              name="distance_to_city_center"
              value={formData.distance_to_city_center}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                validationErrors.distance_to_city_center ? 'border-red-500 focus:ring-red-500' : 'border-gray-300'
              }`}
              required
              aria-required="true"
              aria-invalid={validationErrors.distance_to_city_center ? 'true' : 'false'}
              aria-describedby={validationErrors.distance_to_city_center ? 'distance_to_city_center_error distance_to_city_center_help' : 'distance_to_city_center_help'}
              min="0"
              max="500"
            />
            <div id="distance_to_city_center_help" className="mt-1 text-xs text-gray-500">
              Distance from city center in miles (0 - 500 miles)
            </div>
            {validationErrors.distance_to_city_center && (
              <p id="distance_to_city_center_error" className="mt-1 text-sm text-red-600" role="alert">
                {validationErrors.distance_to_city_center}
              </p>
            )}
          </div>

          <div className="md:col-span-2">
            <label htmlFor="school_rating" className="block text-sm font-medium text-gray-700 mb-2">
              School Rating (1-10) *
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
              className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                validationErrors.school_rating ? 'border-red-500 focus:ring-red-500' : 'border-gray-300'
              }`}
              required
              aria-required="true"
              aria-invalid={validationErrors.school_rating ? 'true' : 'false'}
              aria-describedby={validationErrors.school_rating ? 'school_rating_error school_rating_help' : 'school_rating_help'}
            />
            <div id="school_rating_help" className="mt-1 text-xs text-gray-500">
              Quality rating of local schools (1 = poor, 10 = excellent)
            </div>
            {validationErrors.school_rating && (
              <p id="school_rating_error" className="mt-1 text-sm text-red-600" role="alert">
                {validationErrors.school_rating}
              </p>
            )}
          </div>
          </div>
        </fieldset>
         <div className="pt-4">
           <button 
             type="submit" 
             disabled={isSubmitting}
             aria-describedby="submit-help"
             className={`w-full px-6 py-3 text-white font-medium rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors ${
               isSubmitting 
                 ? 'bg-gray-400 cursor-not-allowed' 
                 : 'bg-blue-600 hover:bg-blue-700'
             }`}
           >
             {isSubmitting ? 'Estimating...' : 'Get Property Estimate'}
           </button>
           <div id="submit-help" className="mt-2 text-xs text-gray-500 text-center">
             {isSubmitting ? 'Please wait while we calculate your property estimate.' : 'Click to calculate the estimated property value based on the details provided.'}
           </div>
         </div>

         <PropertyResults
           prediction={prediction}
           error={error}
           resultRef={resultRef}
           onAddToComparison={onAddToComparison}
           propertyData={{
             square_footage: Number(formData.square_footage),
             bedrooms: Number(formData.bedrooms),
             bathrooms: Number(formData.bathrooms),
             year_built: Number(formData.year_built),
             lot_size: Number(formData.lot_size),
             distance_to_city_center: Number(formData.distance_to_city_center),
             school_rating: Number(formData.school_rating)
           }}
         />
        </form>
      </div>
      
      {/* History Section */}
      {history.length > 0 && (
        <section 
          className="mt-8"
          aria-labelledby="history-title"
        >
          <div className="flex justify-between items-center mb-4">
            <h2 id="history-title" className="text-lg font-semibold text-gray-900">
              Previous Estimates ({history.length})
            </h2>
            <button
              onClick={clearHistory}
              className="px-3 py-1 text-sm text-red-600 hover:text-red-800 border border-red-300 hover:border-red-500 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 transition-colors"
              aria-describedby="clear-history-help"
            >
              Clear History
            </button>
          </div>
          <div id="clear-history-help" className="sr-only">
            Remove all previous property estimates from the history list
          </div>
          
          <div 
            className="space-y-3 max-h-96 overflow-y-auto"
            role="log"
            aria-label="Property estimate history"
          >
            {history.map((entry, index) => (
              <article 
                key={entry.id} 
                className="p-4 bg-gray-50 border border-gray-200 rounded-md"
                aria-labelledby={`history-entry-${entry.id}`}
              >
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 id={`history-entry-${entry.id}`} className="text-lg font-medium text-green-600">
                      ${entry.estimatedValue.toLocaleString()}
                    </h3>
                    <p className="text-sm text-gray-500">
                      Estimate #{history.length - index}
                    </p>
                  </div>
                  <time 
                    className="text-sm text-gray-500"
                    dateTime={entry.timestamp.toISOString()}
                  >
                    {entry.timestamp.toLocaleDateString()} {entry.timestamp.toLocaleTimeString()}
                  </time>
                </div>
                
                <dl className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm text-gray-600">
                  <div>
                    <dt className="font-medium">Sq Ft:</dt>
                    <dd>{entry.propertyData.square_footage.toLocaleString()}</dd>
                  </div>
                  <div>
                    <dt className="font-medium">Bedrooms:</dt>
                    <dd>{entry.propertyData.bedrooms}</dd>
                  </div>
                  <div>
                    <dt className="font-medium">Bathrooms:</dt>
                    <dd>{entry.propertyData.bathrooms}</dd>
                  </div>
                  <div>
                    <dt className="font-medium">Year Built:</dt>
                    <dd>{entry.propertyData.year_built}</dd>
                  </div>
                  <div>
                    <dt className="font-medium">Lot Size:</dt>
                    <dd>{entry.propertyData.lot_size.toLocaleString()} sq ft</dd>
                  </div>
                  <div>
                    <dt className="font-medium">Distance:</dt>
                    <dd>{entry.propertyData.distance_to_city_center} miles</dd>
                  </div>
                  <div>
                    <dt className="font-medium">School Rating:</dt>
                    <dd>{entry.propertyData.school_rating}/10</dd>
                  </div>
                </dl>
              </article>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default PropertyForm;