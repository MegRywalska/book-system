package org.mryw.booksystem.lendingbooks.lending;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.NOT_FOUND)
public class LendingNotFoundException extends RuntimeException {
    public LendingNotFoundException(Long id) {
        super("Lending not found: " + id);
    }
}
