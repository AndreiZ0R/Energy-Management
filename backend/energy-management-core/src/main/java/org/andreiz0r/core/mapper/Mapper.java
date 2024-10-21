package org.andreiz0r.core.mapper;

import com.fasterxml.jackson.databind.JsonMappingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.andreiz0r.core.exception.ClientException;
import org.springframework.http.HttpStatus;


public class Mapper {
    private final static ObjectMapper objectMapper = new ObjectMapper();

    public static <T, U> void updateValues(final T value, final U newValue) {
        try {
            objectMapper.updateValue(value, newValue);
        } catch (JsonMappingException e) {
            throw new ClientException(e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    public static <T> T mapTo(final Object object, Class<T> clazz) {
        try {
            return objectMapper.convertValue(object, clazz);
        } catch (IllegalArgumentException e) {
            throw new ClientException(e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

}
