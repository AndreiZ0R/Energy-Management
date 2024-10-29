package org.andreiz0r.ums.consumer;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.andreiz0r.core.event.DeviceDeletedEvent;
import org.andreiz0r.ums.service.UserService;
import org.springframework.amqp.rabbit.annotation.RabbitHandler;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Service;

import java.util.Objects;
import java.util.UUID;

@Service
@RabbitListener(queues = {"${rabbit.queue.device-events}"})
@RequiredArgsConstructor
@Slf4j
public class RabbitConsumer {

    private final UserService userService;

    @RabbitHandler
    public void handleDeviceDeletedEvent(final DeviceDeletedEvent event) {
        var eventData = event.getEventData();

        if (Objects.isNull(eventData)) {
            log.error("Received bad DeviceDeletedEvent from {}, timestamp: {}", event.getEmitterService(), event.getTimestamp());
            return;
        }

        UUID userId = eventData.userId();
        UUID deviceId = eventData.deviceId();

        try {
            userService.deleteDeviceFromUser(userId, deviceId);
            log.info("Deleted device {} from user {}", deviceId, userId);
        } catch (Exception e) {
            log.error("Failed to delete device {} from user {}", deviceId, userId);
        }
    }
}
