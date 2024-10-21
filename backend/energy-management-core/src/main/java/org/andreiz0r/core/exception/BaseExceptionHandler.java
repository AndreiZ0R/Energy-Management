package org.andreiz0r.core.exception;

import org.andreiz0r.core.response.Response;
import org.springframework.http.HttpStatus;


public class BaseExceptionHandler {

    public Response<?> handleClientException(final ClientException exception) {
        return Response.failureResponse(new ClientError(exception.getMessage()), exception.getStatus());
    }

    public Response<?> handle(final Exception exception) {
        return Response.failureResponse(new ClientError(exception.getMessage()), HttpStatus.BAD_REQUEST);
    }
}
