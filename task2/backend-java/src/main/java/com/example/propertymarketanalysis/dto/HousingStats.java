package com.example.propertymarketanalysis.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class HousingStats {
    private Integer count;
    private Double averagePrice;
    private Integer minPrice;
    private Integer maxPrice;
    private Double averageBedrooms;
    private Double averageBathrooms;
    private Double averageSquareFootage;
    private Double averageYearBuilt;
    private Double averageLotSize;
    private Double averageDistanceToCityCenter;
    private Double averageSchoolRating;
}