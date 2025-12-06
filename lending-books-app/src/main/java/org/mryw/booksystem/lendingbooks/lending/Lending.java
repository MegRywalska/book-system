package org.mryw.booksystem.lendingbooks.lending;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import org.mryw.booksystem.lendingbooks.book.Book;

import java.time.LocalDateTime;

@Entity
@Data
public class Lending {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull
    @ManyToOne
    @JoinColumn(name = "book_id")
    private Book book;

    @NotNull
    @Column(name = "user_id")
    private Long userId;

    @NotNull
    private LocalDateTime lendingDate = LocalDateTime.now();

    private LocalDateTime returnDate;

    private boolean returned = false;
}
