package org.andreiz0r.core.exception;


import java.io.Serializable;

public record ClientError(String message) implements Serializable {

    public final static ClientError INTERNAL_SERVER_ERROR = new ClientError("Internal Server Error");

}
