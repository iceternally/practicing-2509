package com.example.propertymarketanalysis;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cache.annotation.EnableCaching;

@SpringBootApplication
@EnableCaching
public class PropertyMarketAnalysisApplication {

    public static void main(String[] args) {
        SpringApplication.run(PropertyMarketAnalysisApplication.class, args);
    }

}