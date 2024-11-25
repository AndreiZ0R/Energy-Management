package org.andreiz0r.core.request;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;

import java.util.UUID;

@JsonInclude(JsonInclude.Include.NON_NULL)
public record UpdateMonitoredDeviceRequest(
        @JsonProperty UUID deviceId,
        @JsonProperty UUID userId,
        @JsonProperty Long maximumHourlyConsumption,
        @JsonProperty Double hourlyConsumption,
        @JsonProperty Boolean monitored) {
}