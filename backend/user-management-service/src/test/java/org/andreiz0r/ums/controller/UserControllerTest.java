package org.andreiz0r.ums.controller;

import org.andreiz0r.core.dto.UserDTO;
import org.andreiz0r.core.exception.ClientError;
import org.andreiz0r.core.request.CreateUserRequest;
import org.andreiz0r.core.request.UpdateUserRequest;
import org.andreiz0r.core.response.Response;
import org.andreiz0r.ums.entity.User;
import org.andreiz0r.ums.service.UserService;
import org.andreiz0r.ums.util.BaseUnitTest;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.springframework.http.HttpStatus;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.andreiz0r.core.util.Constants.ReturnMessages.failedToSave;
import static org.andreiz0r.core.util.Constants.ReturnMessages.notFound;
import static org.andreiz0r.core.util.Randoms.alphabetic;
import static org.andreiz0r.ums.util.TestUtils.RequestUtils.createUserRequest;
import static org.andreiz0r.ums.util.TestUtils.RequestUtils.updateUserRequest;
import static org.andreiz0r.ums.util.TestUtils.ResponseUtils.assertThatResponseFailed;
import static org.andreiz0r.ums.util.TestUtils.ResponseUtils.assertThatResponseIsSuccessful;
import static org.andreiz0r.ums.util.TestUtils.UserUtils.convertToDTO;
import static org.andreiz0r.ums.util.TestUtils.UserUtils.randomUser;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.mockito.MockitoAnnotations.openMocks;

class UserControllerTest extends BaseUnitTest {

    @Mock
    private UserService service;

    @InjectMocks
    private UserController victim;

    @BeforeEach
    void setUp() {
        openMocks(this);
    }

    @Test
    void getAllUsers_usersFound_returnsSuccess() {
        List<User> expectedUsers = List.of(randomUser(), randomUser());
        when(service.getUsers()).thenReturn(Optional.of(convertToDTO(expectedUsers)));

        Response<List<UserDTO>> response = victim.getAllUsers();

        verify(service).getUsers();
        assertThatResponseIsSuccessful(response, convertToDTO(expectedUsers));
    }

    @Test
    void getAllUsers_noUsersFound_returnsFailure() {
        when(service.getUsers()).thenReturn(Optional.empty());

        Response<List<UserDTO>> response = victim.getAllUsers();

        verify(service).getUsers();
        assertThatResponseFailed(response, List.of(new ClientError(notFound(UserDTO.class))), HttpStatus.NOT_FOUND);
    }

    @Test
    void getUserById_userFound_returnsSuccess() {
        User expectedUser = randomUser();
        when(service.findById(expectedUser.getId())).thenReturn(Optional.of(convertToDTO(expectedUser)));

        Response<UserDTO> response = victim.getUserById(expectedUser.getId());

        verify(service).findById(expectedUser.getId());
        assertThatResponseIsSuccessful(response, convertToDTO(expectedUser));
    }

    @Test
    void getUserById_userNotFound_returnsFailure() {
        UUID id = UUID.randomUUID();
        when(service.findById(id)).thenReturn(Optional.empty());

        Response<UserDTO> response = victim.getUserById(id);

        verify(service).findById(any());
        assertThatResponseFailed(response, List.of(new ClientError(notFound(UserDTO.class, "id", id))), HttpStatus.NOT_FOUND);
    }

    @Test
    void getUserByUsername_userFound_returnsSuccess() {
        User expectedUser = randomUser();
        when(service.findByUsername(expectedUser.getUsername())).thenReturn(Optional.of(convertToDTO(expectedUser)));

        Response<UserDTO> response = victim.getUserByUsername(expectedUser.getUsername());

        verify(service).findByUsername(expectedUser.getUsername());
        assertThatResponseIsSuccessful(response, convertToDTO(expectedUser));
    }

    @Test
    void getUserByUsername_userNotFound_returnsFailure() {
        String username = alphabetic();
        when(service.findByUsername(username)).thenReturn(Optional.empty());

        Response<UserDTO> response = victim.getUserByUsername(username);

        verify(service).findByUsername(username);
        assertThatResponseFailed(response, List.of(new ClientError(notFound(UserDTO.class, "username", username))), HttpStatus.NOT_FOUND);
    }

    @Test
    void createUser_userIsCreated_returnsSuccess() {
        User createdUser = randomUser();
        CreateUserRequest request = createUserRequest(createdUser);
        when(service.create(request)).thenReturn(Optional.of(convertToDTO(createdUser)));

        Response<UserDTO> response = victim.createUser(request);

        verify(service).create(request);
        assertThatResponseIsSuccessful(response, convertToDTO(createdUser));
    }

    @Test
    void createUser_userIsNotCreated_returnsFailure() {
        when(service.create(any())).thenReturn(Optional.empty());

        Response<UserDTO> response = victim.createUser(createUserRequest(randomUser()));

        verify(service).create(any());
        assertThatResponseFailed(response, List.of(new ClientError(failedToSave(UserDTO.class))), HttpStatus.BAD_REQUEST);
    }

    @Test
    void updateUser_userIsUpdated_returnsSuccess() {
        User updatedUser = randomUser();
        UpdateUserRequest request = updateUserRequest(updatedUser);
        when(service.update(request)).thenReturn(Optional.of(convertToDTO(updatedUser)));

        Response<UserDTO> response = victim.updateUser(request);

        verify(service).update(request);
        assertThatResponseIsSuccessful(response, convertToDTO(updatedUser));
    }

    @Test
    void updateUser_userNotFound_returnsFailure() {
        UpdateUserRequest request = updateUserRequest(randomUser());
        when(service.update(request)).thenReturn(Optional.empty());

        Response<UserDTO> response = victim.updateUser(request);

        verify(service).update(request);
        assertThatResponseFailed(response, List.of(new ClientError(notFound(UserDTO.class, "id", request.id()))), HttpStatus.NOT_FOUND);
    }

    @Test
    void deleteUserById_userIsDeleted_returnsSuccess() {
        User deletedUser = randomUser();
        when(service.deleteById(deletedUser.getId())).thenReturn(Optional.of(convertToDTO(deletedUser)));

        Response<UserDTO> response = victim.deleteUserById(deletedUser.getId());

        verify(service).deleteById(deletedUser.getId());
        assertThatResponseIsSuccessful(response, convertToDTO(deletedUser));
    }

    @Test
    void deleteUserById_userNotDeleted_returnsFailure() {
        UUID id = UUID.randomUUID();
        when(service.deleteById(id)).thenReturn(Optional.empty());

        Response<UserDTO> response = victim.deleteUserById(id);

        verify(service).deleteById(id);
        assertThatResponseFailed(response, List.of(new ClientError(notFound(UserDTO.class, "id", id))), HttpStatus.NOT_FOUND);
    }
}