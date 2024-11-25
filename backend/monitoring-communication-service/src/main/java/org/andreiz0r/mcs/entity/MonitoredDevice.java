package org.andreiz0r.mcs.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;
import org.hibernate.annotations.ColumnDefault;

import java.util.UUID;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
@ToString
public class MonitoredDevice {

    @Id
    private UUID deviceId;

    @Column
    private UUID userId;

    @Column(nullable = false)
    private Long maximumHourlyConsumption;

    @Column(nullable = false)
    @ColumnDefault("0")
    private Double hourlyConsumption;

    @Column(nullable = false)
    @ColumnDefault("false")
    private Boolean monitored;
}
