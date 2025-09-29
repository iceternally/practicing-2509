package com.example.propertymarketanalysis.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class MarketAnalysisRequest {
    private String location;
    private String propertyType; // "HOUSE", "APARTMENT", "CONDO", "ALL"
    private String timeframe; // "1M", "3M", "6M", "1Y", "2Y", "5Y"
    private Double minPrice;
    private Double maxPrice;
    private Integer bedrooms;
    private Integer bathrooms;
}