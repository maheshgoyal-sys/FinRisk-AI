package com.finrisk.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.time.LocalDateTime;
import java.util.List;

@Data
@Document(collection = "fraud_alerts")
public class FraudAlert {
    @Id
    private String id;
    private String userId;
    private String alertType;
    private String severity;
    private String description;
    private List<String> relatedApplicationIds;
    private List<String> evidence;
    private String status;
    private Double fraudScore;
    private String resolvedBy;
    private String resolution;
    private LocalDateTime createdAt;
    private LocalDateTime resolvedAt;
}