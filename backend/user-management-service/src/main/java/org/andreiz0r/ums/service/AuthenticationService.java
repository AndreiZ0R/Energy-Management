package org.andreiz0r.ums.service;

import lombok.RequiredArgsConstructor;
import org.andreiz0r.core.dto.UserDTO;
import org.andreiz0r.core.request.AuthenticationRequest;
import org.andreiz0r.core.request.CreateUserRequest;
import org.andreiz0r.core.response.AuthenticationResponse;
import org.andreiz0r.core.util.JwtUtils;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class AuthenticationService {

    private final UserService userService;
    private final JwtUtils jwtUtils;

    public Optional<AuthenticationResponse> register(final CreateUserRequest request) {
        return userService.create(request)
                .map(this::mapToAuthenticationResponse);
    }

    public Optional<AuthenticationResponse> authenticate(final AuthenticationRequest request) {
        return userService.findByUsername(request.username())
                .map(this::mapToAuthenticationResponse);
    }

    private AuthenticationResponse mapToAuthenticationResponse(final UserDTO userDTO) {
        return new AuthenticationResponse(
                userDTO,
                jwtUtils.generateToken(userDTO.id(), userDTO.username(), userDTO.role())
        );
    }
}
