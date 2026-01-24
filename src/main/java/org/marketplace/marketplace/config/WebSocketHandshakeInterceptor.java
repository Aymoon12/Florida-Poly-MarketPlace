package org.marketplace.marketplace.config;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.marketplace.marketplace.auth.config.JwtService;
import org.springframework.http.server.ServerHttpRequest;
import org.springframework.http.server.ServerHttpResponse;
import org.springframework.http.server.ServletServerHttpRequest;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.WebSocketHandler;
import org.springframework.web.socket.server.HandshakeInterceptor;

import java.util.Map;

/**
 * Intercepts WebSocket handshake to extract JWT from HTTP-only cookie.
 * The authenticated user is stored in session attributes for use by the channel interceptor.
 */
@Component
@RequiredArgsConstructor
@Log4j2
public class WebSocketHandshakeInterceptor implements HandshakeInterceptor {

    private static final String JWT_COOKIE_NAME = "jwt";
    public static final String USER_ATTRIBUTE = "authenticatedUser";

    private final JwtService jwtService;
    private final UserDetailsService userDetailsService;

    @Override
    public boolean beforeHandshake(
            ServerHttpRequest request,
            ServerHttpResponse response,
            WebSocketHandler wsHandler,
            Map<String, Object> attributes) throws Exception {

        if (request instanceof ServletServerHttpRequest servletRequest) {
            HttpServletRequest httpRequest = servletRequest.getServletRequest();
            Cookie[] cookies = httpRequest.getCookies();

            if (cookies != null) {
                for (Cookie cookie : cookies) {
                    if (JWT_COOKIE_NAME.equals(cookie.getName())) {
                        String jwt = cookie.getValue();
                        try {
                            String username = jwtService.extractUsername(jwt);
                            if (username != null) {
                                UserDetails userDetails = userDetailsService.loadUserByUsername(username);
                                if (jwtService.validateToken(jwt, userDetails)) {
                                    UsernamePasswordAuthenticationToken authToken =
                                            new UsernamePasswordAuthenticationToken(
                                                    userDetails, null, userDetails.getAuthorities());
                                    attributes.put(USER_ATTRIBUTE, authToken);
                                    log.debug("WebSocket handshake authenticated for user: {}", username);
                                    return true;
                                } else {
                                    log.warn("WebSocket handshake JWT validation failed for user: {}", username);
                                }
                            }
                        } catch (Exception e) {
                            log.error("WebSocket handshake authentication error: {}", e.getMessage());
                        }
                        break;
                    }
                }
            }

            log.warn("WebSocket handshake attempted without valid JWT cookie");
        }

        // Allow connection to proceed - channel interceptor will handle final auth decision
        return true;
    }

    @Override
    public void afterHandshake(
            ServerHttpRequest request,
            ServerHttpResponse response,
            WebSocketHandler wsHandler,
            Exception exception) {
        // No action needed after handshake
    }
}
