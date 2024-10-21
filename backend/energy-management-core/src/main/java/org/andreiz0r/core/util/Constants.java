package org.andreiz0r.core.util;

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

}
