package org.andreiz0r.dms.service;

import lombok.RequiredArgsConstructor;
import org.andreiz0r.core.dto.DeviceDTO;
import org.andreiz0r.core.mapper.Mapper;
import org.andreiz0r.core.request.CreateDeviceRequest;
import org.andreiz0r.core.request.UpdateDeviceRequest;
import org.andreiz0r.dms.entity.Device;
import org.andreiz0r.dms.repository.DeviceRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class DeviceService {

    private final DeviceRepository deviceRepository;

    public Optional<List<DeviceDTO>> getAllDevices() {
        return Optional.of(deviceRepository.findAll().stream().map(this::mapToDTO).toList());
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

        return Optional.of(mapToDTO(device));
    }

    public Optional<DeviceDTO> update(final UpdateDeviceRequest request) {
        return deviceRepository.findById(request.id())
                .map(device -> {
                    Mapper.updateValues(device, request);
                    deviceRepository.save(device);
                    return mapToDTO(device);
                });
    }

    public Optional<DeviceDTO> deleteById(final UUID id) {
        return deviceRepository.findById(id)
                .filter(__ -> deviceRepository.deleteByIdReturning(id) != 0)
                .map(this::mapToDTO);
    }

    private DeviceDTO mapToDTO(final Device device) {
        return Mapper.mapTo(device, DeviceDTO.class);
    }
}
