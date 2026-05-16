package com.finrisk.service;

import com.finrisk.model.KycDocument;
import com.finrisk.model.User;
import com.finrisk.repository.KycDocumentRepository;
import com.finrisk.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Base64;
import java.util.HashMap;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class KycService {

    private final KycDocumentRepository repository;
    private final UserRepository userRepository;

    public KycDocument uploadDocument(String userId, String documentType, MultipartFile file) {
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
            userRepository.save(user);
        }

        return repository.save(document);
    }

    public Map<String, Object> getStatus(String userId) {
        List<KycDocument> documents = repository.findByUserId(userId);
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
        }

        return status;
    }

    public void deleteDocument(String id) {
        repository.deleteById(id);
    }
}