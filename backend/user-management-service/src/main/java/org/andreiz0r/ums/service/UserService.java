package org.andreiz0r.ums.service;

import lombok.RequiredArgsConstructor;
import org.andreiz0r.core.dto.UserDTO;
import org.andreiz0r.core.enums.UserRole;
import org.andreiz0r.core.mapper.Mapper;
import org.andreiz0r.core.request.CreateUserRequest;
import org.andreiz0r.core.request.UpdateUserRequest;
import org.andreiz0r.ums.entity.User;
import org.andreiz0r.ums.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;

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
                        .password(request.password())
                        .role(UserRole.valueOf(request.role()))
                        .deviceIds(request.deviceIds())
                        .build());

        return Optional.of(mapToDTO(user));
    }

    public Optional<UserDTO> update(final UpdateUserRequest request) {
        return userRepository.findById(request.id())
                .map(user -> {
                    Mapper.updateValues(user, request);
                    userRepository.save(user);
                    return mapToDTO(user);
                });
    }

    public Optional<UserDTO> deleteById(final UUID id) {
        return userRepository.findById(id)
                .filter(__ -> userRepository.deleteByIdReturning(id) != 0)
                .map(this::mapToDTO);
    }

    private UserDTO mapToDTO(final User user) {
        return Mapper.mapTo(user, UserDTO.class);
    }
}
