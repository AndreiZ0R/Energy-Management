package org.andreiz0r.core.messaging;

public enum ChatNotificationType {
    START_TYPING("startTyping"),
    STOP_TYPING("stopTyping"),
    ;

    private final String name;

    ChatNotificationType(final String s) {
        name = s;
    }

    @Override
    public String toString() {
        return this.name;
    }
}
