package com.example.propertymarketanalysis.service;

import com.example.propertymarketanalysis.dto.Housing;
import com.example.propertymarketanalysis.dto.HousingStats;
import com.example.propertymarketanalysis.dto.MarketAnalysisRequest;
import com.example.propertymarketanalysis.dto.MarketAnalysisResponse;
import com.example.propertymarketanalysis.dto.MarketData;
import com.example.propertymarketanalysis.dto.MarketTrend;

import java.util.List;

public interface MarketAnalysisService {
    
    /**
     * Get comprehensive market analysis for a specific location and criteria
     */
    MarketAnalysisResponse getMarketAnalysis(MarketAnalysisRequest request);
    
    /**
     * Get historical market data for a specific location
     */
    List<MarketData> getHistoricalData(String location, String propertyType, String timeframe);
    
    /**
     * Get current market trends
     */
    MarketTrend getCurrentTrend(String location, String propertyType);
    
    /**
     * Get market comparison between different locations
     */
    List<MarketAnalysisResponse> compareMarkets(List<String> locations, String propertyType, String timeframe);
    
    /**
     * Get market forecast for the next period
     */
    MarketTrend getMarketForecast(String location, String propertyType, String forecastPeriod);
    
    /**
     * Get all housing data from CSV file
     */
    List<Housing> getHousingData();
    
    /**
     * Get aggregate statistics for housing dataset
     */
    HousingStats getHousingStats();
}