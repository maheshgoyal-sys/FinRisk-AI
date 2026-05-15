package com.finrisk.service;

import com.finrisk.model.KycDocument;
import com.finrisk.repository.KycDocumentRepository;
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

        return repository.save(document);
    }

    public Map<String, Object> getStatus(String userId) {
        List<KycDocument> documents = repository.findByUserId(userId);
        Map<String, Object> status = new HashMap<>();
        status.put("documents", documents);
        status.put("verified", documents.stream().allMatch(d -> "VERIFIED".equals(d.getStatus())));
        return status;
    }

    public void deleteDocument(String id) {
        repository.deleteById(id);
    }
}