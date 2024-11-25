package org.andreiz0r.core.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import org.andreiz0r.core.enums.DeviceAction;

import java.io.Serializable;

@JsonIgnoreProperties(ignoreUnknown = true)
public record DeviceUpdateDTO(DeviceDTO device, DeviceAction deviceAction) implements Serializable {
}
