package com.finrisk.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.time.LocalDateTime;

@Data
@Document(collection = "kyc_verifications")
public class KycVerification {
    @Id
    private String id;
    private String userId;
    private String aadhaarNumber;
    private String aadhaarName;
    private String aadhaarDob;
    private String aadhaarAddress;
    private String aadhaarStatus;
    private String panNumber;
    private String panName;
    private String panStatus;
    private String faceVerificationStatus;
    private Double faceSimilarityScore;
    private Boolean livenessPassed;
    private String addressProofStatus;
    private String overallStatus;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private String remarks;
}