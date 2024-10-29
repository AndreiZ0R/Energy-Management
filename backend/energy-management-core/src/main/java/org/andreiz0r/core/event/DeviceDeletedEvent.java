package org.andreiz0r.core.event;

import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.ToString;
import org.andreiz0r.core.dto.DeviceDeletedDTO;
import org.andreiz0r.core.enums.TracedService;

@Getter
@NoArgsConstructor
@EqualsAndHashCode(callSuper = true)
@ToString(callSuper = true)
public class DeviceDeletedEvent extends AbstractEvent<DeviceDeletedDTO> {
    public DeviceDeletedEvent(final DeviceDeletedDTO eventData, final TracedService emitterService) {
        super(eventData, emitterService);
    }
}
