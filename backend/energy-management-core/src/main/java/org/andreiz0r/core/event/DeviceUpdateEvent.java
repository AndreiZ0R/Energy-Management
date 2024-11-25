package org.andreiz0r.core.event;

import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.ToString;
import org.andreiz0r.core.dto.DeviceUpdateDTO;
import org.andreiz0r.core.enums.TracedService;

@Getter
@NoArgsConstructor
@EqualsAndHashCode(callSuper = true)
@ToString(callSuper = true)
public class DeviceUpdateEvent extends AbstractEvent<DeviceUpdateDTO> {
    public DeviceUpdateEvent(final DeviceUpdateDTO eventData, final TracedService emitterService) {
        super(eventData, emitterService);
    }
}
