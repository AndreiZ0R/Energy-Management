package org.andreiz0r.cs.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.andreiz0r.core.mapper.Mapper;
import org.andreiz0r.core.request.UpdateChatMessageRequest;
import org.andreiz0r.cs.entity.ChatMessage;
import org.andreiz0r.cs.repository.ChatRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class ChatService {

    private final ChatRepository chatRepository;

    public Optional<List<ChatMessage>> getAllChatMessages() {
        return Optional.of(chatRepository.findAll());
    }

    public Optional<ChatMessage> findById(final UUID id) {
        return chatRepository.findById(id);
    }

    public Optional<List<ChatMessage>> findConversation(final UUID senderId, final UUID receiverId) {
        return chatRepository.findConversation(senderId, receiverId);
    }

    public Optional<ChatMessage> create(final ChatMessage chatMessage) {
        return Optional.of(chatRepository.save(chatMessage));
    }

    public Optional<ChatMessage> update(final UpdateChatMessageRequest request) {
        return chatRepository.findById(request.id())
                .map(chatMessage -> {
                    Mapper.updateValues(chatMessage, request);
                    chatMessage.setEdited(true);
                    return chatRepository.save(chatMessage);
                });
    }

    public Optional<ChatMessage> deleteById(final UUID id) {
        return chatRepository.findById(id)
                .filter(chatMessage -> chatRepository.deleteByIdReturning(id) != 0);
    }
}
