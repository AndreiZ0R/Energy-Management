package org.andreiz0r.core.messaging;

import java.io.Serializable;
import java.util.UUID;

public record MessageAcknowledgement(UUID messageId, UUID acknowledgedBy, UUID target) implements Serializable {
}
