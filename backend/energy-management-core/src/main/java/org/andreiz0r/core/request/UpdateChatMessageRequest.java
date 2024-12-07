package org.andreiz0r.core.request;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;

import java.util.UUID;

@JsonInclude(JsonInclude.Include.NON_NULL)
public record UpdateChatMessageRequest(
        @JsonProperty UUID id,
        @JsonProperty UUID senderId,
        @JsonProperty UUID receiverId,
        @JsonProperty String message) {
}
