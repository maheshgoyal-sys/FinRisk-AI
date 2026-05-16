package com.finrisk.service;

import com.finrisk.model.KycVerification;
import com.finrisk.model.KycDocument;
import com.finrisk.model.DocumentExtraction;
import com.finrisk.model.FaceVerification;
import com.finrisk.repository.KycVerificationRepository;
import com.finrisk.repository.KycDocumentRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDateTime;
import java.util.Base64;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
@Slf4j
public class EnhancedKycService {

    private final KycVerificationRepository kycVerificationRepository;
    private final KycDocumentRepository kycDocumentRepository;
    private final OcrService ocrService;
    private final FaceVerificationService faceVerificationService;
    private final FraudDetectionService fraudDetectionService;
    private final AuditService auditService;

    public KycVerification initiateKyc(String userId) {
        KycVerification kyc = new KycVerification();
        kyc.setUserId(userId);
        kyc.setOverallStatus("INITIATED");
        kyc.setCreatedAt(LocalDateTime.now());
        kyc.setUpdatedAt(LocalDateTime.now());
        return kycVerificationRepository.save(kyc);
    }

    public KycVerification processAadhaarUpload(String userId, MultipartFile file) {
        log.info("Processing Aadhaar upload for user: {}", userId);

        // Get or create KYC verification
        KycVerification kyc = getOrCreateKyc(userId);

        // Save document
        KycDocument document = saveDocument(userId, "AADHAAR", file);

        // Extract data using OCR
        DocumentExtraction extraction = ocrService.extractFromAadhaar(document.getId(), file);

        // Update KYC with extracted data
        kyc.setAadhaarNumber(extraction.getExtractedAadhaarNumber());
        kyc.setAadhaarName(extraction.getExtractedName());
        kyc.setAadhaarDob(extraction.getExtractedDob());
        kyc.setAadhaarAddress(extraction.getExtractedAddress());
        kyc.setAadhaarStatus("PENDING");
        kyc.setUpdatedAt(LocalDateTime.now());

        // Check for fraud
        if (extraction.getExtractedAadhaarNumber() != null) {
            fraudDetectionService.checkForDuplicateDocuments(userId, extraction.getExtractedAadhaarNumber(), null);
        }
        fraudDetectionService.checkForFakeDocument(userId, "AADHAAR", extraction.getExtractionConfidence());

        return kycVerificationRepository.save(kyc);
    }

    public KycVerification processPanUpload(String userId, MultipartFile file) {
        log.info("Processing PAN upload for user: {}", userId);

        KycVerification kyc = getOrCreateKyc(userId);

        // Save document
        KycDocument document = saveDocument(userId, "PAN", file);

        // Extract data using OCR
        DocumentExtraction extraction = ocrService.extractFromPan(document.getId(), file);

        // Update KYC with extracted data
        kyc.setPanNumber(extraction.getExtractedPanNumber());
        kyc.setPanName(extraction.getExtractedName());
        kyc.setPanStatus("PENDING");
        kyc.setUpdatedAt(LocalDateTime.now());

        // Check for fraud
        if (extraction.getExtractedPanNumber() != null) {
            fraudDetectionService.checkForDuplicateDocuments(userId, null, extraction.getExtractedPanNumber());
        }
        fraudDetectionService.checkForFakeDocument(userId, "PAN", extraction.getExtractionConfidence());

        return kycVerificationRepository.save(kyc);
    }

    public KycVerification processFaceVerification(String userId, String selfieBase64) {
        log.info("Processing face verification for user: {}", userId);

        KycVerification kyc = kycVerificationRepository.findByUserId(userId).orElse(null);
        if (kyc == null) {
            kyc = initiateKyc(userId);
        }

        // Get Aadhaar photo from document (in production, extract from OCR result)
        String aadhaarPhotoBase64 = getAadhaarPhotoFromDocuments(userId);

        // Perform face verification
        FaceVerification faceVerification = faceVerificationService.verifyFace(
                userId, kyc.getId(), selfieBase64, aadhaarPhotoBase64);

        kyc.setFaceVerificationStatus(faceVerification.getStatus());
        kyc.setFaceSimilarityScore(faceVerification.getSimilarityScore());
        kyc.setLivenessPassed(faceVerification.getLivenessPassed());
        kyc.setUpdatedAt(LocalDateTime.now());

        // Check for face mismatch fraud
        if (faceVerification.getSimilarityScore() != null) {
            fraudDetectionService.checkForFaceMismatch(userId, faceVerification.getSimilarityScore());
        }

        updateOverallStatus(kyc);
        return kycVerificationRepository.save(kyc);
    }

    public KycVerification processAddressProofUpload(String userId, MultipartFile file) {
        log.info("Processing address proof upload for user: {}", userId);

        KycVerification kyc = getOrCreateKyc(userId);

        // Save document
        saveDocument(userId, "ADDRESS_PROOF", file);

        kyc.setAddressProofStatus("PENDING");
        kyc.setUpdatedAt(LocalDateTime.now());

        updateOverallStatus(kyc);
        return kycVerificationRepository.save(kyc);
    }

    public KycVerification getKycStatus(String userId) {
        return kycVerificationRepository.findByUserId(userId).orElse(null);
    }

    public List<KycVerification> getAllPendingKyc() {
        return kycVerificationRepository.findByOverallStatus("PENDING");
    }

    public KycVerification manualOverrideStatus(String kycId, String newStatus, String remarks, String performedBy) {
        KycVerification kyc = kycVerificationRepository.findById(kycId).orElse(null);
        if (kyc != null) {
            String oldStatus = kyc.getOverallStatus();
            kyc.setOverallStatus(newStatus);
            kyc.setRemarks(remarks);
            kyc.setUpdatedAt(LocalDateTime.now());

            auditService.logManualOverride(kyc.getUserId(), "KYC_VERIFICATION", kycId,
                    Map.of("overallStatus", oldStatus),
                    Map.of("overallStatus", newStatus, "remarks", remarks),
                    performedBy);
        }
        return kyc;
    }

    private KycDocument saveDocument(String userId, String documentType, MultipartFile file) {
        KycDocument document = new KycDocument();
        document.setUserId(userId);
        document.setDocumentType(documentType);
        document.setFileName(file.getOriginalFilename());
        document.setStatus("PENDING");
        document.setUploadedAt(LocalDateTime.now());

        try {
            String base64 = Base64.getEncoder().encodeToString(file.getBytes());
            document.setFileUrl("data:" + file.getContentType() + ";base64," + base64);
        } catch (Exception e) {
            document.setFileUrl("/uploads/" + file.getOriginalFilename());
        }

        return kycDocumentRepository.save(document);
    }

    private KycVerification getOrCreateKyc(String userId) {
        return kycVerificationRepository.findByUserId(userId)
                .orElseGet(() -> initiateKyc(userId));
    }

    private String getAadhaarPhotoFromDocuments(String userId) {
        // In production, extract photo from Aadhaar document OCR
        // For demo, return mock base64
        List<KycDocument> docs = kycDocumentRepository.findByUserId(userId);
        return docs.stream()
                .filter(d -> "AADHAAR".equals(d.getDocumentType()))
                .findFirst()
                .map(d -> {
                    String url = d.getFileUrl();
                    if (url != null && url.startsWith("data:image")) {
                        return url.substring(url.indexOf(",") + 1);
                    }
                    return "";
                })
                .orElse("");
    }

    private void updateOverallStatus(KycVerification kyc) {
        int completed = 0;
        int total = 5;

        if ("VERIFIED".equals(kyc.getAadhaarStatus())) completed++;
        if ("VERIFIED".equals(kyc.getPanStatus())) completed++;
        if ("VERIFIED".equals(kyc.getFaceVerificationStatus())) completed++;
        if ("VERIFIED".equals(kyc.getAddressProofStatus())) completed++;

        if (completed == total) {
            kyc.setOverallStatus("VERIFIED");
        } else if (completed > 0) {
            kyc.setOverallStatus("PENDING");
        } else {
            kyc.setOverallStatus("INITIATED");
        }
    }
}