package org.andreiz0r.cs.websocket;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.andreiz0r.core.messaging.Topic;
import org.andreiz0r.core.response.Response;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Component;

import java.util.UUID;

@Component
@RequiredArgsConstructor
@Slf4j
public class WebsocketWrapper {
    private final SimpMessagingTemplate simpMessagingTemplate;

    public void sendMessage(final Object body, final Topic topic) {
        log.info("Sending message to topic {}: {}", topic, body);
        simpMessagingTemplate.convertAndSend(topic.toString(), Response.successResponse(body));
    }

    public void sendMessageToUser(final UUID userId, final Object body, final Topic topic ) {
        log.info("Sending message to user {} on topic {}: {}", userId, topic, body);
        simpMessagingTemplate.convertAndSendToUser(userId.toString(), topic.toString(), Response.successResponse(body));
    }
}
