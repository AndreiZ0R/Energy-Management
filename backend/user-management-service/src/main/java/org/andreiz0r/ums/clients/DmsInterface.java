package org.andreiz0r.ums.clients;

import org.springframework.cloud.openfeign.FeignClient;

@FeignClient("DEVICE-MANAGEMENT-SERVICE")
public interface DmsInterface {

    /*
    @GetMapping
    public Response getSomething(@RequestBody final Something something);

    For nested paths, place it in the mapping!( e.g @GetMapping("/api/users"), even if the endpoint is only "/users")


    ^ only declare the method def;

    Calling:
        quizInterface.getSomething();
                                    .getBody(); -> ResponseEntity

    @ElementCollection -> List<?> in db pt entity
    */


    /*

    load balance -> by default cu @FeignClient

     */

}
