package org.mryw.booksystem.lendingbooks.book;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Column;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.PastOrPresent;
import jakarta.validation.constraints.PositiveOrZero;
import lombok.Data;

import java.time.LocalDate;

@Entity
@Data
public class Book {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Title is required")
    private String title;

    @NotBlank(message = "Author is required")
    private String author;

    @Column(length = 2000)
    private String description;

    @NotBlank(message = "ISBN is required")
    private String isbn;

    @PastOrPresent(message = "Publish date cannot be in the future")
    private LocalDate publishDate;

    @PositiveOrZero(message = "Quantity cannot be negative")
    private Integer quantity;

}
