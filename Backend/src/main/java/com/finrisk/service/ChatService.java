package com.finrisk.service;

import com.finrisk.model.ChatMessage;
import com.finrisk.repository.ChatMessageRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;
import java.util.Random;

@Service
@RequiredArgsConstructor
public class ChatService {

    private final ChatMessageRepository repository;

    public Map<String, Object> processMessage(String userId, String message) {
        ChatMessage userMessage = new ChatMessage();
        userMessage.setUserId(userId);
        userMessage.setRole("USER");
        userMessage.setContent(message);
        userMessage.setTimestamp(LocalDateTime.now());
        repository.save(userMessage);

        String response = generateResponse(message.toLowerCase());
        ChatMessage assistantMessage = new ChatMessage();
        assistantMessage.setUserId(userId);
        assistantMessage.setRole("ASSISTANT");
        assistantMessage.setContent(response);
        assistantMessage.setTimestamp(LocalDateTime.now());
        repository.save(assistantMessage);

        Map<String, Object> result = new HashMap<>();
        result.put("response", response);
        return result;
    }

    private String generateResponse(String message) {
        if (message.contains("eligible")) {
            return "Based on your profile, you may be eligible for loans ranging from ₹50,000 to ₹10,00,000 depending on your income and credit score. Would you like to check your eligibility?";
        }
        if (message.contains("rejected") || message.contains("reject")) {
            return "Common reasons for rejection include: high debt-to-income ratio, low credit score, insufficient income, or incomplete documentation. Would you like tips to improve your chances?";
        }
        if (message.contains("credit") || message.contains("score")) {
            return "To improve your credit score: 1) Pay bills on time, 2) Reduce credit utilization below 30%, 3) Don't close old accounts, 4) Check your report for errors. A score above 700 is considered good.";
        }
        if (message.contains("emi") || message.contains("calculate")) {
            return "EMI calculation depends on loan amount, interest rate, and tenure. For example, a ₹1,00,000 loan at 12% p.a. for 24 months would have an EMI of approximately ₹4,706.";
        }
        return "I'm here to help with your loan queries. You can ask me about eligibility, credit scores, EMI calculations, or why your application was rejected. How can I assist you today?";
    }
}