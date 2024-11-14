package org.andreiz0r.ums.controller;

import org.andreiz0r.core.exception.ClientError;
import org.andreiz0r.core.request.AuthenticationRequest;
import org.andreiz0r.core.request.CreateUserRequest;
import org.andreiz0r.core.response.AuthenticationResponse;
import org.andreiz0r.core.response.Response;
import org.andreiz0r.ums.entity.User;
import org.andreiz0r.ums.service.AuthenticationService;
import org.andreiz0r.ums.util.BaseUnitTest;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.springframework.http.HttpStatus;

import java.util.List;
import java.util.Optional;

import static org.andreiz0r.core.util.Constants.ReturnMessages.BAD_TOKEN;
import static org.andreiz0r.core.util.Constants.ReturnMessages.LOGIN_FAILED;
import static org.andreiz0r.core.util.Constants.ReturnMessages.REGISTER_FAILED;
import static org.andreiz0r.core.util.Randoms.alphabetic;
import static org.andreiz0r.ums.util.TestUtils.RequestUtils.authenticationRequest;
import static org.andreiz0r.ums.util.TestUtils.RequestUtils.createUserRequest;
import static org.andreiz0r.ums.util.TestUtils.ResponseUtils.assertThatResponseFailed;
import static org.andreiz0r.ums.util.TestUtils.ResponseUtils.assertThatResponseIsSuccessful;
import static org.andreiz0r.ums.util.TestUtils.UserUtils.convertToDTO;
import static org.andreiz0r.ums.util.TestUtils.UserUtils.randomUser;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.mockito.MockitoAnnotations.openMocks;

class AuthenticationControllerTest extends BaseUnitTest {

    private static final String TOKEN = "token";

    @Mock
    private AuthenticationService service;

    @InjectMocks
    private AuthenticationController victim;

    @BeforeEach
    void setUp() {
        openMocks(this);
    }

    @Test
    void register_userIsCreatedAndAuthenticated_returnsSuccess() {
        User user = randomUser();
        CreateUserRequest request = createUserRequest(user);
        AuthenticationResponse expectedResponse = authenticationResponse(user, TOKEN);
        when(service.register(request)).thenReturn(Optional.of(expectedResponse));

        Response<AuthenticationResponse> response = victim.register(request);

        verify(service).register(request);
        assertThatResponseIsSuccessful(response, expectedResponse);
    }

    @Test
    void register_userIsNotCreated_returnsFailure() {
        when(service.register(any())).thenReturn(Optional.empty());

        Response<AuthenticationResponse> response = victim.register(createUserRequest(randomUser()));

        verify(service).register(any());
        assertThatResponseFailed(response, List.of(new ClientError(REGISTER_FAILED)), HttpStatus.BAD_REQUEST);
    }

    @Test
    void authenticate_userIsAuthenticated_returnsSuccess() {
        User user = randomUser();
        AuthenticationRequest request = authenticationRequest(user.getUsername(), user.getPassword());
        AuthenticationResponse expectedResponse = authenticationResponse(user, TOKEN);
        when(service.authenticate(request)).thenReturn(Optional.of(expectedResponse));

        Response<AuthenticationResponse> response = victim.authenticate(request);

        verify(service).authenticate(request);
        assertThatResponseIsSuccessful(response, expectedResponse);
    }

    @Test
    void authenticate_badCredentials_returnsFailure() {
        AuthenticationRequest request = authenticationRequest(alphabetic(), alphabetic());
        when(service.authenticate(request)).thenReturn(Optional.empty());

        Response<AuthenticationResponse> response = victim.authenticate(request);

        verify(service).authenticate(request);
        assertThatResponseFailed(response, List.of(new ClientError(LOGIN_FAILED)), HttpStatus.UNAUTHORIZED);
    }

    @Test
    void validateToken_tokenIsValid_returnsSuccess() {
        when(service.isValidToken(TOKEN)).thenReturn(true);

        Response<String> response = victim.validateToken(TOKEN);

        verify(service).isValidToken(TOKEN);
        assertThatResponseIsSuccessful(response, TOKEN);
    }

    @Test
    void validateToken_tokenIsNotValid_returnsFailure() {
        when(service.isValidToken(TOKEN)).thenReturn(false);

        Response<String> response = victim.validateToken(TOKEN);

        verify(service).isValidToken(TOKEN);
        assertThatResponseFailed(response, List.of(new ClientError(BAD_TOKEN)), HttpStatus.UNAUTHORIZED);
    }

    private AuthenticationResponse authenticationResponse(final User user, final String token) {
        return new AuthenticationResponse(convertToDTO(user), token);
    }
}