package org.andreiz0r.mcs.controller;

import lombok.RequiredArgsConstructor;
import org.andreiz0r.core.exception.ClientError;
import org.andreiz0r.core.response.Response;
import org.andreiz0r.mcs.entity.MonitoredDevice;
import org.andreiz0r.mcs.service.MonitoredDeviceService;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.UUID;

import static org.andreiz0r.core.util.Constants.ReturnMessages.notFound;
import static org.andreiz0r.mcs.util.Constants.Paths.MONITORED_DEVICES_CONTROLLER_ENDPOINT;

@RestController
@RequestMapping(MONITORED_DEVICES_CONTROLLER_ENDPOINT)
@RequiredArgsConstructor
public class MonitoredDeviceController {

    private final MonitoredDeviceService monitoredDeviceService;

    @GetMapping
    public Response<List<MonitoredDevice>> getAllMonitoredDevices() {
        return monitoredDeviceService.getMonitoredDevices()
                .map(Response::successResponse)
                .orElse(Response.failureResponse(
                        new ClientError(notFound(MonitoredDevice.class)),
                        HttpStatus.NOT_FOUND
                ));
    }

    @GetMapping("/random-id")
    public Response<UUID> randomUnmonitoredDeviceId() {
        return monitoredDeviceService.getRandomUnmonitoredDeviceIdForSimulator()
                .map(Response::successResponse)
                .orElse(Response.failureResponse(
                        new ClientError(notFound(MonitoredDevice.class)),
                        HttpStatus.NOT_FOUND
                ));
    }

    @PostMapping("/stop-simulator")
    public Response<Boolean> stopSimulator(@RequestParam final UUID deviceId) {
        return monitoredDeviceService.setMonitoredDevice(deviceId, false) ?
               Response.successResponse(true) :
               Response.failureResponse(ClientError.INTERNAL_SERVER_ERROR, HttpStatus.INTERNAL_SERVER_ERROR);
    }
}
