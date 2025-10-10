// Market Data Service for Property Analysis
export interface PropertyData {
  id: number;
  square_footage: number;
  bedrooms: number;
  bathrooms: number;
  year_built: number;
  lot_size: number;
  distance_to_city_center: number;
  school_rating: number;
  price: number;
}

export interface MarketFilters {
  priceRange: {
    min: number;
    max: number;
  };
  bedrooms: number[];
  bathrooms: number[];
  yearBuiltRange: {
    min: number;
    max: number;
  };
  squareFootageRange: {
    min: number;
    max: number;
  };
  schoolRatingRange: {
    min: number;
    max: number;
  };
  distanceRange: {
    min: number;
    max: number;
  };
}

export interface MarketStats {
  totalProperties: number;
  averagePrice: number;
  medianPrice: number;
  pricePerSqFt: number;
  averageSquareFootage: number;
  averageSchoolRating: number;
  averageDistanceToCenter: number;
}

export interface PropertySegment {
  label: string;
  count: number;
  averagePrice: number;
  percentage: number;
}

// Sample data based on housing.csv structure
export const sampleHousingData: PropertyData[] = [
  { id: 1, square_footage: 1250, bedrooms: 2, bathrooms: 1, year_built: 1985, lot_size: 5200, distance_to_city_center: 3.2, school_rating: 7.1, price: 185000 },
  { id: 2, square_footage: 1850, bedrooms: 3, bathrooms: 2, year_built: 1998, lot_size: 7500, distance_to_city_center: 5.6, school_rating: 8.2, price: 265000 },
  { id: 3, square_footage: 1420, bedrooms: 3, bathrooms: 2, year_built: 1992, lot_size: 6800, distance_to_city_center: 2.8, school_rating: 6.9, price: 210000 },
  { id: 4, square_footage: 2100, bedrooms: 4, bathrooms: 2.5, year_built: 2005, lot_size: 9200, distance_to_city_center: 7.3, school_rating: 8.5, price: 345000 },
  { id: 5, square_footage: 1700, bedrooms: 3, bathrooms: 2, year_built: 2001, lot_size: 7100, distance_to_city_center: 4.1, school_rating: 7.8, price: 275000 },
  { id: 6, square_footage: 980, bedrooms: 2, bathrooms: 1, year_built: 1978, lot_size: 4500, distance_to_city_center: 2.5, school_rating: 6.5, price: 165000 },
  { id: 7, square_footage: 2400, bedrooms: 4, bathrooms: 3, year_built: 2010, lot_size: 10500, distance_to_city_center: 8.2, school_rating: 9, price: 410000 },
  { id: 8, square_footage: 1600, bedrooms: 3, bathrooms: 1.5, year_built: 1995, lot_size: 6700, distance_to_city_center: 3.8, school_rating: 7.2, price: 225000 },
  { id: 9, square_footage: 2200, bedrooms: 4, bathrooms: 2.5, year_built: 2008, lot_size: 9800, distance_to_city_center: 6.9, school_rating: 8.7, price: 375000 },
  { id: 10, square_footage: 1350, bedrooms: 3, bathrooms: 1, year_built: 1987, lot_size: 5800, distance_to_city_center: 3, school_rating: 7, price: 195000 },
  { id: 11, square_footage: 1950, bedrooms: 3, bathrooms: 2, year_built: 2003, lot_size: 8100, distance_to_city_center: 5.2, school_rating: 8.1, price: 285000 },
  { id: 12, square_footage: 1100, bedrooms: 2, bathrooms: 1, year_built: 1982, lot_size: 4800, distance_to_city_center: 2.1, school_rating: 6.8, price: 175000 },
  { id: 13, square_footage: 2350, bedrooms: 4, bathrooms: 3, year_built: 2012, lot_size: 10200, distance_to_city_center: 7.8, school_rating: 9.1, price: 400000 },
  { id: 14, square_footage: 1550, bedrooms: 3, bathrooms: 1.5, year_built: 1994, lot_size: 6500, distance_to_city_center: 3.6, school_rating: 7.3, price: 220000 },
  { id: 15, square_footage: 2050, bedrooms: 4, bathrooms: 2.5, year_built: 2006, lot_size: 9000, distance_to_city_center: 6.7, school_rating: 8.6, price: 355000 },
  { id: 16, square_footage: 1300, bedrooms: 2, bathrooms: 1, year_built: 1986, lot_size: 5500, distance_to_city_center: 2.9, school_rating: 7.2, price: 190000 },
  { id: 17, square_footage: 1800, bedrooms: 3, bathrooms: 2, year_built: 1999, lot_size: 7300, distance_to_city_center: 4.9, school_rating: 8, price: 260000 },
  { id: 18, square_footage: 1150, bedrooms: 2, bathrooms: 1, year_built: 1980, lot_size: 4600, distance_to_city_center: 2.3, school_rating: 6.7, price: 170000 },
  { id: 19, square_footage: 2300, bedrooms: 4, bathrooms: 3, year_built: 2011, lot_size: 10000, distance_to_city_center: 7.5, school_rating: 9, price: 395000 },
  { id: 20, square_footage: 1500, bedrooms: 3, bathrooms: 1.5, year_built: 1993, lot_size: 6400, distance_to_city_center: 3.5, school_rating: 7.4, price: 215000 },
  { id: 21, square_footage: 1650, bedrooms: 3, bathrooms: 2, year_built: 1997, lot_size: 7000, distance_to_city_center: 4, school_rating: 7.7, price: 240000 },
  { id: 22, square_footage: 2150, bedrooms: 4, bathrooms: 2.5, year_built: 2007, lot_size: 9500, distance_to_city_center: 7, school_rating: 8.8, price: 365000 },
  { id: 23, square_footage: 1200, bedrooms: 2, bathrooms: 1, year_built: 1984, lot_size: 5000, distance_to_city_center: 2.6, school_rating: 6.9, price: 180000 },
  { id: 24, square_footage: 1900, bedrooms: 3, bathrooms: 2, year_built: 2002, lot_size: 7800, distance_to_city_center: 5, school_rating: 8.3, price: 280000 },
  { id: 25, square_footage: 1400, bedrooms: 3, bathrooms: 1.5, year_built: 1990, lot_size: 6000, distance_to_city_center: 3.2, school_rating: 7.1, price: 205000 },
  { id: 26, square_footage: 2250, bedrooms: 4, bathrooms: 3, year_built: 2009, lot_size: 9900, distance_to_city_center: 7.2, school_rating: 8.9, price: 385000 },
  { id: 27, square_footage: 1750, bedrooms: 3, bathrooms: 2, year_built: 2000, lot_size: 7200, distance_to_city_center: 4.5, school_rating: 7.9, price: 255000 },
  { id: 28, square_footage: 1050, bedrooms: 2, bathrooms: 1, year_built: 1979, lot_size: 4400, distance_to_city_center: 2.2, school_rating: 6.6, price: 160000 },
  { id: 29, square_footage: 2050, bedrooms: 4, bathrooms: 2.5, year_built: 2004, lot_size: 8800, distance_to_city_center: 6.5, school_rating: 8.4, price: 335000 },
  { id: 30, square_footage: 1450, bedrooms: 3, bathrooms: 1.5, year_built: 1991, lot_size: 6200, distance_to_city_center: 3.4, school_rating: 7.5, price: 215000 },
  { id: 31, square_footage: 1330, bedrooms: 2, bathrooms: 1, year_built: 1988, lot_size: 5600, distance_to_city_center: 3.1, school_rating: 7, price: 195000 },
  { id: 32, square_footage: 1870, bedrooms: 3, bathrooms: 2, year_built: 2000, lot_size: 7600, distance_to_city_center: 5, school_rating: 8.1, price: 270000 },
  { id: 33, square_footage: 1380, bedrooms: 3, bathrooms: 1.5, year_built: 1992, lot_size: 6100, distance_to_city_center: 3.2, school_rating: 7.3, price: 205000 },
  { id: 34, square_footage: 2120, bedrooms: 4, bathrooms: 2.5, year_built: 2006, lot_size: 9300, distance_to_city_center: 7.1, school_rating: 8.6, price: 350000 },
  { id: 35, square_footage: 1680, bedrooms: 3, bathrooms: 2, year_built: 1998, lot_size: 7050, distance_to_city_center: 4.2, school_rating: 7.6, price: 250000 },
  { id: 36, square_footage: 1010, bedrooms: 2, bathrooms: 1, year_built: 1980, lot_size: 4550, distance_to_city_center: 2.4, school_rating: 6.7, price: 170000 },
  { id: 37, square_footage: 2380, bedrooms: 4, bathrooms: 3, year_built: 2011, lot_size: 10300, distance_to_city_center: 7.9, school_rating: 9, price: 405000 },
  { id: 38, square_footage: 1580, bedrooms: 3, bathrooms: 1.5, year_built: 1996, lot_size: 6650, distance_to_city_center: 3.7, school_rating: 7.2, price: 230000 },
  { id: 39, square_footage: 2180, bedrooms: 4, bathrooms: 2.5, year_built: 2007, lot_size: 9700, distance_to_city_center: 6.8, school_rating: 8.7, price: 370000 },
  { id: 40, square_footage: 1270, bedrooms: 2, bathrooms: 1, year_built: 1985, lot_size: 5300, distance_to_city_center: 2.8, school_rating: 7, price: 190000 },
  { id: 41, square_footage: 1930, bedrooms: 3, bathrooms: 2, year_built: 2002, lot_size: 8000, distance_to_city_center: 5.3, school_rating: 8.2, price: 290000 },
  { id: 42, square_footage: 1120, bedrooms: 2, bathrooms: 1, year_built: 1983, lot_size: 4850, distance_to_city_center: 2.2, school_rating: 6.9, price: 175000 },
  { id: 43, square_footage: 2320, bedrooms: 4, bathrooms: 3, year_built: 2010, lot_size: 10100, distance_to_city_center: 7.7, school_rating: 9, price: 390000 },
  { id: 44, square_footage: 1520, bedrooms: 3, bathrooms: 1.5, year_built: 1995, lot_size: 6350, distance_to_city_center: 3.5, school_rating: 7.4, price: 225000 },
  { id: 45, square_footage: 2070, bedrooms: 4, bathrooms: 2.5, year_built: 2005, lot_size: 9100, distance_to_city_center: 6.6, school_rating: 8.5, price: 345000 },
  { id: 46, square_footage: 1290, bedrooms: 2, bathrooms: 1, year_built: 1986, lot_size: 5400, distance_to_city_center: 3, school_rating: 7.1, price: 195000 },
  { id: 47, square_footage: 1820, bedrooms: 3, bathrooms: 2, year_built: 1999, lot_size: 7400, distance_to_city_center: 4.8, school_rating: 8, price: 265000 },
  { id: 48, square_footage: 1130, bedrooms: 2, bathrooms: 1, year_built: 1981, lot_size: 4700, distance_to_city_center: 2.3, school_rating: 6.8, price: 170000 },
  { id: 49, square_footage: 2280, bedrooms: 4, bathrooms: 3, year_built: 2009, lot_size: 9950, distance_to_city_center: 7.4, school_rating: 8.9, price: 385000 },
  { id: 50, square_footage: 1480, bedrooms: 3, bathrooms: 1.5, year_built: 1992, lot_size: 6300, distance_to_city_center: 3.4, school_rating: 7.5, price: 220000 }
];

export class MarketDataService {
  private data: PropertyData[] = sampleHousingData;
  private apiBaseUrl = '/api/market-analysis';

  // Fetch housing data from internal API route with revalidation
  async fetchHousingData(): Promise<PropertyData[]> {
    try {
      const response = await fetch(`${this.apiBaseUrl}/housing`, {
        next: { revalidate: 60 },
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const apiData = await response.json();

      // Transform API data to match our PropertyData interface
      const transformed = apiData.map((item: any, index: number) => ({
        id: index + 1,
        square_footage: item.squareFootage || item.square_footage || 0,
        bedrooms: item.bedrooms || 0,
        bathrooms: item.bathrooms || 0,
        year_built: item.yearBuilt || item.year_built || 0,
        lot_size: item.lotSize || item.lot_size || 0,
        distance_to_city_center: item.distanceToCityCenter || item.distance_to_city_center || 0,
        school_rating: item.schoolRating || item.school_rating || 0,
        price: item.price || 0,
      }));

      return transformed;
    } catch (error) {
      console.error('Failed to fetch housing data from API:', error);
      // Fallback to sample data if API fails
      return sampleHousingData;
    }
  }

  // Get all properties
  getAllProperties(): PropertyData[] {
    return this.data;
  }

  // Filter properties based on criteria (pure: accept data as parameter)
  filterProperties(filters: Partial<MarketFilters>, properties: PropertyData[] = this.data): PropertyData[] {
    return properties.filter(property => {
      if (filters.priceRange) {
        if (property.price < filters.priceRange.min || property.price > filters.priceRange.max) {
          return false;
        }
      }

      if (filters.bedrooms && filters.bedrooms.length > 0) {
        if (!filters.bedrooms.includes(property.bedrooms)) {
          return false;
        }
      }

      if (filters.bathrooms && filters.bathrooms.length > 0) {
        if (!filters.bathrooms.includes(Math.floor(property.bathrooms))) {
          return false;
        }
      }

      if (filters.yearBuiltRange) {
        if (property.year_built < filters.yearBuiltRange.min || property.year_built > filters.yearBuiltRange.max) {
          return false;
        }
      }

      if (filters.squareFootageRange) {
        if (property.square_footage < filters.squareFootageRange.min || property.square_footage > filters.squareFootageRange.max) {
          return false;
        }
      }

      if (filters.schoolRatingRange) {
        if (property.school_rating < filters.schoolRatingRange.min || property.school_rating > filters.schoolRatingRange.max) {
          return false;
        }
      }

      if (filters.distanceRange) {
        if (property.distance_to_city_center < filters.distanceRange.min || property.distance_to_city_center > filters.distanceRange.max) {
          return false;
        }
      }

      return true;
    });
  }

  // Calculate market statistics
  calculateMarketStats(properties: PropertyData[] = this.data): MarketStats {
    if (properties.length === 0) {
      return {
        totalProperties: 0,
        averagePrice: 0,
        medianPrice: 0,
        pricePerSqFt: 0,
        averageSquareFootage: 0,
        averageSchoolRating: 0,
        averageDistanceToCenter: 0
      };
    }

    const prices = properties.map(p => p.price).sort((a, b) => a - b);
    const medianPrice = prices.length % 2 === 0 
      ? (prices[prices.length / 2 - 1] + prices[prices.length / 2]) / 2
      : prices[Math.floor(prices.length / 2)];

    const totalPrice = properties.reduce((sum, p) => sum + p.price, 0);
    const totalSqFt = properties.reduce((sum, p) => sum + p.square_footage, 0);
    const totalSchoolRating = properties.reduce((sum, p) => sum + p.school_rating, 0);
    const totalDistance = properties.reduce((sum, p) => sum + p.distance_to_city_center, 0);

    return {
      totalProperties: properties.length,
      averagePrice: totalPrice / properties.length,
      medianPrice,
      pricePerSqFt: totalPrice / totalSqFt,
      averageSquareFootage: totalSqFt / properties.length,
      averageSchoolRating: totalSchoolRating / properties.length,
      averageDistanceToCenter: totalDistance / properties.length
    };
  }

  // Get property segments by bedrooms
  getPropertySegmentsByBedrooms(properties: PropertyData[] = this.data): PropertySegment[] {
    const segments = new Map<number, PropertyData[]>();
    
    properties.forEach(property => {
      const bedrooms = property.bedrooms;
      if (!segments.has(bedrooms)) {
        segments.set(bedrooms, []);
      }
      segments.get(bedrooms)!.push(property);
    });

    return Array.from(segments.entries()).map(([bedrooms, props]) => ({
      label: `${bedrooms} Bedroom${bedrooms !== 1 ? 's' : ''}`,
      count: props.length,
      averagePrice: props.reduce((sum, p) => sum + p.price, 0) / props.length,
      percentage: (props.length / properties.length) * 100
    })).sort((a, b) => parseInt(a.label) - parseInt(b.label));
  }

  // Get property segments by price range
  getPropertySegmentsByPriceRange(properties: PropertyData[] = this.data): PropertySegment[] {
    const ranges = [
      { min: 0, max: 200000, label: 'Under $200K' },
      { min: 200000, max: 300000, label: '$200K - $300K' },
      { min: 300000, max: 400000, label: '$300K - $400K' },
      { min: 400000, max: Infinity, label: 'Over $400K' }
    ];

    return ranges.map(range => {
      const props = properties.filter(p => p.price >= range.min && p.price < range.max);
      return {
        label: range.label,
        count: props.length,
        averagePrice: props.length > 0 ? props.reduce((sum, p) => sum + p.price, 0) / props.length : 0,
        percentage: (props.length / properties.length) * 100
      };
    }).filter(segment => segment.count > 0);
  }

  // Get data ranges for filter initialization (pure: accept data as parameter)
  getDataRanges(properties: PropertyData[] = this.data): {
    priceRange: { min: number; max: number };
    yearBuiltRange: { min: number; max: number };
    squareFootageRange: { min: number; max: number };
    schoolRatingRange: { min: number; max: number };
    distanceRange: { min: number; max: number };
    bedroomOptions: number[];
    bathroomOptions: number[];
  } {
    const prices = properties.map(p => p.price);
    const years = properties.map(p => p.year_built);
    const sqFt = properties.map(p => p.square_footage);
    const ratings = properties.map(p => p.school_rating);
    const distances = properties.map(p => p.distance_to_city_center);
    const bedrooms = [...new Set(properties.map(p => p.bedrooms))].sort((a, b) => a - b);
    const bathrooms = [...new Set(properties.map(p => Math.floor(p.bathrooms)))].sort((a, b) => a - b);

    return {
      priceRange: { min: Math.min(...prices), max: Math.max(...prices) },
      yearBuiltRange: { min: Math.min(...years), max: Math.max(...years) },
      squareFootageRange: { min: Math.min(...sqFt), max: Math.max(...sqFt) },
      schoolRatingRange: { min: Math.min(...ratings), max: Math.max(...ratings) },
      distanceRange: { min: Math.min(...distances), max: Math.max(...distances) },
      bedroomOptions: bedrooms,
      bathroomOptions: bathrooms,
    };
  }
}

export const marketDataService = new MarketDataService();