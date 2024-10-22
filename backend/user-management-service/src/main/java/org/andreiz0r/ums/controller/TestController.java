package org.andreiz0r.ums.controller;

import lombok.RequiredArgsConstructor;
import org.andreiz0r.core.dto.UpdateDeviceIdsDTO;
import org.andreiz0r.core.enums.TracedService;
import org.andreiz0r.core.event.UpdateDeviceIdsEvent;
import org.andreiz0r.ums.producer.RabbitProducer;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.UUID;

import static org.andreiz0r.ums.util.Constants.Paths.USERS_CONTROLLER_ENDPOINT;

@RestController
@RequiredArgsConstructor
@RequestMapping("/ums/test")
public class TestController {

    private final RabbitProducer rabbitProducer;

    @GetMapping("/event")
    public String event() {
        var eventData = new UpdateDeviceIdsDTO(UUID.randomUUID(), List.of(UUID.randomUUID(), UUID.randomUUID()));
        var event = new UpdateDeviceIdsEvent(eventData, TracedService.UMS);
        rabbitProducer.produce(event);

        return "Sent";
    }
}
