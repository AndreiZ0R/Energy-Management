package org.andreiz0r.core.request;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;

import java.util.UUID;

@JsonInclude(JsonInclude.Include.NON_NULL)
public record CreateMonitoredDeviceRequest(
        @JsonProperty UUID deviceId,
        @JsonProperty UUID userId,
        @JsonProperty String description,
        @JsonProperty String address,
        @JsonProperty Long maximumHourlyConsumption) {
}
