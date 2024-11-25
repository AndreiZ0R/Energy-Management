package org.andreiz0r.dms.service;

import lombok.RequiredArgsConstructor;
import org.andreiz0r.core.dto.DeviceDTO;
import org.andreiz0r.core.dto.DeviceDeletedDTO;
import org.andreiz0r.core.dto.DeviceUpdateDTO;
import org.andreiz0r.core.enums.DeviceAction;
import org.andreiz0r.core.enums.TracedService;
import org.andreiz0r.core.event.DeviceDeletedEvent;
import org.andreiz0r.core.event.DeviceUpdateEvent;
import org.andreiz0r.core.mapper.Mapper;
import org.andreiz0r.core.request.CreateDeviceRequest;
import org.andreiz0r.core.request.UpdateDeviceRequest;
import org.andreiz0r.dms.entity.Device;
import org.andreiz0r.dms.producer.RabbitProducer;
import org.andreiz0r.dms.repository.DeviceRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class DeviceService {

    @Value("${rabbit.routing.key.monitoring-events}")
    private String monitoringRoutingKey;

    private final DeviceRepository deviceRepository;
    private final RabbitProducer rabbitProducer;

    public Optional<List<DeviceDTO>> getAllDevices() {
        return Optional.of(deviceRepository.findAll().stream().map(this::mapToDTO).toList());
    }

    public Optional<List<DeviceDTO>> findMultipleById(final List<String> ids) {
        List<UUID> uuids = ids.stream().map(UUID::fromString).toList();
        return Optional.of(deviceRepository.findAllById(uuids).stream().map(this::mapToDTO).toList());
    }

    public Optional<DeviceDTO> findById(final UUID id) {
        return deviceRepository.findById(id).map(this::mapToDTO);
    }

    public Optional<DeviceDTO> create(final CreateDeviceRequest request) {
        var device = deviceRepository.save(
                Device.builder()
                        .address(request.address())
                        .description(request.description())
                        .maximumHourlyConsumption(request.maximumHourlyConsumption())
                        .build());

        DeviceDTO deviceDTO = mapToDTO(device);
        sendDeviceEvent(deviceDTO, DeviceAction.CREATE);

        return Optional.of(deviceDTO);
    }

    public Optional<DeviceDTO> update(final UpdateDeviceRequest request) {
        return deviceRepository.findById(request.id())
                .map(device -> {
                    Mapper.updateValues(device, request);
                    deviceRepository.save(device);
                    DeviceDTO deviceDTO = mapToDTO(device);

                    sendDeviceEvent(deviceDTO, DeviceAction.UPDATE);
                    return deviceDTO;
                });
    }

    public Optional<DeviceDTO> deleteById(final UUID id) {
        return deviceRepository.findById(id)
                .filter(device -> {
                    UUID userId = device.getUserId();
                    boolean deviceDeleted = deviceRepository.deleteByIdReturning(id) != 0;

                    if (deviceDeleted) {
                        DeviceDeletedDTO deviceDeletedDTO = new DeviceDeletedDTO(userId, id);
                        DeviceDeletedEvent event = new DeviceDeletedEvent(deviceDeletedDTO, TracedService.DMS);
                        rabbitProducer.produce(event);
                        rabbitProducer.produce(event, monitoringRoutingKey);
                    }

                    return deviceDeleted;
                })
                .map(this::mapToDTO);
    }

    public Integer updateDevicesWithUserId(final List<UUID> ids, final UUID userId) {
        return deviceRepository.updateDevicesWithUserId(ids, userId);
    }

    private DeviceDTO mapToDTO(final Device device) {
        return Mapper.mapTo(device, DeviceDTO.class);
    }

    private void sendDeviceEvent(final DeviceDTO deviceDTO, final DeviceAction action) {
        DeviceUpdateDTO eventData = new DeviceUpdateDTO(deviceDTO, action);
        rabbitProducer.produce(new DeviceUpdateEvent(eventData, TracedService.DMS), monitoringRoutingKey);
    }
}
