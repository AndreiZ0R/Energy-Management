package org.andreiz0r.ums.exception;

import lombok.extern.slf4j.Slf4j;
import org.andreiz0r.core.exception.BaseExceptionHandler;
import org.andreiz0r.core.exception.ClientException;
import org.andreiz0r.core.response.Response;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.Arrays;

@RestControllerAdvice
@Slf4j
public class GlobalExceptionHandler extends BaseExceptionHandler {

    @ExceptionHandler({ClientException.class})
    public Response<?> handleClientException(final ClientException exception) {
        log.error(Arrays.toString(exception.getStackTrace()));
        return super.handleClientException(exception);
    }

    @ExceptionHandler({Exception.class, RuntimeException.class})
    public Response<?> handle(final Exception exception) {
        log.error(Arrays.toString(exception.getStackTrace()));
        return super.handle(exception);
    }
}
