package org.andreiz0r.core.util;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import lombok.RequiredArgsConstructor;
import org.andreiz0r.core.enums.UserRole;
import org.andreiz0r.core.util.Constants.JwtClaims;
import org.andreiz0r.core.util.Constants.Time;

import java.security.Key;
import java.util.Date;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;
import java.util.function.Function;

import static org.andreiz0r.core.util.Constants.Headers.BEARER;

@RequiredArgsConstructor
public class JwtUtils {
    private final String secretKey;

    public Optional<UUID> extractUserId(final String token) {
        return extractClaim(token, claims -> claims.get(JwtClaims.ID, UUID.class));
    }

    public Optional<String> extractUsername(final String token) {
        return extractClaim(token, Claims::getSubject);
    }

    public Optional<UserRole> extractRole(final String token) {
        return extractClaim(token, claims -> claims.get(JwtClaims.ROLE, UserRole.class));
    }

    private Optional<Date> extractExpiration(final String token) {
        return extractClaim(token, Claims::getExpiration);
    }

    public <T> Optional<T> extractClaim(final String token, final Function<Claims, T> claimsResolver) {
        Optional<Claims> claimsOptional = extractAllClaims(token);
        return claimsOptional.map(claimsResolver);
    }

    public String generateToken(final UUID id, final String username, final UserRole role) {
        return generateToken(Map.of(
                JwtClaims.ID, id,
                JwtClaims.USERNAME, username,
                JwtClaims.ROLE, role));
    }

    public String generateToken(final Map<String, Object> claims) {
        return Jwts.builder()
                .setClaims(claims)
                .setId(String.valueOf(claims.get(JwtClaims.ID)))
                .setSubject(String.valueOf(claims.get(JwtClaims.USERNAME)))
                .setIssuedAt(Time.now())
                .setExpiration(Time.nowWithDelay(Time.DEFAULT_JWT_EXPIRY))
                .signWith(getSigningKey(), SignatureAlgorithm.HS256)
                .compact();
    }

    private Optional<Claims> extractAllClaims(final String token) {
        try {
            return Optional.of(
                    Jwts.parserBuilder()
                            .setSigningKey(getSigningKey())
                            .build()
                            .parseClaimsJws(token)
                            .getBody());
        } catch (Exception e) {
            return Optional.empty();
        }
    }

    private Key getSigningKey() {
        byte[] keyBytes = Decoders.BASE64.decode(secretKey);
        return Keys.hmacShaKeyFor(keyBytes);
    }

    public boolean isValidToken(final String token, final UUID userId, final String username, final UserRole role) {
        return !isExpiredToken(token)
               && hasValidUserId(token, userId)
               && hasValidUsername(token, username)
               && hasValidRole(token, role);
    }

    public String extractTokenFromHeader(final String header) {
        return header.substring(BEARER.length());
    }

    private boolean isExpiredToken(final String token) {
        return extractExpiration(token)
                .map(date -> date.before(Time.now()))
                .orElse(false);
    }

    private boolean hasValidUserId(final String token, final UUID userId) {
        return extractUserId(token)
                .map(userId::equals)
                .orElse(false);
    }

    private boolean hasValidUsername(final String token, final String username) {
        return extractUsername(token)
                .map(username::equals)
                .orElse(false);
    }

    private boolean hasValidRole(final String token, final UserRole role) {
        return extractRole(token)
                .map(role::equals)
                .orElse(false);
    }
}

