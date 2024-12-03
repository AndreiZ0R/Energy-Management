package org.andreiz0r.mcs.entity;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;
import org.hibernate.annotations.ColumnDefault;

import java.util.List;
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
    private String description;

    @Column(nullable = false)
    private String address;

    @Column(nullable = false)
    private Long maximumHourlyConsumption;

    @Column(nullable = false)
    @ColumnDefault("false")
    private Boolean monitored;

    @OneToMany(targetEntity = HourlyConsumption.class, mappedBy = "deviceId", orphanRemoval = true, cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<HourlyConsumption> hourlyConsumptions;
}
