package com.finrisk.repository;

import com.finrisk.model.ChatMessage;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;

public interface ChatMessageRepository extends org.springframework.data.mongodb.repository.MongoRepository<ChatMessage, String> {
    List<ChatMessage> findByUserIdOrderByTimestampDesc(String userId);
}