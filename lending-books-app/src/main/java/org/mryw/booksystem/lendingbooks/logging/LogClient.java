package org.mryw.booksystem.lendingbooks.logging;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClientException;
import org.springframework.web.client.RestTemplate;

@Service
@RequiredArgsConstructor
@Slf4j
public class LogClient {

    private final RestTemplate restTemplate;

    @Value("${logging.log-service-url:http://localhost:8082/api/logs}")
    private String logServiceUrl;

    @Value("${logging.source:lending-books-app}")
    private String source;

    public void info(String action, Long userId, String message) {
        send("INFO", action, userId, message);
    }

    public void warn(String action, Long userId, String message) {
        send("WARN", action, userId, message);
    }

    private void send(String level, String action, Long userId, String message) {
        LogRequest request = new LogRequest(
                level,
                action,
                userId != null ? String.valueOf(userId) : null,
                source,
                message
        );
        try {
            ResponseEntity<Void> response = restTemplate.postForEntity(logServiceUrl, request, Void.class);
            if (!response.getStatusCode().is2xxSuccessful()) {
                log.debug("Log service responded with status {}", response.getStatusCode());
            }
        } catch (RestClientException ex) {
            log.debug("Failed to send log to log-service: {}", ex.getMessage());
        }
    }
}
