package com.finrisk.controller;

import com.finrisk.model.KycDocument;
import com.finrisk.service.KycService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/kyc")
@RequiredArgsConstructor
public class KycController {

    private final KycService kycService;

    @PostMapping("/upload")
    public ResponseEntity<KycDocument> upload(Authentication auth, @RequestParam String documentType, @RequestParam MultipartFile file) {
        String userId = auth.getName();
        return ResponseEntity.ok(kycService.uploadDocument(userId, documentType, file));
    }

    @GetMapping("/status")
    public ResponseEntity<Map<String, Object>> getStatus(Authentication auth) {
        String userId = auth.getName();
        return ResponseEntity.ok(kycService.getStatus(userId));
    }

    // Admin endpoint to get documents for any user
    @GetMapping("/user/{userId}/documents")
    public ResponseEntity<List<KycDocument>> getUserDocuments(@PathVariable String userId) {
        return ResponseEntity.ok(kycService.getDocumentsByUserId(userId));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable String id) {
        kycService.deleteDocument(id);
        return ResponseEntity.ok().build();
    }
}