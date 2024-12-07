package org.andreiz0r.core.messaging;

public enum Topic {
    CHAT("chat"),
    CHAT_NOTIFICATION("chatNotification"),
    NOTIFICATIONS("notifications");

    private final String name;

    Topic(final String s) {
        name = s;
    }

    @Override
    public String toString() {
        return "/topic/" + this.name + "/";
    }
}
