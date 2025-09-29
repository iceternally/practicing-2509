package com.example.propertymarketanalysis.dto;

public class Housing {
    private Long id;
    private Integer squareFootage;
    private Integer bedrooms;
    private Double bathrooms;
    private Integer yearBuilt;
    private Integer lotSize;
    private Double distanceToCityCenter;
    private Double schoolRating;
    private Integer price;
    
    public Housing() {}
    
    public Housing(Long id, Integer squareFootage, Integer bedrooms, Double bathrooms, 
                   Integer yearBuilt, Integer lotSize, Double distanceToCityCenter, 
                   Double schoolRating, Integer price) {
        this.id = id;
        this.squareFootage = squareFootage;
        this.bedrooms = bedrooms;
        this.bathrooms = bathrooms;
        this.yearBuilt = yearBuilt;
        this.lotSize = lotSize;
        this.distanceToCityCenter = distanceToCityCenter;
        this.schoolRating = schoolRating;
        this.price = price;
    }
    
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public Integer getSquareFootage() { return squareFootage; }
    public void setSquareFootage(Integer squareFootage) { this.squareFootage = squareFootage; }
    
    public Integer getBedrooms() { return bedrooms; }
    public void setBedrooms(Integer bedrooms) { this.bedrooms = bedrooms; }
    
    public Double getBathrooms() { return bathrooms; }
    public void setBathrooms(Double bathrooms) { this.bathrooms = bathrooms; }
    
    public Integer getYearBuilt() { return yearBuilt; }
    public void setYearBuilt(Integer yearBuilt) { this.yearBuilt = yearBuilt; }
    
    public Integer getLotSize() { return lotSize; }
    public void setLotSize(Integer lotSize) { this.lotSize = lotSize; }
    
    public Double getDistanceToCityCenter() { return distanceToCityCenter; }
    public void setDistanceToCityCenter(Double distanceToCityCenter) { this.distanceToCityCenter = distanceToCityCenter; }
    
    public Double getSchoolRating() { return schoolRating; }
    public void setSchoolRating(Double schoolRating) { this.schoolRating = schoolRating; }
    
    public Integer getPrice() { return price; }
    public void setPrice(Integer price) { this.price = price; }
}