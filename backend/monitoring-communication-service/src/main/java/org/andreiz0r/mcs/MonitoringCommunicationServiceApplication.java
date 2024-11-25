package org.andreiz0r.mcs;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.openfeign.EnableFeignClients;

@SpringBootApplication
@EnableFeignClients
public class MonitoringCommunicationServiceApplication {

    public static void main(String[] args) {
        SpringApplication.run(MonitoringCommunicationServiceApplication.class, args);
    }

}
