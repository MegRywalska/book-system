package org.mryw.booksystem.lendingbooks.book;

import lombok.RequiredArgsConstructor;
import org.mryw.booksystem.lendingbooks.logging.LogClient;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class BookService {

    private final BookRepository bookRepository;
    private final LogClient logClient;

    @Transactional(readOnly = true)
    public Book findBookById(Long bookId) {
        return bookRepository.findById(bookId).orElseThrow(() -> new BookNotFoundException(bookId));
    }

    @Transactional(readOnly = true)
    public List<Book> findAllBooks() {
        return bookRepository.findAll();
    }

    @Transactional
    public Book addBook(Book book) {
        book.setId(null);
        Book saved = bookRepository.save(book);
        logClient.info("BOOK_CREATED", null, "Book created with id " + saved.getId());
        return saved;
    }

    @Transactional
    public Book updateBook(Long id, Book updatedBook) {
        Book book = bookRepository.findById(id).orElseThrow(() -> new BookNotFoundException(id));
        if (updatedBook.getTitle() != null && !updatedBook.getTitle().isBlank()) {
            book.setTitle(updatedBook.getTitle());
        }
        if (updatedBook.getAuthor() != null && !updatedBook.getAuthor().isBlank()) {
            book.setAuthor(updatedBook.getAuthor());
        }
        if (updatedBook.getDescription() != null) {
            book.setDescription(updatedBook.getDescription());
        }
        if (updatedBook.getIsbn() != null && !updatedBook.getIsbn().isBlank()) {
            book.setIsbn(updatedBook.getIsbn());
        }
        if (updatedBook.getPublishDate() != null) {
            book.setPublishDate(updatedBook.getPublishDate());
        }
        if (updatedBook.getQuantity() != null) {
            book.setQuantity(updatedBook.getQuantity());
        }
        Book saved = bookRepository.save(book);
        logClient.info("BOOK_UPDATED", null, "Book updated with id " + saved.getId());
        return saved;
    }

    @Transactional
    public void deleteBook(Long id) {
        if (!bookRepository.existsById(id)) {
            throw new BookNotFoundException(id);
        }
        bookRepository.deleteById(id);
        logClient.info("BOOK_DELETED", null, "Book deleted with id " + id);
    }



}
