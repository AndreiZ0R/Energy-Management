package org.andreiz0r.core.event;


import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.ToString;
import org.andreiz0r.core.enums.TracedService;
import org.andreiz0r.core.util.Constants.Time;

import java.io.Serializable;
import java.sql.Timestamp;

@Getter
@NoArgsConstructor(force = true)
@EqualsAndHashCode
@ToString
public abstract class AbstractEvent<T> implements Serializable {
    private final T eventData;
    private final TracedService emitterService;
    private final Timestamp timestamp = Time.timestampNow();

    public AbstractEvent(final T eventData, final TracedService emitterService) {
        this.eventData = eventData;
        this.emitterService = emitterService;
    }
}
// Todo: Apect for logging, security, dockerize, also redis for rate limiting on gateway + circuitbreaker
