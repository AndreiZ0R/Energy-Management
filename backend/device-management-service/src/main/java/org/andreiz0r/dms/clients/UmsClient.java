package org.andreiz0r.dms.clients;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;

@FeignClient(value = "ENERGY-MANAGEMENT-GATEWAY", path = "user-management-service/ums/test")
public interface UmsClient {

    @GetMapping
    String test();
}
