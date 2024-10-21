package org.andreiz0r.core.request;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;

import java.util.List;
import java.util.UUID;

@JsonInclude(JsonInclude.Include.NON_NULL)
public record UpdateUserRequest(
        @JsonProperty UUID id,
        @JsonProperty String username,
        @JsonProperty String email,
        @JsonProperty String password,
        @JsonProperty String role,
        @JsonProperty List<String> deviceIds) {
}
