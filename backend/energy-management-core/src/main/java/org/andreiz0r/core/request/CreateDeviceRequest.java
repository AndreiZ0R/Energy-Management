package org.andreiz0r.core.request;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;

@JsonInclude(JsonInclude.Include.NON_NULL)
public record CreateDeviceRequest(
        @JsonProperty String description,
        @JsonProperty String address,
        @JsonProperty Long maximumHourlyConsumption) {
}
