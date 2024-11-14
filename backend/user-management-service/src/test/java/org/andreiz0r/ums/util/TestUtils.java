package org.andreiz0r.ums.util;

import org.andreiz0r.core.dto.UserDTO;
import org.andreiz0r.core.enums.UserRole;
import org.andreiz0r.core.exception.ClientError;
import org.andreiz0r.core.mapper.Mapper;
import org.andreiz0r.core.request.AuthenticationRequest;
import org.andreiz0r.core.request.CreateUserRequest;
import org.andreiz0r.core.request.UpdateUserRequest;
import org.andreiz0r.core.response.AuthenticationResponse;
import org.andreiz0r.core.response.Response;
import org.andreiz0r.ums.entity.User;
import org.junit.jupiter.api.Assertions;
import org.springframework.http.HttpStatus;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.andreiz0r.core.util.Constants.FAILURE;
import static org.andreiz0r.core.util.Constants.SUCCESS;
import static org.andreiz0r.core.util.Constants.Time.timestampNow;
import static org.andreiz0r.core.util.Randoms.alphabetic;
import static org.andreiz0r.core.util.Randoms.randomBoolean;
import static org.hamcrest.MatcherAssert.assertThat;
import static org.hamcrest.Matchers.equalTo;

public interface TestUtils {

    interface UserUtils {
        static UserDTO convertToDTO(final User user) {
            return Mapper.mapTo(user, UserDTO.class);
        }

        static List<UserDTO> convertToDTO(final List<User> users) {
            return users.stream().map(user -> Mapper.mapTo(user, UserDTO.class)).toList();
        }

        static User randomUser() {
            return new User(
                    UUID.randomUUID(),
                    alphabetic(),
                    alphabetic(),
                    alphabetic(),
                    timestampNow(),
                    randomBoolean() ? UserRole.User : UserRole.Manager,
                    List.of(UUID.randomUUID(), UUID.randomUUID())
            );
        }
    }

    interface RequestUtils {
        static CreateUserRequest createUserRequest(final User user) {
            return new CreateUserRequest(
                    user.getUsername(),
                    user.getEmail(),
                    user.getPassword(),
                    user.getRole().toString(),
                    user.getDeviceIds()
            );
        }

        static UpdateUserRequest updateUserRequest(final User user) {
            return new UpdateUserRequest(
                    user.getId(),
                    user.getUsername(),
                    user.getEmail(),
                    user.getPassword(),
                    user.getRole().toString(),
                    user.getDeviceIds().stream().map(UUID::toString).toList()
            );
        }

        static AuthenticationRequest authenticationRequest(final String username, final String password) {
            return new AuthenticationRequest(username, password);
        }
    }

    interface ResponseUtils {
        static <T> void assertThatResponseIsSuccessful(final Response<T> response, final T expectedData) {
            Optional.ofNullable(response.getBody().get("payload")).ifPresentOrElse(
                    payload -> {
                        assertThat(payload, equalTo(expectedData));
                        assertThat(response.getStatus(), equalTo(HttpStatus.OK));
                        assertThat(response.getMessage(), equalTo(SUCCESS));
                    },
                    Assertions::fail
            );
        }

        static void assertThatResponseFailed(
                final Response<?> response,
                final List<ClientError> expectedErrors,
                final HttpStatus expectedStatus) {
            Optional.ofNullable(response.getBody().get("errors")).ifPresentOrElse(
                    errors -> {
                        assertThat(errors, equalTo(expectedErrors));
                        assertThat(response.getStatus(), equalTo(expectedStatus));
                        assertThat(response.getMessage(), equalTo(FAILURE));
                    },
                    Assertions::fail
            );
        }
    }
}
