package org.andreiz0r.cs.controller;

import lombok.RequiredArgsConstructor;
import org.andreiz0r.core.exception.ClientError;
import org.andreiz0r.core.request.UpdateChatMessageRequest;
import org.andreiz0r.core.response.Response;
import org.andreiz0r.cs.entity.ChatMessage;
import org.andreiz0r.cs.service.ChatService;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.UUID;

import static org.andreiz0r.core.util.Constants.ReturnMessages.notFound;
import static org.andreiz0r.cs.util.Constants.Paths.CHAT_CONTROLLER_ENDPOINT;
import static org.springframework.http.HttpStatus.NOT_FOUND;

@RestController
@RequestMapping(CHAT_CONTROLLER_ENDPOINT)
@RequiredArgsConstructor
public class ChatRestController {

    private final ChatService chatService;

    @GetMapping
    public Response<List<ChatMessage>> getAllChatMessages() {
        return chatService.getAllChatMessages()
                .map(Response::successResponse)
                .orElse(Response.failureResponse(
                        new ClientError(notFound(ChatMessage.class)),
                        NOT_FOUND));
    }

    @GetMapping("/{id}")
    public Response<ChatMessage> getChatMessageById(@PathVariable final UUID id) {
        return chatService.findById(id)
                .map(Response::successResponse)
                .orElse(Response.failureResponse(
                        new ClientError(notFound(ChatMessage.class, "id", id)),
                        NOT_FOUND));
    }

    @GetMapping("/conversation")
    public Response<List<ChatMessage>> findConversation(@RequestParam final UUID senderId, @RequestParam final UUID receiverId) {
        return chatService.findConversation(senderId, receiverId)
                .map(Response::successResponse)
                .orElse(Response.failureResponse(
                        new ClientError(notFound(ChatMessage.class)),
                        NOT_FOUND));
    }

    @PatchMapping
    public Response<ChatMessage> updateChatMessage(@RequestBody final UpdateChatMessageRequest request) {
        return chatService.update(request)
                .map(Response::successResponse)
                .orElse(Response.failureResponse(
                        new ClientError(notFound(ChatMessage.class, "id", request.id())),
                        NOT_FOUND));
    }

    @DeleteMapping("/{id}")
    public Response<ChatMessage> deleteDeviceById(@PathVariable final UUID id) {
        return chatService.deleteById(id)
                .map(Response::successResponse)
                .orElse(Response.failureResponse(
                        new ClientError(notFound(ChatMessage.class, "id", id)),
                        NOT_FOUND));
    }
}
