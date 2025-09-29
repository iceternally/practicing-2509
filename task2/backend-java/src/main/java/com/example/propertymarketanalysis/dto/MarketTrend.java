package com.example.propertymarketanalysis.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class MarketTrend {
    private String period;
    private Double percentageChange;
    private String trendDirection; // "UP", "DOWN", "STABLE"
    private String description;
    private Double volatility;
}