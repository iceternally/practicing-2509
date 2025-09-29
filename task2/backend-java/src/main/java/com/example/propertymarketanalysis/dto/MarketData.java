package com.example.propertymarketanalysis.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class MarketData {
    private LocalDate date;
    private Double averagePrice;
    private Double medianPrice;
    private Integer totalSales;
    private Double pricePerSquareFoot;
    private Integer daysOnMarket;
    private String location;
    private String propertyType;
}