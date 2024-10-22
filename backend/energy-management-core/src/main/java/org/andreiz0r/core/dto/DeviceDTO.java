package org.andreiz0r.core.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import java.io.Serializable;
import java.util.UUID;

@JsonIgnoreProperties(ignoreUnknown = true)
public record DeviceDTO(UUID id, String description, String address, Long maximumHourlyConsumption, UUID userId) implements Serializable {
}
