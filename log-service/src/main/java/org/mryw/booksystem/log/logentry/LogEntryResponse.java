package org.mryw.booksystem.log.logentry;

import java.time.Instant;

public record LogEntryResponse(
        Long id,
        Instant timestamp,
        String level,
        String action,
        String username,
        String source,
        String message
) {
    public static LogEntryResponse from(LogEntry entry) {
        return new LogEntryResponse(
                entry.getId(),
                entry.getTimestamp(),
                entry.getLevel(),
                entry.getAction(),
                entry.getUsername(),
                entry.getSource(),
                entry.getMessage()
        );
    }
}
