package org.andreiz0r.ums.clients;

import org.springframework.cloud.openfeign.FeignClient;

@FeignClient(value = "ENERGY-MANAGEMENT-GATEWAY", path = "/api/rest/auth")
public interface DmsClient {

//
//    @PatchMapping(DEVICES_PATH)
//    Response<DeviceDTO> updateDevice(@RequestBody final UpdateDeviceRequest request);


    /*
    @GetMapping
    public Response getSomething(@RequestBody final Something something);

    For nested paths, place it in the mapping!( e.g @GetMapping("/api/users"), even if the endpoint is only "/users")

    /*

    load balance -> by default cu @FeignClient

     */

}
