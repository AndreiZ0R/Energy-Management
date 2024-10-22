package org.andreiz0r.core.dto;

import java.io.Serializable;
import java.util.List;
import java.util.UUID;

public record UpdateDeviceIdsDTO(UUID userId, List<UUID> deviceIds) implements Serializable {
}
