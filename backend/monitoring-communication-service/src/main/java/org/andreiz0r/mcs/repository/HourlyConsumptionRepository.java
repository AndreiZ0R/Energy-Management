package org.andreiz0r.mcs.repository;

import org.andreiz0r.mcs.entity.HourlyConsumption;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface HourlyConsumptionRepository extends JpaRepository<HourlyConsumption, UUID> {
}
