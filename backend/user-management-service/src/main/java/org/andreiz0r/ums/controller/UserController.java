package org.andreiz0r.ums.controller;

import lombok.RequiredArgsConstructor;
import org.andreiz0r.core.dto.UserDTO;
import org.andreiz0r.core.exception.ClientError;
import org.andreiz0r.core.request.CreateUserRequest;
import org.andreiz0r.core.request.UpdateUserRequest;
import org.andreiz0r.core.response.Response;
import org.andreiz0r.ums.service.UserService;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.UUID;

import static org.andreiz0r.core.util.Constants.ReturnMessages.failedToSave;
import static org.andreiz0r.core.util.Constants.ReturnMessages.notFound;
import static org.andreiz0r.ums.util.Constants.Paths.USERS_CONTROLLER_ENDPOINT;
import static org.springframework.http.HttpStatus.BAD_REQUEST;
import static org.springframework.http.HttpStatus.NOT_FOUND;

@RestController
@RequestMapping(USERS_CONTROLLER_ENDPOINT)
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @GetMapping
    public Response<List<UserDTO>> getAllUsers() {
        return userService.getUsers()
                .map(Response::successResponse)
                .orElse(Response.failureResponse(
                        new ClientError(notFound(UserDTO.class)),
                        NOT_FOUND));
    }

    @GetMapping("/{id}")
    public Response<UserDTO> getUserById(@PathVariable final UUID id) {
        return userService.findById(id)
                .map(Response::successResponse)
                .orElse(Response.failureResponse(
                        new ClientError(notFound(UserDTO.class, "id", id)),
                        NOT_FOUND));
    }

    @GetMapping("/user")
    public Response<UserDTO> getUserByUsername(@RequestParam final String username) {
        return userService.findByUsername(username)
                .map(Response::successResponse)
                .orElse(Response.failureResponse(
                        new ClientError(notFound(UserDTO.class, "username", username)),
                        NOT_FOUND));
    }

    @PostMapping
    public Response<UserDTO> createUser(@RequestBody final CreateUserRequest request) {
        return userService.create(request)
                .map(Response::successResponse)
                .orElse(Response.failureResponse(
                        new ClientError(failedToSave(UserDTO.class)),
                        BAD_REQUEST));
    }

    @PatchMapping
    public Response<UserDTO> updateUser(@RequestBody final UpdateUserRequest request) {
        return userService.update(request)
                .map(Response::successResponse)
                .orElse(Response.failureResponse(
                        new ClientError(notFound(UserDTO.class, "id", request.id())),
                        NOT_FOUND));
    }

    @DeleteMapping("/{id}")
    public Response<UserDTO> deleteUserById(@PathVariable final UUID id) {
        return userService.deleteById(id)
                .map(Response::successResponse)
                .orElse(Response.failureResponse(
                        new ClientError(notFound(UserDTO.class, "id", id)),
                        NOT_FOUND));
    }

    // Remove device from list
}
