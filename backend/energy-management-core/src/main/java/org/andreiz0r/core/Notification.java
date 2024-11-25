package org.andreiz0r.core;


import org.andreiz0r.core.enums.NotificationType;

import java.io.Serializable;

public record Notification(String message, NotificationType type) implements Serializable {
}
