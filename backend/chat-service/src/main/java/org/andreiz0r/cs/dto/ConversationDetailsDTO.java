package org.andreiz0r.cs.dto;

import org.andreiz0r.cs.entity.ChatMessage;
import org.andreiz0r.cs.entity.MessageStatus;

import java.io.Serializable;
import java.util.List;

public record ConversationDetailsDTO(List<ChatMessage> messages, MessageStatus messageStatus) implements Serializable {
}
