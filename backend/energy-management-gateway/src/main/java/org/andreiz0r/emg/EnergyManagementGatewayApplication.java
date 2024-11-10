package org.andreiz0r.emg;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.ConfigurationPropertiesScan;

@SpringBootApplication
@ConfigurationPropertiesScan
public class EnergyManagementGatewayApplication {

    public static void main(String[] args) {
        SpringApplication.run(EnergyManagementGatewayApplication.class, args);
    }
}
