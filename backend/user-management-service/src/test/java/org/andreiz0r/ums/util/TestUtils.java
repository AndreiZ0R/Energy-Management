package org.andreiz0r.ums.util;

import org.andreiz0r.core.dto.UserDTO;
import org.andreiz0r.core.enums.UserRole;
import org.andreiz0r.core.mapper.Mapper;
import org.andreiz0r.core.request.CreateUserRequest;
import org.andreiz0r.core.request.UpdateUserRequest;
import org.andreiz0r.ums.entity.User;

import java.util.List;
import java.util.UUID;

import static org.andreiz0r.core.util.Constants.Time.timestampNow;
import static org.andreiz0r.core.util.Randoms.alphabetic;
import static org.andreiz0r.core.util.Randoms.randomBoolean;

public interface TestUtils {

    interface UserTestUtils {
        static UserDTO convertToDTO(final User user) {
            return Mapper.mapTo(user, UserDTO.class);
        }

        static List<UserDTO> convertToDTO(final List<User> users) {
            return users.stream().map(user -> Mapper.mapTo(user, UserDTO.class)).toList();
        }

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
}
