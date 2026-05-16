package com.finrisk.service;

import com.finrisk.model.FaceVerification;
import com.finrisk.repository.FaceVerificationRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Random;

@Service
@RequiredArgsConstructor
@Slf4j
public class FaceVerificationService {

    private final FaceVerificationRepository repository;

    public FaceVerification verifyFace(String userId, String kycVerificationId,
                                        String selfieBase64, String aadhaarPhotoBase64) {
        log.info("Starting face verification for user: {}", userId);

        FaceVerification verification = new FaceVerification();
        verification.setUserId(userId);
        verification.setKycVerificationId(kycVerificationId);
        verification.setSelfieImageUrl("data:image/jpeg;base64," + selfieBase64);
        verification.setAadhaarImageUrl("data:image/jpeg;base64," + aadhaarPhotoBase64);
        verification.setCreatedAt(LocalDateTime.now());

        // In production, integrate with AWS Rekognition, FaceIO, or HyperVerge
        // For demonstration, we simulate the verification process

        // Step 1: Face detection in both images
        boolean selfieHasFace = detectFace(selfieBase64);
        boolean aadhaarHasFace = detectFace(aadhaarPhotoBase64);

        if (!selfieHasFace || !aadhaarHasFace) {
            verification.setStatus("FAILED");
            verification.setErrorMessage("Face not detected in one or both images");
            return repository.save(verification);
        }

        // Step 2: Face similarity comparison
        Double similarityScore = compareFaces(selfieBase64, aadhaarPhotoBase64);
        verification.setSimilarityScore(similarityScore);

        // Step 3: Liveness detection (simulated)
        Boolean livenessPassed = performLivenessDetection(selfieBase64);
        verification.setLivenessPassed(livenessPassed);

        // Step 4: Spoofing detection
        Boolean isSpoof = detectSpoofing(selfieBase64);
        verification.setIsSpoof(isSpoof);

        // Determine overall status
        boolean passed = similarityScore >= 70.0 && livenessPassed && !isSpoof;
        verification.setStatus(passed ? "VERIFIED" : "FAILED");
        verification.setUpdatedAt(LocalDateTime.now());

        if (!passed) {
            if (similarityScore < 70.0) {
                verification.setErrorMessage("Face similarity below threshold");
            } else if (!livenessPassed) {
                verification.setErrorMessage("Liveness check failed - possible photo attack");
            } else if (isSpoof) {
                verification.setErrorMessage("Spoofing detected");
            }
        }

        log.info("Face verification completed. Score: {}, Status: {}", similarityScore, verification.getStatus());
        return repository.save(verification);
    }

    private boolean detectFace(String base64Image) {
        // In production: Use AWS Rekognition or FaceIO for face detection
        // Simulated - assumes face detected if image is provided
        return base64Image != null && !base64Image.isEmpty();
    }

    private Double compareFaces(String selfieBase64, String aadhaarBase64) {
        // In production: Call AWS Rekognition CompareFaces or FaceIO matching
        // Example with AWS Rekognition:
        // CompareFacesRequest request = CompareFacesRequest.builder()
        //     .sourceImage(SourceImage.builder().bytes(ByteBuffer.wrap(Base64.getDecoder().decode(selfieBase64))).build())
        //     .targetImage(TargetImage.builder().bytes(ByteBuffer.wrap(Base64.getDecoder().decode(aadhaarBase64))).build())
        //     .similarityThreshold(70f).build();
        // CompareFacesResult result = rekognitionClient.compareFaces(request);

        // Simulated similarity score between 60-95
        Random random = new Random();
        return 60.0 + random.nextDouble() * 35;
    }

    private Boolean performLivenessDetection(String selfieBase64) {
        // In production: Use HyperVerge or similar liveness detection SDK
        // Simulated - assume passed unless specific indicators detected

        // Check for blink detection, head movement, etc.
        // For demo, assume passed
        return true;
    }

    private Boolean detectSpoofing(String selfieBase64) {
        // In production: Check for printed photo, screen replay, mask detection
        // Simulated - detect potential spoofing indicators
        return false;
    }

    public FaceVerification getVerificationByUserId(String userId) {
        return repository.findByUserId(userId).orElse(null);
    }

    public FaceVerification getVerificationByKycId(String kycVerificationId) {
        return repository.findByKycVerificationId(kycVerificationId).orElse(null);
    }
}