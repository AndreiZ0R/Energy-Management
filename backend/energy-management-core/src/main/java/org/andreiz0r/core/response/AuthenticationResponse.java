package org.andreiz0r.core.response;

import org.andreiz0r.core.dto.UserDTO;

import java.io.Serializable;

public record AuthenticationResponse(UserDTO user, String token) implements Serializable {
}
