package com.finrisk.service;

import com.finrisk.model.DocumentExtraction;
import com.finrisk.repository.DocumentExtractionRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDateTime;
import java.util.Base64;
import java.util.HashMap;
import java.util.Map;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Service
@RequiredArgsConstructor
@Slf4j
public class OcrService {

    private final DocumentExtractionRepository repository;

    private static final Pattern AADHAAR_PATTERN = Pattern.compile("\\d{4}\\s*\\d{4}\\s*\\d{4}");
    private static final Pattern PAN_PATTERN = Pattern.compile("[A-Z]{5}\\d{4}[A-Z]");
    private static final Pattern DOB_PATTERN = Pattern.compile("\\d{2}[/\\-]\\d{2}[/\\-]\\d{4}|\\d{4}[/\\-]\\d{2}[/\\-]\\d{2}");

    public DocumentExtraction extractFromAadhaar(String kycDocumentId, MultipartFile file) {
        String base64Image = encodeToBase64(file);
        String rawText = performOcrExtraction(base64Image, "AADHAAR");

        Map<String, String> extracted = extractFieldsFromText(rawText, "AADHAAR");

        DocumentExtraction extraction = new DocumentExtraction();
        extraction.setKycDocumentId(kycDocumentId);
        extraction.setDocumentType("AADHAAR");
        extraction.setExtractedName(extracted.get("name"));
        extraction.setExtractedDob(extracted.get("dob"));
        extraction.setExtractedAddress(extracted.get("address"));
        extraction.setExtractedAadhaarNumber(extracted.get("aadhaar"));
        extraction.setRawText(rawText);
        extraction.setExtractionConfidence(calculateConfidence(extracted));
        extraction.setStatus("COMPLETED");
        extraction.setCreatedAt(LocalDateTime.now());
        extraction.setUpdatedAt(LocalDateTime.now());

        return repository.save(extraction);
    }

    public DocumentExtraction extractFromPan(String kycDocumentId, MultipartFile file) {
        String base64Image = encodeToBase64(file);
        String rawText = performOcrExtraction(base64Image, "PAN");

        Map<String, String> extracted = extractFieldsFromText(rawText, "PAN");

        DocumentExtraction extraction = new DocumentExtraction();
        extraction.setKycDocumentId(kycDocumentId);
        extraction.setDocumentType("PAN");
        extraction.setExtractedName(extracted.get("name"));
        extraction.setExtractedPanNumber(extracted.get("pan"));
        extraction.setRawText(rawText);
        extraction.setExtractionConfidence(calculateConfidence(extracted));
        extraction.setStatus("COMPLETED");
        extraction.setCreatedAt(LocalDateTime.now());
        extraction.setUpdatedAt(LocalDateTime.now());

        return repository.save(extraction);
    }

    private String encodeToBase64(MultipartFile file) {
        try {
            return Base64.getEncoder().encodeToString(file.getBytes());
        } catch (Exception e) {
            log.error("Error encoding file to base64", e);
            return "";
        }
    }

    private String performOcrExtraction(String base64Image, String documentType) {
        // Simulated OCR extraction - in production, integrate with Google Vision/AWS Textract
        // For now, return extracted mock data based on document type
        log.info("Performing OCR extraction for document type: {}", documentType);

        // In production, this would call Google Vision API or AWS Textract
        // Example with Google Vision:
        // Vision.Image visionImage = Vision.Image.newBuilder().setContent(base64Image).build();
        // Feature feature = Feature.newBuilder().setType(TextDetection).build();
        // AnnotateImageResponse response = imageAnnotator.AnnotateImage(visionImage, feature);

        return getMockOcrText(documentType);
    }

    private String getMockOcrText(String documentType) {
        if ("AADHAAR".equals(documentType)) {
            return "GOVERNMENT OF INDIA\nUNIQUE IDENTIFICATION AUTHORITY OF INDIA\n\nName: JOHN DOE\nDOB: 15/08/1990\nGender: M\nAddress: 123 Main Street, Bangalore, Karnataka - 560001\n\nUID: 1234 5678 9012\nAadhaar No: 123456789012";
        } else if ("PAN".equals(documentType)) {
            return "INCOME TAX DEPARTMENT\nGOVERNMENT OF INDIA\n\nName: JOHN DOE\nFather's Name: MARK DOE\nDate of Birth: 15/08/1990\n\nPAN: ABCDE1234F\nAadhaar No: 123456789012";
        }
        return "";
    }

    private Map<String, String> extractFieldsFromText(String text, String documentType) {
        Map<String, String> extracted = new HashMap<>();

        if ("AADHAAR".equals(documentType)) {
            Matcher nameMatcher = Pattern.compile("Name:\\s*([A-Za-z\\s]+)", Pattern.CASE_INSENSITIVE).matcher(text);
            if (nameMatcher.find()) {
                extracted.put("name", nameMatcher.group(1).trim());
            }

            Matcher dobMatcher = DOB_PATTERN.matcher(text);
            if (dobMatcher.find()) {
                extracted.put("dob", dobMatcher.group());
            }

            Matcher aadhaarMatcher = AADHAAR_PATTERN.matcher(text);
            if (aadhaarMatcher.find()) {
                extracted.put("aadhaar", aadhaarMatcher.group().replaceAll("\\s", ""));
            }

            Matcher addressMatcher = Pattern.compile("Address:\\s*([\\s\\S]+?)(?=UID|Aadhaar|$)", Pattern.CASE_INSENSITIVE).matcher(text);
            if (addressMatcher.find()) {
                extracted.put("address", addressMatcher.group(1).trim());
            }
        } else if ("PAN".equals(documentType)) {
            Matcher nameMatcher = Pattern.compile("Name:\\s*([A-Za-z\\s]+)", Pattern.CASE_INSENSITIVE).matcher(text);
            if (nameMatcher.find()) {
                extracted.put("name", nameMatcher.group(1).trim());
            }

            Matcher panMatcher = PAN_PATTERN.matcher(text);
            if (panMatcher.find()) {
                extracted.put("pan", panMatcher.group());
            }

            Matcher dobMatcher = DOB_PATTERN.matcher(text);
            if (dobMatcher.find()) {
                extracted.put("dob", dobMatcher.group());
            }
        }

        return extracted;
    }

    private Double calculateConfidence(Map<String, String> extracted) {
        int filledFields = 0;
        int totalFields = extracted.size();

        for (String value : extracted.values()) {
            if (value != null && !value.isEmpty()) {
                filledFields++;
            }
        }

        return totalFields > 0 ? (double) filledFields / totalFields * 100 : 0.0;
    }

    public DocumentExtraction getExtractionByDocumentId(String kycDocumentId) {
        return repository.findByKycDocumentId(kycDocumentId).orElse(null);
    }
}