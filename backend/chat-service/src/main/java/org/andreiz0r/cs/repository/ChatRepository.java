package org.andreiz0r.cs.repository;

import jakarta.transaction.Transactional;
import org.andreiz0r.cs.entity.ChatMessage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface ChatRepository extends JpaRepository<ChatMessage, UUID> {

    @Transactional
    @Modifying
    @Query(value = "delete from ChatMessage cm where cm.id=:messageId")
    Integer deleteByIdReturning(final UUID messageId);

    @Query(value = "select cm from ChatMessage cm where (cm.senderId=:senderId and cm.receiverId=:receiverId) or (cm.senderId=:receiverId and cm.receiverId=:senderId)")
    Optional<List<ChatMessage>> findConversation(final UUID senderId, final UUID receiverId);
}
