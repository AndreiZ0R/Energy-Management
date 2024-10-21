package org.andreiz0r.core.exception;

import lombok.Getter;
import org.andreiz0r.core.enums.Services;
import org.springframework.http.HttpStatus;

@Getter
public class ClientException extends RuntimeException {
    private final HttpStatus status;
    private final Services service;

    public ClientException(final String message, final HttpStatus status) {
        super(message);
        this.status = status;
        this.service = Services.UNKNOWN;
    }

    public ClientException(final String message, final Services service, final HttpStatus status) {
        super(message);
        this.status = status;
        this.service = service;
    }
}
