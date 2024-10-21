package org.andreiz0r.dms;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.openfeign.EnableFeignClients;

@SpringBootApplication
@EnableFeignClients
public class DeviceManagementServiceApplication {

    public static void main(String[] args) {
        SpringApplication.run(DeviceManagementServiceApplication.class, args);
    }

}
