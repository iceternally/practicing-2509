package com.example.propertymarketanalysis.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class MarketAnalysisResponse {
    private String location;
    private String propertyType;
    private String timeframe;
    private List<MarketData> marketData;
    private MarketTrend currentTrend;
    private Double averageGrowthRate;
    private String marketCondition; // "BUYER", "SELLER", "BALANCED"
    private String analysisDate;
}