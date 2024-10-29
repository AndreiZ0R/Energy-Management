package org.andreiz0r.core.dto;

import java.io.Serializable;
import java.util.UUID;

public record DeviceDeletedDTO(UUID userId, UUID deviceId) implements Serializable {
}
