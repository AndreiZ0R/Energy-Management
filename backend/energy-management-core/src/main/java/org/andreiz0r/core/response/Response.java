package org.andreiz0r.core.response;

import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.ToString;
import org.andreiz0r.core.exception.ClientError;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.io.Serializable;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import static org.andreiz0r.core.util.Constants.FAILURE;
import static org.andreiz0r.core.util.Constants.SUCCESS;

@Getter
@EqualsAndHashCode(callSuper = false)
@ToString
public class Response<T> extends ResponseEntity<Object> implements Serializable {

    private final Map<String, Object> body;
    private final String message;
    private final HttpStatus status;

    private Response(final Builder<T> builder) {
        super(builder.body, builder.status);

        this.body = builder.body;
        this.status = builder.status;
        this.message = builder.message;
    }

    public static <T> Response<T> successResponse(final T payload) {
        return baseResponse(payload, SUCCESS, HttpStatus.OK, null);
    }

    public static <T> Response<T> successResponse(final T payload, final HttpStatus status) {
        return baseResponse(payload, SUCCESS, status, null);
    }

    public static <T> Response<T> failureResponse(final ClientError error) {
        return failureResponse(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }

    public static <T> Response<T> failureResponse(final ClientError error, final HttpStatus status) {
        return baseResponse(null, FAILURE, status, List.of(error));
    }

    public static <T> Response<T> baseResponse(final T payload, final String message, final HttpStatus status, final List<ClientError> errors) {
        return new Response.Builder<T>()
                .withStatus(status)
                .withPayload(payload)
                .withMessage(message)
                .withErrors(errors)
                .build();
    }

    private static final class Builder<T> {
        private final Map<String, Object> body = new HashMap<>();
        private String message;
        private HttpStatus status;

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

        public Response<T> build() {
            return new Response<>(this);
        }
    }
}
