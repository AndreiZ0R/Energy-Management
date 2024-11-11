package org.andreiz0r.ums.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.andreiz0r.core.dto.UpdateDeviceIdsDTO;
import org.andreiz0r.core.dto.UserDTO;
import org.andreiz0r.core.enums.TracedService;
import org.andreiz0r.core.enums.UserRole;
import org.andreiz0r.core.event.UpdateDeviceIdsEvent;
import org.andreiz0r.core.mapper.Mapper;
import org.andreiz0r.core.request.CreateUserRequest;
import org.andreiz0r.core.request.UpdateUserRequest;
import org.andreiz0r.core.util.Constants.Time;
import org.andreiz0r.ums.entity.User;
import org.andreiz0r.ums.producer.RabbitProducer;
import org.andreiz0r.ums.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class UserService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final RabbitProducer rabbitProducer;

    public Optional<List<UserDTO>> getUsers() {
        return Optional.of(userRepository.findAll().stream().map(this::mapToDTO).toList());
    }

    public Optional<UserDTO> findById(final UUID id) {
        return userRepository.findById(id).map(user -> Mapper.mapTo(user, UserDTO.class));
    }

    public Optional<UserDTO> findByUsername(final String username) {
        return userRepository.findByUsername(username).map(this::mapToDTO);
    }

    public Optional<UserDTO> create(final CreateUserRequest request) {
        var user = userRepository.save(
                User.builder()
                        .username(request.username())
                        .email(request.email())
                        .password(passwordEncoder.encode(request.password()))
                        .createdAt(Time.timestampNow())
                        .role(UserRole.valueOf(request.role()))
                        .deviceIds(request.deviceIds())
                        .build());

        sendUpdateDeviceIdsEvent(user.getId(), user.getDeviceIds());
        return Optional.of(mapToDTO(user));
    }

    public Optional<UserDTO> update(final UpdateUserRequest request) {
        return userRepository.findById(request.id())
                .map(user -> {
                    List<UUID> currentDevices = user.getDeviceIds();
                    List<UUID> newDevices = request.deviceIds().stream().map(UUID::fromString).toList();

                    Mapper.updateValues(user, request);
                    userRepository.save(user);

                    if (newDevices.equals(currentDevices)) {
                        sendUpdateDeviceIdsEvent(user.getId(), user.getDeviceIds());
                    } else {
                        sendUpdateDeviceIdsEvent(null, currentDevices);
                        if (!newDevices.isEmpty()) {
                            sendUpdateDeviceIdsEvent(user.getId(), newDevices);
                        }
                    }

                    return mapToDTO(user);
                });
    }

    public Optional<UserDTO> deleteById(final UUID id) {
        return userRepository.findById(id)
                .filter(user -> {
                    List<UUID> deviceIds = user.getDeviceIds();
                    boolean userDeleted = userRepository.deleteByIdReturning(id) != 0;

                    if (userDeleted) {
                        sendUpdateDeviceIdsEvent(null, deviceIds);
                    }

                    return userDeleted;
                })
                .map(this::mapToDTO);
    }

    public void deleteDeviceFromUser(final UUID userId, final UUID deviceId) {
        userRepository.deleteDeviceFromUser(userId, deviceId);
    }

    private UserDTO mapToDTO(final User user) {
        return Mapper.mapTo(user, UserDTO.class);
    }

    private void sendUpdateDeviceIdsEvent(final UUID userId, final List<UUID> deviceIds) {
        UpdateDeviceIdsDTO updateDeviceIdsDTO = new UpdateDeviceIdsDTO(userId, deviceIds);
        rabbitProducer.produce(new UpdateDeviceIdsEvent(updateDeviceIdsDTO, TracedService.UMS));
    }
}
