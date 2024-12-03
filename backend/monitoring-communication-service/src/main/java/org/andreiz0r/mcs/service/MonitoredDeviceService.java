package org.andreiz0r.mcs.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.andreiz0r.core.Notification;
import org.andreiz0r.core.enums.NotificationType;
import org.andreiz0r.core.mapper.Mapper;
import org.andreiz0r.core.request.CreateMonitoredDeviceRequest;
import org.andreiz0r.core.request.UpdateMonitoredDeviceRequest;
import org.andreiz0r.core.topic.Topic;
import org.andreiz0r.mcs.entity.HourlyConsumption;
import org.andreiz0r.mcs.entity.MonitoredDevice;
import org.andreiz0r.mcs.repository.HourlyConsumptionRepository;
import org.andreiz0r.mcs.repository.MonitoredDeviceRepository;
import org.andreiz0r.mcs.websocket.WebsocketWrapper;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.andreiz0r.core.util.Constants.Time.fromString;

@Service
@RequiredArgsConstructor
@Slf4j
public class MonitoredDeviceService {

    private final MonitoredDeviceRepository monitoredDeviceRepository;
    private final HourlyConsumptionRepository hourlyConsumptionRepository;
    private final WebsocketWrapper websocketWrapper;

    public Optional<List<MonitoredDevice>> getMonitoredDevices() {
        return Optional.of(monitoredDeviceRepository.findAll());
    }

    public Optional<MonitoredDevice> findByDeviceId(final UUID deviceId) {
        return monitoredDeviceRepository.findById(deviceId);
    }

    public Optional<MonitoredDevice> create(final CreateMonitoredDeviceRequest request) {
        var monitoredDevice = monitoredDeviceRepository.save(
                MonitoredDevice.builder()
                        .deviceId(request.deviceId())
                        .userId(request.userId())
                        .description(request.description())
                        .address(request.address())
                        .maximumHourlyConsumption(request.maximumHourlyConsumption())
                        .monitored(false)
                        .hourlyConsumptions(List.of())
                        .build()
        );

        return Optional.of(monitoredDevice);
    }

    public Optional<MonitoredDevice> update(final UpdateMonitoredDeviceRequest request) {
        return monitoredDeviceRepository.findById(request.deviceId())
                .map(device -> {
                    Mapper.updateValues(device, request);
                    return monitoredDeviceRepository.save(device);
                });
    }

    public Optional<MonitoredDevice> deleteById(final UUID deviceId) {
        return monitoredDeviceRepository.findById(deviceId)
                .filter(device -> monitoredDeviceRepository.deleteByIdReturning(deviceId) != 0);
    }

    public Optional<UUID> getRandomUnmonitoredDeviceIdForSimulator() {
        return monitoredDeviceRepository.findRandomUnmonitoredDevice();
    }

    public void setHourlyConsumption(final UUID deviceId, final Double hourlyConsumption, final String timestamp) {
        monitoredDeviceRepository.findById(deviceId)
                .ifPresentOrElse(
                        device -> {
                            hourlyConsumptionRepository.save(
                                    HourlyConsumption.builder()
                                            .deviceId(deviceId)
                                            .consumption(hourlyConsumption)
                                            .timestamp(fromString(timestamp))
                                            .build());
                            monitoredDeviceRepository.save(device);

                            if (hourlyConsumption > device.getMaximumHourlyConsumption()) {
                                log.info("Maximum hourly consumption exceeded for device {}, user: {}", deviceId, device.getUserId());
                                websocketWrapper.sendSuccessMessage(
                                        new Notification("Maximum hourly consumption exceeded for device: " + device.getDescription(),
                                                         NotificationType.INFO,
                                                         device.getUserId()),
                                        Topic.NOTIFICATIONS
//                                        , device.getUserId().toString()
                                );
                            }
                        },
                        () -> log.info("No device with id {} found", deviceId)
                );
    }

    public Boolean setMonitoredDevice(final UUID deviceId, final Boolean monitored) {
        return monitoredDeviceRepository.setDeviceMonitored(deviceId, monitored) != 0;
    }
}
