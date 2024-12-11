package org.andreiz0r.cs.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.andreiz0r.core.mapper.Mapper;
import org.andreiz0r.core.messaging.MessageAcknowledgement;
import org.andreiz0r.core.messaging.Topic;
import org.andreiz0r.core.request.UpdateChatMessageRequest;
import org.andreiz0r.cs.dto.ConversationDetailsDTO;
import org.andreiz0r.cs.entity.ChatMessage;
import org.andreiz0r.cs.entity.MessageStatus;
import org.andreiz0r.cs.repository.ChatRepository;
import org.andreiz0r.cs.repository.MessageStatusRepository;
import org.andreiz0r.cs.websocket.WebsocketWrapper;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class ChatService {

    private final ChatRepository chatRepository;
    private final MessageStatusRepository messageStatusRepository;
    private final WebsocketWrapper websocketWrapper;

    public Optional<List<ChatMessage>> getAllChatMessages() {
        return Optional.of(chatRepository.findAll());
    }

    public Optional<ChatMessage> findById(final UUID id) {
        return chatRepository.findById(id);
    }

    //        websocketWrapper.sendMessageToUser(messageAcknowledgement.target(), messageAcknowledgement, Topic.ACK_MESSAGE);
    public Optional<ConversationDetailsDTO> findConversation(final UUID senderId, final UUID receiverId) {
        return chatRepository.findConversation(senderId, receiverId)
                .map(conversation -> {
                    getLastReceivedMessageFromConversation(conversation, senderId, receiverId)
                            .ifPresent(lastMessage -> messageStatusRepository.findById(senderId)
                                    .ifPresentOrElse(
                                            messageStatus -> {
                                                messageStatus.setLastReadMessageId(lastMessage.getId());
                                                messageStatusRepository.save(messageStatus);

                                                websocketWrapper.sendMessageToUser(
                                                        receiverId,
                                                        new MessageAcknowledgement(lastMessage.getId(), senderId, receiverId),
                                                        Topic.ACK_MESSAGE);
                                            },
                                            () -> messageStatusRepository.save(new MessageStatus(senderId, lastMessage.getId()))
                                    )
                            );

                    MessageStatus messageStatus = getMessageStatusForId(receiverId).orElse(null);
                    return new ConversationDetailsDTO(conversation, messageStatus);
                });
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

//    public void updateMessageStatus(final UUID receiverId, final UUID messageId) {
//        messageStatusRepository.findById(receiverId)
//                .ifPresentOrElse(
//                        messageStatus -> {
//                            messageStatus.setLastReadMessageId(messageId);
//                            messageStatusRepository.save(messageStatus);
//                        },
//                        () -> messageStatusRepository.save(new MessageStatus(receiverId, messageId))
//                );
//    }

    public Optional<MessageStatus> getMessageStatusForId(final UUID id) {
        return messageStatusRepository.findById(id);
    }

    private Optional<ChatMessage> getLastReceivedMessageFromConversation(final List<ChatMessage> messages, final UUID senderId, final UUID receiverId) {
        return messages.stream()
                .filter(message -> message.getReceiverId().equals(senderId) && message.getSenderId().equals(receiverId))
                .reduce((first, second) -> second);
    }
}
