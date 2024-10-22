package org.andreiz0r.core.exception;

import lombok.Getter;
import org.andreiz0r.core.enums.TracedService;
import org.springframework.http.HttpStatus;

@Getter
public class ClientException extends RuntimeException {
    private final HttpStatus status;
    private final TracedService service;

    public ClientException(final String message, final HttpStatus status) {
        super(message);
        this.status = status;
        this.service = TracedService.UNKNOWN;
    }

    public ClientException(final String message, final TracedService service, final HttpStatus status) {
        super(message);
        this.status = status;
        this.service = service;
    }
}
