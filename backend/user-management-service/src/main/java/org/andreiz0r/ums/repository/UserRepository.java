package org.andreiz0r.ums.repository;


import jakarta.transaction.Transactional;
import org.andreiz0r.ums.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface UserRepository extends JpaRepository<User, UUID> {
    @Transactional
    @Modifying
    @Query(value = "delete from User u where u.id=:id")
    Integer deleteByIdReturning(final UUID id);

    @Query(value = "select u from User u where u.username=:username")
    Optional<User> findByUsername(final String username);
}
