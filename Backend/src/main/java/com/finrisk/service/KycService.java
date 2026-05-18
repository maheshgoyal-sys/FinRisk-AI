package com.finrisk.service;

import java.time.LocalDateTime;
import java.util.Base64;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.finrisk.model.KycDocument;
import com.finrisk.model.User;
import com.finrisk.repository.KycDocumentRepository;
import com.finrisk.repository.UserRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j
public class KycService {

    private final KycDocumentRepository repository;
    private final UserRepository userRepository;

    public KycDocument uploadDocument(String userId, String documentType, MultipartFile file) {
        try {
            log.info("Starting document upload for user: {} with type: {}", userId, documentType);

            KycDocument document = new KycDocument();
            document.setUserId(userId);
            document.setDocumentType(documentType);
            document.setFileName(file.getOriginalFilename());
            document.setStatus("PENDING");
            document.setUploadedAt(LocalDateTime.now());

            try {
                String base64 = Base64.getEncoder().encodeToString(file.getBytes());
                document.setFileUrl("data:" + file.getContentType() + ";base64," + base64);
                log.debug("Document converted to base64 for user: {}", userId);
            } catch (Exception e) {
                log.warn("Failed to convert to base64, using file path instead: {}", e.getMessage());
                document.setFileUrl("/uploads/" + file.getOriginalFilename());
            }

            // Save document to database
            KycDocument savedDocument = repository.save(document);
            log.info("Document saved successfully with ID: {}", savedDocument.getId());

            // Update User's document status to PENDING
            User user = userRepository.findById(userId).orElse(null);
            if (user != null) {
                switch (documentType) {
                    case "AADHAAR":
                        user.setAadhaarStatus("PENDING");
                        break;
                    case "PAN":
                        user.setPanStatus("PENDING");
                        break;
                    case "ADDRESS":
                        user.setAddressStatus("PENDING");
                        break;
                    case "PHOTO":
                        user.setPhotoStatus("PENDING");
                        break;
                }
                user.setUpdatedAt(LocalDateTime.now());
                userRepository.save(user);
                log.info("User document status updated for user: {} with type: {}", userId, documentType);
            } else {
                log.warn("User not found for ID: {}", userId);
            }

            return savedDocument;
        } catch (Exception e) {
            log.error("Error uploading document for user: {} with type: {}", userId, documentType, e);
            throw new RuntimeException("Failed to upload document: " + e.getMessage(), e);
        }
    }

    public Map<String, Object> getStatus(String userId) {
        log.info("Getting KYC status for user: {}", userId);
        List<KycDocument> documents = repository.findByUserId(userId);
        log.debug("Found {} documents for user: {}", documents.size(), userId);

        Map<String, Object> status = new HashMap<>();
        status.put("documents", documents);
        status.put("verified", documents.stream().allMatch(d -> "VERIFIED".equals(d.getStatus())));

        // Get user's KYC verification status from User model
        User user = userRepository.findById(userId).orElse(null);
        if (user != null) {
            Map<String, String> kycVerification = new HashMap<>();
            kycVerification.put("aadhaarStatus", user.getAadhaarStatus() != null ? user.getAadhaarStatus() : "NOT_SUBMITTED");
            kycVerification.put("panStatus", user.getPanStatus() != null ? user.getPanStatus() : "NOT_SUBMITTED");
            kycVerification.put("addressStatus", user.getAddressStatus() != null ? user.getAddressStatus() : "NOT_SUBMITTED");
            kycVerification.put("photoStatus", user.getPhotoStatus() != null ? user.getPhotoStatus() : "NOT_SUBMITTED");

            // Determine overall KYC status
            boolean allVerified = "VERIFIED".equals(user.getAadhaarStatus()) &&
                                  "VERIFIED".equals(user.getPanStatus()) &&
                                  "VERIFIED".equals(user.getAddressStatus()) &&
                                  "VERIFIED".equals(user.getPhotoStatus());

            boolean anyRejected = "REJECTED".equals(user.getAadhaarStatus()) ||
                                   "REJECTED".equals(user.getPanStatus()) ||
                                   "REJECTED".equals(user.getAddressStatus()) ||
                                   "REJECTED".equals(user.getPhotoStatus());

            String kycStatus;
            if (allVerified) {
                kycStatus = "VERIFIED";
            } else if (anyRejected) {
                kycStatus = "REJECTED";
            } else if ("NOT_SUBMITTED".equals(user.getAadhaarStatus()) &&
                       "NOT_SUBMITTED".equals(user.getPanStatus()) &&
                       "NOT_SUBMITTED".equals(user.getAddressStatus()) &&
                       "NOT_SUBMITTED".equals(user.getPhotoStatus())) {
                kycStatus = "NOT_SUBMITTED";
            } else {
                kycStatus = "PENDING";
            }

            status.put("kycVerification", kycVerification);
            status.put("kycStatus", kycStatus);
        } else {
            log.warn("User not found for ID: {}", userId);
        }

        return status;
    }

    public void deleteDocument(String id) {
        log.info("Deleting document with ID: {}", id);
        repository.deleteById(id);
    }

    public List<KycDocument> getDocumentsByUserId(String userId) {
        log.info("Getting documents for user: {}", userId);
        List<KycDocument> documents = repository.findByUserId(userId);
        log.debug("Found {} documents for user: {}", documents.size(), userId);
        return documents;
    }
}