package com.example.propertymarketanalysis.config;

import com.github.benmanes.caffeine.cache.Caffeine;
import org.springframework.cache.CacheManager;
import org.springframework.cache.caffeine.CaffeineCacheManager;
import org.springframework.cache.interceptor.KeyGenerator;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.io.ClassPathResource;
import org.springframework.core.io.Resource;

import java.io.InputStream;
import java.security.MessageDigest;

@Configuration
public class CacheConfig {

    @Bean
    public Caffeine<Object, Object> caffeineConfig() {
        return Caffeine.newBuilder()
                .maximumSize(500);
    }

    @Bean
    public CacheManager cacheManager(Caffeine<Object, Object> caffeine) {
        CaffeineCacheManager manager = new CaffeineCacheManager("housingStats");
        manager.setCaffeine(caffeine);
        return manager;
    }

    @Bean("housingStatsKeyGenerator")
    public KeyGenerator housingStatsKeyGenerator() {
        return (target, method, params) -> {
            try {
                Resource resource = new ClassPathResource("data/housing.csv");
                if (!resource.exists()) {
                    return "housing_csv_missing";
                }
                MessageDigest digest = MessageDigest.getInstance("SHA-256");
                try (InputStream is = resource.getInputStream()) {
                    byte[] buffer = new byte[8192];
                    int read;
                    while ((read = is.read(buffer)) > 0) {
                        digest.update(buffer, 0, read);
                    }
                }
                byte[] hash = digest.digest();
                StringBuilder hex = new StringBuilder(hash.length * 2);
                for (byte b : hash) {
                    hex.append(String.format("%02x", b));
                }
                return hex.toString();
            } catch (Exception e) {
                // Fallback in case of any error computing key
                return "housing_stats_key_error";
            }
        };
    }
}