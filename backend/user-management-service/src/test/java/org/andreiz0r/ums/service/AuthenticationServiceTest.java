package org.andreiz0r.ums.service;

import org.andreiz0r.core.request.CreateUserRequest;
import org.andreiz0r.core.response.AuthenticationResponse;
import org.andreiz0r.core.util.JwtUtils;
import org.andreiz0r.ums.entity.User;
import org.andreiz0r.ums.util.BaseUnitTest;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;

import java.util.Optional;

import static org.andreiz0r.ums.util.TestUtils.RequestUtils.authenticationRequest;
import static org.andreiz0r.ums.util.TestUtils.RequestUtils.createUserRequest;
import static org.andreiz0r.ums.util.TestUtils.UserUtils.convertToDTO;
import static org.andreiz0r.ums.util.TestUtils.UserUtils.randomUser;
import static org.hamcrest.MatcherAssert.assertThat;
import static org.hamcrest.Matchers.equalTo;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.mockito.MockitoAnnotations.openMocks;

class AuthenticationServiceTest extends BaseUnitTest {

    private static final String TOKEN = "token";

    @Mock
    private UserService userService;

    @Mock
    private JwtUtils jwtUtils;

    @InjectMocks
    private AuthenticationService victim;

    @BeforeEach
    void setUp() {
        openMocks(this);
    }

    @Test
    void register_userIsCreatedAndTokenGenerated_success() {
        User user = randomUser();
        CreateUserRequest request = createUserRequest(user);
        when(userService.create(request)).thenReturn(Optional.of(convertToDTO(user)));
        when(jwtUtils.generateToken(user.getId(), user.getUsername(), user.getRole())).thenReturn(TOKEN);

        Optional<AuthenticationResponse> response = victim.register(request);

        verify(userService).create(request);
        verify(jwtUtils).generateToken(user.getId(), user.getUsername(), user.getRole());
        response.ifPresentOrElse(
                authResponse -> {
                    assertThat(authResponse.user(), equalTo(convertToDTO(user)));
                    assertThat(authResponse.token(), equalTo(TOKEN));
                },
                this::assertThatFails
        );
    }

    @Test
    void register_userIsCreatedAndTokenGenerated_returnsEmptyOptional() {
        when(userService.create(any())).thenReturn(Optional.empty());
        CreateUserRequest request = createUserRequest(randomUser());

        Optional<AuthenticationResponse> response = victim.register(request);

        verify(userService).create(request);
        verify(jwtUtils, never()).generateToken(any());
        response.ifPresent(this::assertThatFails);
    }

    @Test
    void authenticate_validCredentials_success() {
        User user = randomUser();
        when(userService.findByUsername(user.getUsername())).thenReturn(Optional.of(convertToDTO(user)));
        when(jwtUtils.generateToken(user.getId(), user.getUsername(), user.getRole())).thenReturn(TOKEN);

        Optional<AuthenticationResponse> response = victim.authenticate(authenticationRequest(user.getUsername(), user.getPassword()));

        verify(userService).findByUsername(user.getUsername());
        verify(jwtUtils).generateToken(user.getId(), user.getUsername(), user.getRole());
        response.ifPresentOrElse(
                authResponse -> {
                    assertThat(authResponse.user(), equalTo(convertToDTO(user)));
                    assertThat(authResponse.token(), equalTo(TOKEN));
                },
                this::assertThatFails
        );
    }

    @Test
    void authenticate_userNotFound_returnsEmptyOptional() {
        User user = randomUser();
        when(userService.findByUsername(user.getUsername())).thenReturn(Optional.empty());

        Optional<AuthenticationResponse> response = victim.authenticate(authenticationRequest(user.getUsername(), user.getPassword()));

        verify(userService).findByUsername(user.getUsername());
        verify(jwtUtils, never()).generateToken(any());
        response.ifPresent(this::assertThatFails);
    }
}