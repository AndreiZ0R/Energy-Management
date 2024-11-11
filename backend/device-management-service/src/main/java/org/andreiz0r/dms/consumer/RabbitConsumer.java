package org.andreiz0r.dms.consumer;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.andreiz0r.core.event.UpdateDeviceIdsEvent;
import org.andreiz0r.dms.service.DeviceService;
import org.springframework.amqp.rabbit.annotation.RabbitHandler;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Objects;
import java.util.UUID;

@Service
@RabbitListener(queues = {"${rabbit.queue.user-events}"})
@RequiredArgsConstructor
@Slf4j
public class RabbitConsumer {

    private final DeviceService deviceService;

    @RabbitHandler
    public void handleUpdateDeviceIdsEvent(final UpdateDeviceIdsEvent event) {
        var eventData = event.getEventData();

        if (Objects.isNull(eventData)) {
            log.error("Received bad UpdateDeviceIdsEvent from {}, timestamp: {}", event.getEmitterService(), event.getTimestamp());
            return;
        }

        UUID userId = eventData.userId();
        List<UUID> deviceIds = eventData.deviceIds();

        if (!deviceIds.isEmpty()) {
            Integer result = deviceService.updateDevicesWithUserId(deviceIds, userId);

            if (result == deviceIds.size()) {
                log.info("Successfully updated devices {} with the userId: {}", deviceIds, userId);
            } else {
                log.error("Failed to update devices {} with the userId: {}", deviceIds, userId);
                // Todo: get last userId and rollback
            }
        } else {
            log.info("Successfully removed userId from devices: {}", deviceIds);
            deviceService.updateDevicesWithUserId(deviceIds, null);
        }
    }
}
