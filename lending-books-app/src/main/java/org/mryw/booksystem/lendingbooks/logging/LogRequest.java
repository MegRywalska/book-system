package org.mryw.booksystem.lendingbooks.logging;

public record LogRequest(
        String level,
        String action,
        String username,
        String source,
        String message
) {
}
