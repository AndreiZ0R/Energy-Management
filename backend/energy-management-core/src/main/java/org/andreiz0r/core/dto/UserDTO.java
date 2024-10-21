package org.andreiz0r.core.dto;


import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import org.andreiz0r.core.enums.UserRole;

import java.io.Serializable;
import java.sql.Timestamp;
import java.util.List;
import java.util.UUID;

@JsonIgnoreProperties(ignoreUnknown = true)
public record UserDTO(UUID id, String username, String email, Timestamp createdAt, UserRole role, List<String> deviceIds) implements Serializable {
}
