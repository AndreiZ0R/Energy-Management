//package org.andreiz0r.ums.web.filter;
//
//import jakarta.servlet.FilterChain;
//import jakarta.servlet.http.HttpServletRequest;
//import jakarta.servlet.http.HttpServletResponse;
//import lombok.NonNull;
//import lombok.RequiredArgsConstructor;
//import lombok.SneakyThrows;
//import lombok.extern.slf4j.Slf4j;
//import org.andreiz0r.core.response.Response;
//import org.andreiz0r.core.util.JwtUtils;
//import org.apache.commons.lang3.StringUtils;
//import org.springframework.stereotype.Component;
//import org.springframework.web.filter.OncePerRequestFilter;
//
//import java.util.Optional;
//
//import static org.andreiz0r.core.util.Constants.Headers.AUTHORIZATION;
//import static org.andreiz0r.core.util.Constants.Headers.BEARER;
//import static org.andreiz0r.core.util.Constants.ReturnMessages.BAD_TOKEN;
//
//// Todo:
//
//@Component
//@RequiredArgsConstructor
//@Slf4j
//public class JwtSecurityFilter
//        extends OncePerRequestFilter
//{
//
//    private final JwtUtils jwtUtils;
//
//    @SneakyThrows
//    @Override
//    protected void doFilterInternal(final HttpServletRequest request, @NonNull final HttpServletResponse response, @NonNull final FilterChain filterChain) {
//        String authHeader = request.getHeader(AUTHORIZATION);
//
//        if (notValidHeader(authHeader)) {
//            Response.setServletResponse(response, BAD_TOKEN, HttpServletResponse.SC_UNAUTHORIZED);
//            return;
//        }
//
//        String token = jwtUtils.extractTokenFromHeader(authHeader);
//        Optional<String> usernameOptional = jwtUtils.extractUsername(token);
//        if (usernameOptional.isEmpty()) {
//            Response.setServletResponse(response, BAD_TOKEN, HttpServletResponse.SC_UNAUTHORIZED);
//            return;
//        }
//
//        String username = usernameOptional.get();
//        // Todo: figure out if spring security is needed or i can replace SecurityContextHolder auth status!!!
//        // also this should be moved to gateway, and minimised here somehow?
//
//        filterChain.doFilter(request, response);
//    }
//
//
//    private boolean notValidHeader(final String header) {
//        return StringUtils.isBlank(header) || !header.startsWith(BEARER);
//    }
//}
//// Todo: userContext interceptor + on DMS + gateway filter for security