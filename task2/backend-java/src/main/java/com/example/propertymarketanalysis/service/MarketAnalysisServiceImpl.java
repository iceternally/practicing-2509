package com.example.propertymarketanalysis.service;

import com.example.propertymarketanalysis.dto.Housing;
import com.example.propertymarketanalysis.dto.HousingStats;
import com.example.propertymarketanalysis.dto.MarketAnalysisRequest;
import com.example.propertymarketanalysis.dto.MarketAnalysisResponse;
import com.example.propertymarketanalysis.dto.MarketData;
import com.example.propertymarketanalysis.dto.MarketTrend;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Service;
import org.springframework.cache.annotation.Cacheable;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Random;

@Service
public class MarketAnalysisServiceImpl implements MarketAnalysisService {
    
    private final Random random = new Random();
    
    @Override
    public MarketAnalysisResponse getMarketAnalysis(MarketAnalysisRequest request) {
        List<MarketData> historicalData = generateHistoricalData(request.getLocation(), request.getPropertyType(), request.getTimeframe());
        MarketTrend currentTrend = generateCurrentTrend(request.getLocation(), request.getPropertyType());
        
        MarketAnalysisResponse response = new MarketAnalysisResponse();
        response.setLocation(request.getLocation());
        response.setPropertyType(request.getPropertyType());
        response.setTimeframe(request.getTimeframe());
        response.setMarketData(historicalData);
        response.setCurrentTrend(currentTrend);
        response.setAverageGrowthRate(calculateAverageGrowthRate(historicalData));
        response.setMarketCondition(determineMarketCondition(currentTrend));
        response.setAnalysisDate(LocalDate.now().format(DateTimeFormatter.ISO_LOCAL_DATE));
        
        return response;
    }
    
    @Override
    public List<MarketData> getHistoricalData(String location, String propertyType, String timeframe) {
        return generateHistoricalData(location, propertyType, timeframe);
    }
    
    @Override
    public MarketTrend getCurrentTrend(String location, String propertyType) {
        return generateCurrentTrend(location, propertyType);
    }
    
    @Override
    public List<MarketAnalysisResponse> compareMarkets(List<String> locations, String propertyType, String timeframe) {
        List<MarketAnalysisResponse> comparisons = new ArrayList<>();
        
        for (String location : locations) {
            MarketAnalysisRequest request = new MarketAnalysisRequest();
            request.setLocation(location);
            request.setPropertyType(propertyType);
            request.setTimeframe(timeframe);
            
            comparisons.add(getMarketAnalysis(request));
        }
        
        return comparisons;
    }
    
    @Override
    public MarketTrend getMarketForecast(String location, String propertyType, String forecastPeriod) {
        MarketTrend forecast = new MarketTrend();
        forecast.setPeriod(forecastPeriod);
        forecast.setPercentageChange(random.nextDouble() * 20 - 10); // -10% to +10%
        forecast.setTrendDirection(forecast.getPercentageChange() > 2 ? "UP" : 
                                 forecast.getPercentageChange() < -2 ? "DOWN" : "STABLE");
        forecast.setDescription("Forecast for " + location + " " + propertyType + " market over " + forecastPeriod);
        forecast.setVolatility(random.nextDouble() * 15 + 5); // 5% to 20%
        
        return forecast;
    }
    
    private List<MarketData> generateHistoricalData(String location, String propertyType, String timeframe) {
        List<MarketData> data = new ArrayList<>();
        int months = getMonthsFromTimeframe(timeframe);
        
        double basePrice = 500000 + random.nextDouble() * 500000; // $500K to $1M base
        
        for (int i = months; i >= 0; i--) {
            LocalDate date = LocalDate.now().minusMonths(i);
            double priceVariation = 1 + (random.nextDouble() * 0.4 - 0.2); // ±20% variation
            
            MarketData marketData = new MarketData();
            marketData.setDate(date);
            marketData.setAveragePrice(basePrice * priceVariation);
            marketData.setMedianPrice(basePrice * priceVariation * 0.95);
            marketData.setTotalSales(random.nextInt(500) + 100);
            marketData.setPricePerSquareFoot(marketData.getAveragePrice() / (2000 + random.nextInt(1000)));
            marketData.setDaysOnMarket(random.nextInt(60) + 20);
            marketData.setLocation(location);
            marketData.setPropertyType(propertyType);
            
            data.add(marketData);
        }
        
        return data;
    }
    
    private MarketTrend generateCurrentTrend(String location, String propertyType) {
        MarketTrend trend = new MarketTrend();
        trend.setPeriod("Current Month");
        trend.setPercentageChange(random.nextDouble() * 20 - 10); // -10% to +10%
        trend.setTrendDirection(trend.getPercentageChange() > 2 ? "UP" : 
                              trend.getPercentageChange() < -2 ? "DOWN" : "STABLE");
        trend.setDescription("Current market trend for " + location + " " + propertyType + " properties");
        trend.setVolatility(random.nextDouble() * 15 + 5); // 5% to 20%
        
        return trend;
    }
    
    private double calculateAverageGrowthRate(List<MarketData> data) {
        if (data.size() < 2) return 0.0;
        
        double firstPrice = data.get(0).getAveragePrice();
        double lastPrice = data.get(data.size() - 1).getAveragePrice();
        
        return ((lastPrice - firstPrice) / firstPrice) * 100;
    }
    
    private String determineMarketCondition(MarketTrend trend) {
        if (trend.getPercentageChange() > 5) {
            return "SELLER";
        } else if (trend.getPercentageChange() < -5) {
            return "BUYER";
        } else {
            return "BALANCED";
        }
    }
    
    private int getMonthsFromTimeframe(String timeframe) {
        switch (timeframe.toUpperCase()) {
            case "1M": return 1;
            case "3M": return 3;
            case "6M": return 6;
            case "1Y": return 12;
            case "2Y": return 24;
            case "5Y": return 60;
            default: return 12;
        }
    }
    
    @Override
    public List<Housing> getHousingData() {
        List<Housing> housingList = new ArrayList<>();
        
        try {
            ClassPathResource resource = new ClassPathResource("data/housing.csv");
            BufferedReader reader = new BufferedReader(new InputStreamReader(resource.getInputStream()));
            
            String line;
            boolean isFirstLine = true;
            
            while ((line = reader.readLine()) != null) {
                // Skip header line
                if (isFirstLine) {
                    isFirstLine = false;
                    continue;
                }
                
                String[] values = line.split(",");
                if (values.length >= 9) {
                    Housing housing = new Housing();
                    housing.setId(Long.parseLong(values[0].trim()));
                    housing.setSquareFootage(Integer.parseInt(values[1].trim()));
                    housing.setBedrooms(Integer.parseInt(values[2].trim()));
                    housing.setBathrooms(Double.parseDouble(values[3].trim()));
                    housing.setYearBuilt(Integer.parseInt(values[4].trim()));
                    housing.setLotSize(Integer.parseInt(values[5].trim()));
                    housing.setDistanceToCityCenter(Double.parseDouble(values[6].trim()));
                    housing.setSchoolRating(Double.parseDouble(values[7].trim()));
                    housing.setPrice(Integer.parseInt(values[8].trim()));
                    
                    housingList.add(housing);
                }
            }
            
            reader.close();
        } catch (IOException e) {
            throw new RuntimeException("Error reading housing data from CSV file", e);
        } catch (NumberFormatException e) {
            throw new RuntimeException("Error parsing housing data from CSV file", e);
        }
        
        return housingList;
    }
    
    @Override
    @Cacheable(cacheNames = "housingStats", keyGenerator = "housingStatsKeyGenerator")
    public HousingStats getHousingStats() {
        List<Housing> housingList = getHousingData();
        int count = housingList.size();

        Double averagePrice = housingList.stream().mapToInt(Housing::getPrice).average().orElse(0.0);
        Integer minPrice = housingList.isEmpty() ? null : housingList.stream().mapToInt(Housing::getPrice).min().getAsInt();
        Integer maxPrice = housingList.isEmpty() ? null : housingList.stream().mapToInt(Housing::getPrice).max().getAsInt();

        Double averageBedrooms = housingList.stream().mapToInt(Housing::getBedrooms).average().orElse(0.0);
        Double averageBathrooms = housingList.stream().mapToDouble(Housing::getBathrooms).average().orElse(0.0);
        Double averageSquareFootage = housingList.stream().mapToInt(Housing::getSquareFootage).average().orElse(0.0);
        Double averageYearBuilt = housingList.stream().mapToInt(Housing::getYearBuilt).average().orElse(0.0);
        Double averageLotSize = housingList.stream().mapToInt(Housing::getLotSize).average().orElse(0.0);
        Double averageDistanceToCityCenter = housingList.stream().mapToDouble(Housing::getDistanceToCityCenter).average().orElse(0.0);
        Double averageSchoolRating = housingList.stream().mapToDouble(Housing::getSchoolRating).average().orElse(0.0);

        return new HousingStats(
                count,
                averagePrice,
                minPrice,
                maxPrice,
                averageBedrooms,
                averageBathrooms,
                averageSquareFootage,
                averageYearBuilt,
                averageLotSize,
                averageDistanceToCityCenter,
                averageSchoolRating
        );
    }
}