package org.andreiz0r.core.request;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;

import java.util.List;

@JsonInclude(JsonInclude.Include.NON_NULL)
public record GetDevicesByIdRequest(@JsonProperty List<String> ids) {
}
