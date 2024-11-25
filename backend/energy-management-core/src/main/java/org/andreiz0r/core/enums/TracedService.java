package org.andreiz0r.core.enums;

public enum TracedService {
    UNKNOWN(null),
    UMS("user-management-service"),
    DMS("device-management-service"),
    MCS("monitoring-communication-service");

    TracedService(final String code) {
    }
}
