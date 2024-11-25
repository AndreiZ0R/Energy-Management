package org.andreiz0r.mcs.consumer;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.andreiz0r.core.dto.DeviceDTO;
import org.andreiz0r.core.dto.SensorDataDTO;
import org.andreiz0r.core.event.DeviceDeletedEvent;
import org.andreiz0r.core.event.DeviceUpdateEvent;
import org.andreiz0r.core.mapper.Mapper;
import org.andreiz0r.core.request.CreateMonitoredDeviceRequest;
import org.andreiz0r.core.request.UpdateMonitoredDeviceRequest;
import org.andreiz0r.mcs.service.MonitoredDeviceService;
import org.springframework.amqp.rabbit.annotation.RabbitHandler;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.HashSet;
import java.util.LinkedHashMap;
import java.util.Map;
import java.util.Objects;
import java.util.Set;
import java.util.UUID;

@Service
@RabbitListener(queues = {"${rabbit.queue.monitoring-events}"})
@RequiredArgsConstructor
@Slf4j
public class RabbitConsumer {

    @Value("${default.number.of.measurements}")
    private Integer numberOfMeasurements;
    private final MonitoredDeviceService monitoredDeviceService;
    private static final Map<UUID, Set<SensorDataDTO>> lastMeasurements = new HashMap<>();

    @RabbitHandler
    public void handleSensorData(final LinkedHashMap<String, String> event) {
        var sensorData = Mapper.mapTo(event, SensorDataDTO.class);
        UUID deviceId = sensorData.deviceId();
        log.info("Received sensor data: {}", sensorData);

        if (lastMeasurements.containsKey(deviceId)) {
            Set<SensorDataDTO> measurements = lastMeasurements.get(deviceId);
            measurements.add(sensorData);

            if (measurements.size() == numberOfMeasurements) {
                measurements.stream()
                        .map(SensorDataDTO::measurementValue)
                        .reduce(Double::sum)
                        .map(sum -> sum / measurements.size())
                        .ifPresentOrElse(
                                averageConsumption -> {
                                    monitoredDeviceService.setHourlyConsumption(deviceId, averageConsumption);
                                    log.info("Set hourlyConsumption to {} for device {}", averageConsumption, deviceId);
                                },
                                () -> log.error("No measurements set for device id: {}", deviceId)
                        );
                measurements.clear();
            }
        } else {
            Set<SensorDataDTO> measurements = new HashSet<>();
            measurements.add(sensorData);
            lastMeasurements.put(deviceId, measurements);
        }
    }

    @RabbitHandler
    public void handleDeviceEvent(final DeviceUpdateEvent event) {
        var eventData = event.getEventData();
        log.info("Received device event {}", event);

        if (Objects.isNull(eventData)) {
            log.error("Received bad DeviceUpdateEvent from {}, timestamp: {}", event.getEmitterService(), event.getTimestamp());
            return;
        }

        DeviceDTO device = eventData.device();
        try {
            switch (eventData.deviceAction()) {
                case CREATE -> monitoredDeviceService.create(new CreateMonitoredDeviceRequest(
                                device.id(),
                                device.userId(),
                                device.maximumHourlyConsumption()))
                        .ifPresentOrElse(
                                monitoredDevice -> log.info("Successfully synced new monitored device: {} -> {}", device, monitoredDevice),
                                () -> log.error("Failed to create monitored device {}", device)
                        );
                case UPDATE -> monitoredDeviceService.update(new UpdateMonitoredDeviceRequest(
                                device.id(),
                                device.userId(),
                                device.maximumHourlyConsumption(),
                                null,
                                null))
                        .ifPresentOrElse(
                                monitoredDevice -> log.info("Successfully updated monitored device: {} -> {}", device, monitoredDevice),
                                () -> log.error("Failed to update monitored device {}", device)
                        );
                default -> log.info("No valid device action found.");
            }
        } catch (Exception e) {
            log.error("Something went wrong while processing device event {}", event, e);
        }
    }

    @RabbitHandler
    public void handleDeviceDeletedEvent(final DeviceDeletedEvent event) {
        var eventData = event.getEventData();
        log.info("Received DeviceDeletedEvent event {}", event);

        if (Objects.isNull(eventData)) {
            log.error("Received bad DeviceDeletedEvent from {}, timestamp: {}", event.getEmitterService(), event.getTimestamp());
            return;
        }

        UUID deviceId = eventData.deviceId();
        try {
            monitoredDeviceService.deleteById(deviceId)
                    .ifPresentOrElse(
                            deletedDevice -> log.info("Successfully deleted device {}", deviceId),
                            () -> log.error("Failed to delete device {}", deviceId)
                    );
            log.info("Successfully deleted device {}", deviceId);
        } catch (Exception e) {
            log.error("Failed to delete device {}: {}", deviceId, e.getMessage());
        }
    }
}