package org.andreiz0r.mcs.repository;

import jakarta.transaction.Transactional;
import org.andreiz0r.mcs.entity.MonitoredDevice;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface MonitoredDeviceRepository extends JpaRepository<MonitoredDevice, UUID> {

    @Query(value = "WITH randomDevice AS (SELECT * FROM monitored_device ORDER BY RANDOM() LIMIT 1) " +
                   "UPDATE monitored_device md SET monitored=true FROM randomDevice WHERE randomDevice.device_id = md.device_id " +
                   "RETURNING md.device_id",
            nativeQuery = true)
    Optional<UUID> findRandomUnmonitoredDevice();

    @Transactional
    @Modifying
    @Query(value = "update MonitoredDevice md set md.monitored=:deviceMonitored where md.deviceId=:deviceId")
    Integer setDeviceMonitored(final UUID deviceId, final Boolean deviceMonitored);

    @Transactional
    @Modifying
    @Query(value = "delete from MonitoredDevice md where md.deviceId=:deviceId")
    Integer deleteByIdReturning(final UUID deviceId);
}
