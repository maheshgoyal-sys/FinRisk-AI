package com.finrisk.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.time.LocalDateTime;

@Data
@Document(collection = "face_verifications")
public class FaceVerification {
    @Id
    private String id;
    private String userId;
    private String kycVerificationId;
    private String selfieImageUrl;
    private String aadhaarImageUrl;
    private Double similarityScore;
    private Boolean isSpoof;
    private Boolean livenessPassed;
    private String status;
    private String errorMessage;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}