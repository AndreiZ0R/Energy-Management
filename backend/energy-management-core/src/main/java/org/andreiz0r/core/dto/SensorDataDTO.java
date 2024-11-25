package org.andreiz0r.core.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;

import java.io.Serializable;
import java.util.UUID;

@JsonIgnoreProperties(ignoreUnknown = true)
public record SensorDataDTO(
        String timestamp,
        @JsonProperty("device_id") UUID deviceId,
        @JsonProperty("measurement_value") Double measurementValue
) implements Serializable {
}
