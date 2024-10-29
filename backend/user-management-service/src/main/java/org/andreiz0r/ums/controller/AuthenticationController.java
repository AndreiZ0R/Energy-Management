package org.andreiz0r.ums.controller;

import lombok.RequiredArgsConstructor;
import org.andreiz0r.core.exception.ClientError;
import org.andreiz0r.core.request.AuthenticationRequest;
import org.andreiz0r.core.request.CreateUserRequest;
import org.andreiz0r.core.response.AuthenticationResponse;
import org.andreiz0r.core.response.Response;
import org.andreiz0r.ums.service.AuthenticationService;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import static org.andreiz0r.core.util.Constants.Headers.AUTHORIZATION;
import static org.andreiz0r.core.util.Constants.Headers.BEARER;
import static org.andreiz0r.core.util.Constants.ReturnMessages.LOGIN_FAILED;
import static org.andreiz0r.core.util.Constants.ReturnMessages.REGISTER_FAILED;
import static org.andreiz0r.ums.util.Constants.Paths.AUTH_CONTROLLER_ENDPOINT;

@RestController
@RequestMapping(AUTH_CONTROLLER_ENDPOINT)
@RequiredArgsConstructor
public class AuthenticationController {

    private final AuthenticationService authService;

    // Todo:
    @PostMapping("/register")
    private Response<AuthenticationResponse> register(@RequestBody final CreateUserRequest request) {
        return authService.register(request)
                .map(Response::successResponse)
                .orElse(Response.failureResponse(new ClientError(REGISTER_FAILED), HttpStatus.BAD_REQUEST));
    }

    // Todo:
    @PostMapping("/authenticate")
    private Response<AuthenticationResponse> authenticate(@RequestBody final AuthenticationRequest request) {
        return authService.authenticate(request)
                .map(authResponse -> Response.successResponse(authResponse, AUTHORIZATION, BEARER + authResponse.token()))
                .orElse(Response.failureResponse(new ClientError(LOGIN_FAILED), HttpStatus.UNAUTHORIZED));
    }

//    @GetMapping("/refresh")
//    public Response refreshToken(@RequestHeader(SESSION_ID_HEADER) final UUID sessionId) {
//        return service.refreshJwtToken(sessionId)
//                .map(this::successResponse)
//                .orElse(failureResponse(ReturnMessages.notFound(UserSession.class), HttpStatus.NOT_FOUND));
//    }
}
