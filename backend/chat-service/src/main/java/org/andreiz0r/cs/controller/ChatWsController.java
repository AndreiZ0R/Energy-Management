package org.andreiz0r.cs.controller;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.andreiz0r.core.messaging.ChatNotification;
import org.andreiz0r.core.messaging.Topic;
import org.andreiz0r.cs.entity.ChatMessage;
import org.andreiz0r.cs.service.ChatService;
import org.andreiz0r.cs.websocket.WebsocketWrapper;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.stereotype.Controller;

import java.security.Principal;
import java.util.Objects;

@Controller
@RequiredArgsConstructor
@Slf4j
public class ChatWsController {

    private final ChatService chatService;
    private final WebsocketWrapper websocketWrapper;

    @MessageMapping("/chat.send")
    public void sendMessage(@Payload final ChatMessage chatMessage, final Principal principal) {
        log.info("Received chat message: {}", chatMessage);

        if (Objects.nonNull(principal)) {
            log.info("Principal: {}", principal.getName());
        }

        chatService.create(chatMessage)
                .ifPresentOrElse(
                        message -> {
                            websocketWrapper.sendMessageToUser(chatMessage.getSenderId(), message, Topic.CHAT);
                            websocketWrapper.sendMessageToUser(chatMessage.getReceiverId(), message, Topic.CHAT);
                        },
                        () -> log.error("Failed to store message: {}", chatMessage)
                );
    }

    //TODO: read messages
    @MessageMapping("/chat.notifyTyping")
    public void notifyTyping(@Payload final ChatNotification chatNotification) {
        log.info("Received chat notification: {}", chatNotification);
        websocketWrapper.sendMessageToUser(chatNotification.receiverId(), chatNotification, Topic.CHAT_NOTIFICATION);
    }
}
