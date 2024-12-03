package org.andreiz0r.dms.consumer;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.andreiz0r.core.dto.DeviceDTO;
import org.andreiz0r.core.dto.DeviceUpdateDTO;
import org.andreiz0r.core.enums.DeviceAction;
import org.andreiz0r.core.event.DeviceUpdateEvent;
import org.andreiz0r.core.event.UpdateDeviceIdsEvent;
import org.andreiz0r.dms.producer.RabbitProducer;
import org.andreiz0r.dms.service.DeviceService;
import org.springframework.amqp.rabbit.annotation.RabbitHandler;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Objects;
import java.util.UUID;

@Service
@RabbitListener(queues = {"${rabbit.queue.user-events}"})
@RequiredArgsConstructor
@Slf4j
public class RabbitConsumer {

    @Value("${rabbit.routing.key.monitoring-events}")
    private String monitoringRoutingKey;

    private final DeviceService deviceService;
    private final RabbitProducer rabbitProducer;

    @RabbitHandler
    public void handleUpdateDeviceIdsEvent(final UpdateDeviceIdsEvent event) {
        var eventData = event.getEventData();

        if (Objects.isNull(eventData)) {
            log.error("Received bad UpdateDeviceIdsEvent from {}, timestamp: {}", event.getEmitterService(), event.getTimestamp());
            return;
        }

        UUID userId = eventData.userId();
        List<UUID> deviceIds = eventData.deviceIds();

        if (Objects.isNull(deviceIds)) {
            log.info("DeviceIds is null, new user has been created without devices, timestamp: {}", event.getTimestamp());
            return;
        }

        if (!deviceIds.isEmpty()) {
            Integer result = deviceService.updateDevicesWithUserId(deviceIds, userId);

            if (result == deviceIds.size()) {
                log.info("Successfully updated devices {} with the userId: {}", deviceIds, userId);
                deviceIds.forEach(deviceId -> {
                    DeviceUpdateDTO deviceUpdateData = new DeviceUpdateDTO(
                            new DeviceDTO(deviceId, null, null, null, userId),
                            DeviceAction.UPDATE);
                    // Todo: maybe move this to UMS
                    rabbitProducer.produce(new DeviceUpdateEvent(deviceUpdateData, event.getEmitterService()), monitoringRoutingKey);
                });
            } else {
                log.error("Failed to update devices {} with the userId: {}", deviceIds, userId);
            }
        } else {
            log.info("Successfully removed userId from devices: {}", deviceIds);
            deviceService.updateDevicesWithUserId(deviceIds, null);
        }
    }
}
