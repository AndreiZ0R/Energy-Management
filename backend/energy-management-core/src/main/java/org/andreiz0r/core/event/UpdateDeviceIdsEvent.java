package org.andreiz0r.core.event;

import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.ToString;
import org.andreiz0r.core.dto.UpdateDeviceIdsDTO;
import org.andreiz0r.core.enums.TracedService;

@Getter
@NoArgsConstructor
@EqualsAndHashCode(callSuper = true)
@ToString(callSuper = true)
public class UpdateDeviceIdsEvent extends AbstractEvent<UpdateDeviceIdsDTO> {
    public UpdateDeviceIdsEvent(final UpdateDeviceIdsDTO eventData, final TracedService emitterService) {
        super(eventData, emitterService);
    }
}
