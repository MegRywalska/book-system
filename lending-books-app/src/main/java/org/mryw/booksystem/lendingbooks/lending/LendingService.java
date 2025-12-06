package org.mryw.booksystem.lendingbooks.lending;

import lombok.RequiredArgsConstructor;
import org.mryw.booksystem.lendingbooks.book.Book;
import org.mryw.booksystem.lendingbooks.book.BookNotFoundException;
import org.mryw.booksystem.lendingbooks.book.BookRepository;
import org.mryw.booksystem.lendingbooks.logging.LogClient;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class LendingService {

    private final LendingRepository lendingRepository;
    private final BookRepository bookRepository;
    private final LogClient logClient;

    @Transactional
    public LendingResponse lendBook(LendingRequest request) {
        Book book = bookRepository.findById(request.bookId())
                .orElseThrow(() -> new BookNotFoundException(request.bookId()));

        if (book.getQuantity() <= 0) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Brak dostępnych egzemplarzy");
        }

        if (request.userId() == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Podaj userId użytkownika");
        }

        book.setQuantity(book.getQuantity() - 1);
        bookRepository.save(book);

        Lending lending = new Lending();
        lending.setBook(book);
        lending.setUserId(request.userId());
        lending.setLendingDate(LocalDateTime.now());
        lending.setReturned(false);

        Lending saved = lendingRepository.save(lending);
        logClient.info("BOOK_LENT", request.userId(),
                "Book " + book.getId() + " lent to user " + request.userId());

        return LendingResponse.from(saved);
    }

    @Transactional
    public LendingResponse returnBook(Long lendingId) {
        Lending lending = lendingRepository.findById(lendingId)
                .orElseThrow(() -> new LendingNotFoundException(lendingId));

        if (lending.isReturned()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Book already returned");
        }

        lending.setReturned(true);
        lending.setReturnDate(LocalDateTime.now());

        Book book = lending.getBook();
        book.setQuantity(book.getQuantity() + 1);
        bookRepository.save(book);

        Lending saved = lendingRepository.save(lending);
        logClient.info("BOOK_RETURNED", lending.getUserId(),
                "Book " + book.getId() + " returned by user " + lending.getUserId());

        return LendingResponse.from(saved);
    }

    @Transactional(readOnly = true)
    public List<LendingResponse> findAll() {
        return lendingRepository.findAll().stream()
                .map(LendingResponse::from)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<LendingResponse> findByUserId(Long userId) {
        return lendingRepository.findByUserId(userId).stream()
                .map(LendingResponse::from)
                .toList();
    }
}
