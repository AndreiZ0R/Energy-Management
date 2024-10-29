package org.andreiz0r.core.response;

import jakarta.servlet.http.HttpServletResponse;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.ToString;
import org.andreiz0r.core.exception.ClientError;
import org.andreiz0r.core.mapper.Mapper;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.io.IOException;
import java.io.Serializable;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import static org.andreiz0r.core.util.Constants.FAILURE;
import static org.andreiz0r.core.util.Constants.Headers.APPLICATION_JSON;
import static org.andreiz0r.core.util.Constants.SUCCESS;

@Getter
@EqualsAndHashCode(callSuper = false)
@ToString
public class Response<T> extends ResponseEntity<Object> implements Serializable {

    private final Map<String, Object> body;
    private final String message;
    private final HttpStatus status;
    private final HttpHeaders headers;

    private Response(final Builder<T> builder) {
        super(builder.body, builder.headers, builder.status);

        this.body = builder.body;
        this.status = builder.status;
        this.message = builder.message;
        this.headers = builder.headers;
    }

    public static <T> Response<T> successResponse(final T payload) {
        return baseResponse(payload, SUCCESS, HttpStatus.OK, getDefaultHttpHeaders(), null);
    }

    public static <T> Response<T> successResponse(final T payload, final String headerKey, final String headerValue) {
        HttpHeaders headers = getDefaultHttpHeaders();
        headers.add(headerKey, headerValue);
        return baseResponse(payload, SUCCESS, HttpStatus.OK, headers, null);
    }

    public static <T> Response<T> successResponse(final T payload, final HttpStatus status) {
        return baseResponse(payload, SUCCESS, status, getDefaultHttpHeaders(), null);
    }

    public static <T> Response<T> failureResponse(final ClientError error) {
        return failureResponse(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }

    public static <T> Response<T> failureResponse(final ClientError error, final HttpStatus status) {
        return baseResponse(null, FAILURE, status, getDefaultHttpHeaders(), List.of(error));
    }

    public static <T> Response<T> baseResponse(
            final T payload,
            final String message,
            final HttpStatus status,
            final HttpHeaders headers,
            final List<ClientError> errors) {
        return new Response.Builder<T>()
                .withStatus(status)
                .withPayload(payload)
                .withMessage(message)
                .withHeaders(headers)
                .withErrors(errors)
                .build();
    }

    public static void setServletResponse(final HttpServletResponse response, final String message, final int status) throws IOException {
        response.setContentType(APPLICATION_JSON);
        response.setStatus(status);
        response.getWriter().println(Mapper.writeValueAsString(failureResponse(new ClientError(message), HttpStatus.valueOf(status))));
    }

    private static HttpHeaders getDefaultHttpHeaders() {
        HttpHeaders headers = new HttpHeaders();
        headers.set(HttpHeaders.CONTENT_TYPE, APPLICATION_JSON);
        return headers;
    }

    private static final class Builder<T> {
        private final Map<String, Object> body = new HashMap<>();
        private String message;
        private HttpStatus status;
        private final HttpHeaders headers = new HttpHeaders();

        public Builder<T> withMessage(String message) {
            this.message = message;
            this.body.put("message", message);
            return this;
        }

        public Builder<T> withStatus(final HttpStatus status) {
            this.status = status;
            this.body.put("status", status);
            return this;
        }

        public Builder<T> withErrors(final List<ClientError> errors) {
            this.body.put("errors", errors);
            return this;
        }

        public Builder<T> withPayload(final T payload) {
            this.body.put("payload", payload);
            return this;
        }

        public Builder<T> withHeaders(final HttpHeaders headers) {
            this.headers.putAll(headers);
            return this;
        }

        public Response<T> build() {
            return new Response<>(this);
        }
    }
}
