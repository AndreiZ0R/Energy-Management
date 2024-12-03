package org.andreiz0r.core;


import org.andreiz0r.core.enums.NotificationType;

import java.io.Serializable;
import java.util.UUID;

public record Notification(String message, NotificationType type, UUID userId) implements Serializable {
}
