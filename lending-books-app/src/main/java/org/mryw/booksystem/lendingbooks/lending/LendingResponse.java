package org.mryw.booksystem.lendingbooks.lending;

import java.time.LocalDateTime;

public record LendingResponse(
        Long id,
        Long bookId,
        Long userId,
        LocalDateTime lendingDate,
        LocalDateTime returnDate,
        boolean returned
) {
    public static LendingResponse from(Lending lending) {
        return new LendingResponse(
                lending.getId(),
                lending.getBook() != null ? lending.getBook().getId() : null,
                lending.getUserId(),
                lending.getLendingDate(),
                lending.getReturnDate(),
                lending.isReturned()
        );
    }
}
