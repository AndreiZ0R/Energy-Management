package org.andreiz0r.core.util;

import java.sql.Timestamp;
import java.time.Instant;
import java.util.Date;

public interface Constants {

    String SUCCESS = "Success";
    String FAILURE = "Failure";

    interface ReturnMessages {
        static String notFound(Class<?> clazz, final String propertyName, final Object value) {
            return "Could not find " + clazz.getSimpleName() + " with " + propertyName + ": " + value;
        }

        static String notFound(Class<?> clazz) {
            return "Could not find " + clazz.getSimpleName();
        }

        static String failedToSave(final Class<?> clazz) {
            return "Could not save " + clazz.getSimpleName();
        }
    }

    interface Endpoints {
        String CONTROLLER_BASE_ENDPOINT = "/api/rest";
    }

    interface Time {
        static Date now() {
            return new Date();
        }

        static Date nowWithDelay(final int delay) {
            return new Date(System.currentTimeMillis() + delay);
        }

        static Timestamp timestampNow() {
            return Timestamp.from(Instant.now());
        }

        static java.sql.Date sqlDateNow() {
            return new java.sql.Date(System.currentTimeMillis());
        }
    }

}
