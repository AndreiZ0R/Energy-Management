package org.andreiz0r.dms.controller;

import lombok.RequiredArgsConstructor;
import org.andreiz0r.core.dto.DeviceDTO;
import org.andreiz0r.core.exception.ClientError;
import org.andreiz0r.core.request.CreateDeviceRequest;
import org.andreiz0r.core.request.GetDevicesByIdRequest;
import org.andreiz0r.core.request.UpdateDeviceRequest;
import org.andreiz0r.core.response.Response;
import org.andreiz0r.dms.service.DeviceService;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.UUID;

import static org.andreiz0r.core.util.Constants.ReturnMessages.failedToSave;
import static org.andreiz0r.core.util.Constants.ReturnMessages.notFound;
import static org.andreiz0r.dms.util.Constants.Paths.DEVICES_CONTROLLER_ENDPOINT;
import static org.springframework.http.HttpStatus.BAD_REQUEST;
import static org.springframework.http.HttpStatus.NOT_FOUND;

@RestController
@RequestMapping(DEVICES_CONTROLLER_ENDPOINT)
@RequiredArgsConstructor
public class DeviceController {

    private final DeviceService deviceService;

    @GetMapping
    public Response<List<DeviceDTO>> getAllDevices() {
        return deviceService.getAllDevices()
                .map(Response::successResponse)
                .orElse(Response.failureResponse(
                        new ClientError(notFound(DeviceDTO.class)),
                        NOT_FOUND));
    }

    @GetMapping("/ids")
    public Response<List<DeviceDTO>> getAllDevicesById(@RequestBody final GetDevicesByIdRequest request) {
        return deviceService.findMultipleById(request.ids())
                .map(Response::successResponse)
                .orElse(Response.failureResponse(
                        new ClientError(notFound(DeviceDTO.class)),
                        NOT_FOUND));
    }

    @GetMapping("/{id}")
    public Response<DeviceDTO> getDeviceById(@PathVariable final UUID id) {
        return deviceService.findById(id)
                .map(Response::successResponse)
                .orElse(Response.failureResponse(
                        new ClientError(notFound(DeviceDTO.class, "id", id)),
                        NOT_FOUND));
    }

    @PostMapping
    public Response<DeviceDTO> createDevice(@RequestBody final CreateDeviceRequest request) {
        return deviceService.create(request)
                .map(Response::successResponse)
                .orElse(Response.failureResponse(
                        new ClientError(failedToSave(DeviceDTO.class)),
                        BAD_REQUEST));
    }

    @PatchMapping
    public Response<DeviceDTO> updateDevice(@RequestBody final UpdateDeviceRequest request) {
        return deviceService.update(request)
                .map(Response::successResponse)
                .orElse(Response.failureResponse(
                        new ClientError(notFound(DeviceDTO.class, "id", request.id())),
                        NOT_FOUND));
    }

    @DeleteMapping("/{id}")
    public Response<DeviceDTO> deleteDeviceById(@PathVariable final UUID id) {
        return deviceService.deleteById(id)
                .map(Response::successResponse)
                .orElse(Response.failureResponse(
                        new ClientError(notFound(DeviceDTO.class, "id", id)),
                        NOT_FOUND));
    }
}
