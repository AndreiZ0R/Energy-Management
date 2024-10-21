package org.andreiz0r.dms.controller;

import lombok.RequiredArgsConstructor;
import org.andreiz0r.dms.clients.UmsClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/dms/test")
@RequiredArgsConstructor
public class TestController {

    private final UmsClient umsClient;

    @GetMapping
    public String test() {
        String response = umsClient.test();
        return "DMS + " + response;
    }
}
