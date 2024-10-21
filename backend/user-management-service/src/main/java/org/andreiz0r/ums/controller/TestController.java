package org.andreiz0r.ums.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import static org.andreiz0r.ums.util.Constants.Paths.USERS_CONTROLLER_ENDPOINT;

@RestController
@RequestMapping("/ums/test")
public class TestController {

    @GetMapping
    public String test() {
        return "test" + USERS_CONTROLLER_ENDPOINT;
    }
}
