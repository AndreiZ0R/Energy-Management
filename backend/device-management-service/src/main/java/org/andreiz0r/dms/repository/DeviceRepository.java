package org.andreiz0r.dms.repository;

import jakarta.transaction.Transactional;
import org.andreiz0r.dms.entity.Device;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface DeviceRepository extends JpaRepository<Device, UUID> {
    @Transactional
    @Modifying
    @Query(value = "delete from Device d where d.id=:id")
    Integer deleteByIdReturning(final UUID id);

    @Transactional
    @Modifying(flushAutomatically = true, clearAutomatically = true)
    @Query(value = "update Device d set d.userId=:userId where d.id in :ids")
    Integer updateDevicesWithUserId(final List<UUID> ids, final UUID userId);
}
