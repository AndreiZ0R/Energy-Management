package org.andreiz0r.emg.security;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.andreiz0r.core.mapper.Mapper;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.cloud.gateway.filter.GatewayFilterChain;
import org.springframework.cloud.gateway.filter.GlobalFilter;
import org.springframework.core.Ordered;
import org.springframework.core.io.buffer.DataBuffer;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.server.reactive.ServerHttpRequest;
import org.springframework.http.server.reactive.ServerHttpResponse;
import org.springframework.stereotype.Component;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestClient;
import org.springframework.web.server.ServerWebExchange;
import reactor.core.publisher.Mono;

import java.util.List;
import java.util.Map;
import java.util.Objects;

import static org.andreiz0r.core.util.Constants.Headers.AUTHORIZATION;
import static org.andreiz0r.core.util.Constants.Headers.BEARER;
import static org.andreiz0r.core.util.Constants.ReturnMessages.BAD_TOKEN;

@Component
@RequiredArgsConstructor
@Slf4j
public class AuthFilter implements GlobalFilter, Ordered {

    @Value("${whitelistedEndpoints}")
    private List<String> whitelistedEndpoints;
    private final RestClient.Builder restClient;

    private boolean notValidHeader(final String header) {
        return StringUtils.isBlank(header) || !header.startsWith(BEARER);
    }

    private String extractTokenFromHeader(final String header) {
        return header.substring(BEARER.length());
    }

    private boolean shouldNotFilter(final ServerHttpRequest request) {
        String path = request.getURI().getPath();
        return whitelistedEndpoints.stream().anyMatch(path::contains);
    }

    @Override
    public Mono<Void> filter(final ServerWebExchange exchange, final GatewayFilterChain chain) {
        if (shouldNotFilter(exchange.getRequest())) {
            return chain.filter(exchange);
        }

        String authHeader = exchange.getRequest().getHeaders().getFirst(AUTHORIZATION);
        if (Objects.isNull(authHeader) || notValidHeader(authHeader)) {
            return handleInvalidAuth(exchange, BAD_TOKEN, HttpStatus.UNAUTHORIZED);
        }

        try {
            String token = extractTokenFromHeader(authHeader);
            restClient.build()
                    .post()
                    .uri("http://user-management-service/api/rest/auth/validate")
                    .body(token)
                    .retrieve()
                    .toBodilessEntity();

            log.info("Successfully authenticated for path {}", exchange.getRequest().getPath());
        } catch (HttpClientErrorException e) {
            log.error("Exception occurred while trying to hit {}: {}", exchange.getRequest().getPath(), e.getMessage());
            return handleInvalidAuth(exchange, BAD_TOKEN, HttpStatus.UNAUTHORIZED);
        }

        return chain.filter(exchange);
    }

    @Override
    public int getOrder() {
        return -1;
    }

    private Mono<Void> handleInvalidAuth(final ServerWebExchange exchange, final String message, final HttpStatus status) {
        ServerHttpResponse response = exchange.getResponse();
        response.setStatusCode(status);
        response.getHeaders().add(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON_VALUE);

        DataBuffer dataBuffer = response.bufferFactory().wrap(
                Mapper.writeValueAsBytes(
                        Map.of("status", status, "message", message)
                ));

        return response.writeWith(Mono.just(dataBuffer));
    }
}
