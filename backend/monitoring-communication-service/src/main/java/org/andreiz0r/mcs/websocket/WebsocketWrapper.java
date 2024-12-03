package org.andreiz0r.mcs.websocket;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.andreiz0r.core.exception.ClientError;
import org.andreiz0r.core.response.Response;
import org.andreiz0r.core.topic.Topic;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@Slf4j
public class WebsocketWrapper {

    private final SimpMessagingTemplate simpMessagingTemplate;

    public void sendSuccessMessage(final Object body, final Topic topic) {
        sendSuccessMessage(body, topic, "");
    }

    public void sendSuccessMessage(final Object body, final Topic topic, final String path) {
        String finalPath = topic.toString() + path;
        log.info("Sending message to {}", finalPath);
        simpMessagingTemplate.convertAndSend(finalPath, Response.successResponse(body));
    }

    public void sendFailureMessage(final ClientError error, final Topic topic) {
        simpMessagingTemplate.convertAndSend(topic.toString(), Response.failureResponse(error));
    }

}
