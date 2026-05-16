package com.finrisk.controller;

import com.finrisk.model.KycVerification;
import com.finrisk.model.DocumentExtraction;
import com.finrisk.service.EnhancedKycService;
import com.finrisk.service.OcrService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/kyc/verification")
@RequiredArgsConstructor
public class EnhancedKycController {

    private final EnhancedKycService enhancedKycService;
    private final OcrService ocrService;

    @PostMapping("/initiate")
    public ResponseEntity<KycVerification> initiate(Authentication auth) {
        String userId = auth.getName();
        return ResponseEntity.ok(enhancedKycService.initiateKyc(userId));
    }

    @PostMapping("/aadhaar")
    public ResponseEntity<KycVerification> uploadAadhaar(Authentication auth, @RequestParam MultipartFile file) {
        String userId = auth.getName();
        return ResponseEntity.ok(enhancedKycService.processAadhaarUpload(userId, file));
    }

    @PostMapping("/pan")
    public ResponseEntity<KycVerification> uploadPan(Authentication auth, @RequestParam MultipartFile file) {
        String userId = auth.getName();
        return ResponseEntity.ok(enhancedKycService.processPanUpload(userId, file));
    }

    @PostMapping("/face")
    public ResponseEntity<KycVerification> verifyFace(Authentication auth, @RequestBody Map<String, String> request) {
        String userId = auth.getName();
        String selfieBase64 = request.get("selfieBase64");
        return ResponseEntity.ok(enhancedKycService.processFaceVerification(userId, selfieBase64));
    }

    @PostMapping("/address-proof")
    public ResponseEntity<KycVerification> uploadAddressProof(Authentication auth, @RequestParam MultipartFile file) {
        String userId = auth.getName();
        return ResponseEntity.ok(enhancedKycService.processAddressProofUpload(userId, file));
    }

    @GetMapping("/status")
    public ResponseEntity<KycVerification> getStatus(Authentication auth) {
        String userId = auth.getName();
        return ResponseEntity.ok(enhancedKycService.getKycStatus(userId));
    }

    @GetMapping("/extraction/{documentId}")
    public ResponseEntity<DocumentExtraction> getExtraction(@PathVariable String documentId) {
        return ResponseEntity.ok(ocrService.getExtractionByDocumentId(documentId));
    }

    @GetMapping("/all-pending")
    public ResponseEntity<List<KycVerification>> getAllPending() {
        return ResponseEntity.ok(enhancedKycService.getAllPendingKyc());
    }

    @PutMapping("/manual-override/{kycId}")
    public ResponseEntity<KycVerification> manualOverride(
            @PathVariable String kycId,
            @RequestBody Map<String, String> request) {
        String status = request.get("status");
        String remarks = request.get("remarks");
        String performedBy = request.get("performedBy");
        return ResponseEntity.ok(enhancedKycService.manualOverrideStatus(kycId, status, remarks, performedBy));
    }
}