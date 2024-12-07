package org.andreiz0r.core.messaging;

import java.io.Serializable;
import java.util.UUID;

public record ChatNotification(UUID senderId, UUID receiverId, ChatNotificationType type) implements Serializable {
}
