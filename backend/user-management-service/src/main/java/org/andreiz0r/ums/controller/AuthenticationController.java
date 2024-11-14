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

import static org.andreiz0r.core.util.Constants.ReturnMessages.BAD_TOKEN;
import static org.andreiz0r.core.util.Constants.ReturnMessages.LOGIN_FAILED;
import static org.andreiz0r.core.util.Constants.ReturnMessages.REGISTER_FAILED;
import static org.andreiz0r.ums.util.Constants.Paths.AUTH_CONTROLLER_ENDPOINT;

@RestController
@RequestMapping(AUTH_CONTROLLER_ENDPOINT)
@RequiredArgsConstructor
public class AuthenticationController {

    private final AuthenticationService authService;

    @PostMapping("/register")
    public Response<AuthenticationResponse> register(@RequestBody final CreateUserRequest request) {
        return authService.register(request)
                .map(Response::successResponse)
                .orElse(Response.failureResponse(new ClientError(REGISTER_FAILED), HttpStatus.BAD_REQUEST));
    }

    @PostMapping("/authenticate")
    public Response<AuthenticationResponse> authenticate(@RequestBody final AuthenticationRequest request) {
        return authService.authenticate(request)
                .map(Response::successResponse)
                .orElse(Response.failureResponse(new ClientError(LOGIN_FAILED), HttpStatus.UNAUTHORIZED));
    }

    @PostMapping("/validate")
    public Response<String> validateToken(@RequestBody final String token) {
        return authService.isValidToken(token) ?
               Response.successResponse(token) :
               Response.failureResponse(new ClientError(BAD_TOKEN), HttpStatus.UNAUTHORIZED);
    }

    // Todo: Sessions, /logout, like breddit
    // also on devices, create filter to get userRole and see if it's allowed for the given path
}
