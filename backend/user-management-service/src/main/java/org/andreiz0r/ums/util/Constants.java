package org.andreiz0r.ums.util;

import static org.andreiz0r.core.util.Constants.Endpoints.CONTROLLER_BASE_ENDPOINT;

public interface Constants {

    interface Paths {
        String USERS_CONTROLLER_ENDPOINT = CONTROLLER_BASE_ENDPOINT + "/users";
        String AUTH_CONTROLLER_ENDPOINT = CONTROLLER_BASE_ENDPOINT + "/auth";

        String[] WHITELISTED_URLS = {
                AUTH_CONTROLLER_ENDPOINT + "/**",
                "/v3/api-docs/**",
                "/v3/api-docs.yaml",
                "/swagger-ui/**",
                "/swagger-ui.html",
                "/bus/v3/api-docs/**"
        };
    }
}
