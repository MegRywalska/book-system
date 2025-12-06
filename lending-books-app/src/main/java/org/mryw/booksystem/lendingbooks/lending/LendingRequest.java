package org.mryw.booksystem.lendingbooks.lending;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

public record LendingRequest(
        @NotNull @Positive Long bookId,
        @NotNull @Positive Long userId
) {
}
