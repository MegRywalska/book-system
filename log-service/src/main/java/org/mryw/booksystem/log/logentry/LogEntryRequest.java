package org.mryw.booksystem.log.logentry;

import jakarta.validation.constraints.NotBlank;

public record LogEntryRequest(
        @NotBlank String level,
        @NotBlank String action,
        String username,
        String source,
        String message
) {
}
