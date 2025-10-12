package com.example.propertymarketanalysis.service;

import com.example.propertymarketanalysis.dto.MarketAnalysisRequest;
import com.example.propertymarketanalysis.dto.MarketAnalysisResponse;
import com.example.propertymarketanalysis.dto.MarketData;
import com.example.propertymarketanalysis.dto.MarketTrend;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.util.Arrays;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

class MarketAnalysisServiceTest {
    
    private MarketAnalysisService marketAnalysisService;
    
    @BeforeEach
    void setUp() {
        marketAnalysisService = new MarketAnalysisServiceImpl();
    }
    
    @Test
    void testGetMarketAnalysis() {
        // Given
        MarketAnalysisRequest request = new MarketAnalysisRequest();
        request.setLocation("New York");
        request.setPropertyType("HOUSE");
        request.setTimeframe("1Y");
        
        // When
        MarketAnalysisResponse response = marketAnalysisService.getMarketAnalysis(request);
        
        // Then
        assertNotNull(response);
        assertEquals("New York", response.getLocation());
        assertEquals("HOUSE", response.getPropertyType());
        assertEquals("1Y", response.getTimeframe());
        assertNotNull(response.getMarketData());
        assertFalse(response.getMarketData().isEmpty());
        assertNotNull(response.getCurrentTrend());
        assertNotNull(response.getAverageGrowthRate());
        assertNotNull(response.getMarketCondition());
        assertNotNull(response.getAnalysisDate());
    }
    
    @Test
    void testGetHistoricalData() {
        // When
        List<MarketData> data = marketAnalysisService.getHistoricalData("Boston", "APARTMENT", "6M");
        
        // Then
        assertNotNull(data);
        assertFalse(data.isEmpty());
        assertEquals(7, data.size()); // 6 months + current month
        
        MarketData firstData = data.get(0);
        assertNotNull(firstData.getDate());
        assertNotNull(firstData.getAveragePrice());
        assertNotNull(firstData.getMedianPrice());
        assertNotNull(firstData.getTotalSales());
        assertNotNull(firstData.getPricePerSquareFoot());
        assertNotNull(firstData.getDaysOnMarket());
        assertEquals("Boston", firstData.getLocation());
        assertEquals("APARTMENT", firstData.getPropertyType());
    }
    
    @Test
    void testGetCurrentTrend() {
        // When
        MarketTrend trend = marketAnalysisService.getCurrentTrend("Chicago", "CONDO");
        
        // Then
        assertNotNull(trend);
        assertEquals("Current Month", trend.getPeriod());
        assertNotNull(trend.getPercentageChange());
        assertNotNull(trend.getTrendDirection());
        assertTrue(Arrays.asList("UP", "DOWN", "STABLE").contains(trend.getTrendDirection()));
        assertNotNull(trend.getDescription());
        assertNotNull(trend.getVolatility());
        assertTrue(trend.getVolatility() >= 5.0 && trend.getVolatility() <= 20.0);
    }
    
    @Test
    void testCompareMarkets() {
        // Given
        List<String> locations = Arrays.asList("New York", "Boston", "Chicago");
        
        // When
        List<MarketAnalysisResponse> comparisons = marketAnalysisService.compareMarkets(locations, "HOUSE", "1Y");
        
        // Then
        assertNotNull(comparisons);
        assertEquals(3, comparisons.size());
        
        for (int i = 0; i < locations.size(); i++) {
            MarketAnalysisResponse response = comparisons.get(i);
            assertEquals(locations.get(i), response.getLocation());
            assertEquals("HOUSE", response.getPropertyType());
            assertEquals("1Y", response.getTimeframe());
        }
    }
    
    @Test
    void testGetMarketForecast() {
        // When
        MarketTrend forecast = marketAnalysisService.getMarketForecast("Miami", "APARTMENT", "1Y");
        
        // Then
        assertNotNull(forecast);
        assertEquals("1Y", forecast.getPeriod());
        assertNotNull(forecast.getPercentageChange());
        assertTrue(forecast.getPercentageChange() >= -10.0 && forecast.getPercentageChange() <= 10.0);
        assertNotNull(forecast.getTrendDirection());
        assertTrue(Arrays.asList("UP", "DOWN", "STABLE").contains(forecast.getTrendDirection()));
        assertNotNull(forecast.getDescription());
        assertTrue(forecast.getDescription().contains("Miami"));
        assertTrue(forecast.getDescription().contains("APARTMENT"));
        assertNotNull(forecast.getVolatility());
    }

    // New tests related to housing data and stats
    @Test
    void testGetHousingData_missingCsv_throwsRuntimeException() {
        // When & Then: Since data/housing.csv is not present by default, the service should throw.
        RuntimeException ex = assertThrows(RuntimeException.class, () -> marketAnalysisService.getHousingData());
        assertTrue(ex.getMessage().toLowerCase().contains("housing"));
    }

    @Test
    void testGetHousingStats_missingCsv_throwsRuntimeException() {
        // When & Then: getHousingStats internally reads the CSV; with missing file it should throw.
        RuntimeException ex = assertThrows(RuntimeException.class, () -> marketAnalysisService.getHousingStats());
        assertTrue(ex.getMessage().toLowerCase().contains("housing"));
    }
}