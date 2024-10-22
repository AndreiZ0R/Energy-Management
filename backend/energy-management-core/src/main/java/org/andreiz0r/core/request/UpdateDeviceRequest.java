package org.andreiz0r.core.request;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Builder;

import java.util.UUID;

@JsonInclude(JsonInclude.Include.NON_NULL)
@Builder
public record UpdateDeviceRequest(
        @JsonProperty UUID id,
        @JsonProperty String description,
        @JsonProperty String address,
        @JsonProperty Long maximumHourlyConsumption,
        @JsonProperty UUID userId) {
}
