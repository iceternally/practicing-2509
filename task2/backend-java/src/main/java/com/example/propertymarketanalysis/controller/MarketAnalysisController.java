package com.example.propertymarketanalysis.controller;

import com.example.propertymarketanalysis.dto.Housing;
import com.example.propertymarketanalysis.dto.MarketAnalysisRequest;
import com.example.propertymarketanalysis.dto.MarketAnalysisResponse;
import com.example.propertymarketanalysis.dto.MarketData;
import com.example.propertymarketanalysis.dto.MarketTrend;
import com.example.propertymarketanalysis.service.MarketAnalysisService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/market-analysis")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class MarketAnalysisController {
    
    private final MarketAnalysisService marketAnalysisService;
    
    /**
     * Get comprehensive market analysis
     * POST /api/market-analysis
     */
    @PostMapping
    public ResponseEntity<MarketAnalysisResponse> getMarketAnalysis(@RequestBody MarketAnalysisRequest request) {
        MarketAnalysisResponse response = marketAnalysisService.getMarketAnalysis(request);
        return ResponseEntity.ok(response);
    }
    
    /**
     * Get historical market data
     * GET /api/market-analysis/historical?location={location}&propertyType={type}&timeframe={timeframe}
     */
    @GetMapping("/historical")
    public ResponseEntity<List<MarketData>> getHistoricalData(
            @RequestParam String location,
            @RequestParam(defaultValue = "ALL") String propertyType,
            @RequestParam(defaultValue = "1Y") String timeframe) {
        
        List<MarketData> data = marketAnalysisService.getHistoricalData(location, propertyType, timeframe);
        return ResponseEntity.ok(data);
    }
    
    /**
     * Get current market trend
     * GET /api/market-analysis/trend?location={location}&propertyType={type}
     */
    @GetMapping("/trend")
    public ResponseEntity<MarketTrend> getCurrentTrend(
            @RequestParam String location,
            @RequestParam(defaultValue = "ALL") String propertyType) {
        
        MarketTrend trend = marketAnalysisService.getCurrentTrend(location, propertyType);
        return ResponseEntity.ok(trend);
    }
    
    /**
     * Compare markets across multiple locations
     * POST /api/market-analysis/compare
     */
    @PostMapping("/compare")
    public ResponseEntity<List<MarketAnalysisResponse>> compareMarkets(
            @RequestParam List<String> locations,
            @RequestParam(defaultValue = "ALL") String propertyType,
            @RequestParam(defaultValue = "1Y") String timeframe) {
        
        List<MarketAnalysisResponse> comparisons = marketAnalysisService.compareMarkets(locations, propertyType, timeframe);
        return ResponseEntity.ok(comparisons);
    }
    
    /**
     * Get market forecast
     * GET /api/market-analysis/forecast?location={location}&propertyType={type}&period={period}
     */
    @GetMapping("/forecast")
    public ResponseEntity<MarketTrend> getMarketForecast(
            @RequestParam String location,
            @RequestParam(defaultValue = "ALL") String propertyType,
            @RequestParam(defaultValue = "6M") String forecastPeriod) {
        
        MarketTrend forecast = marketAnalysisService.getMarketForecast(location, propertyType, forecastPeriod);
        return ResponseEntity.ok(forecast);
    }
    
    /**
     * Get all housing data from CSV file
     * GET /api/market-analysis/housing
     */
    @GetMapping("/housing")
    public ResponseEntity<List<Housing>> getHousingData() {
        List<Housing> housingData = marketAnalysisService.getHousingData();
        return ResponseEntity.ok(housingData);
    }
    
    /**
     * Health check endpoint
     * GET /api/market-analysis/health
     */
    @GetMapping("/health")
    public ResponseEntity<String> healthCheck() {
        return ResponseEntity.ok("Market Analysis API is running");
    }
}