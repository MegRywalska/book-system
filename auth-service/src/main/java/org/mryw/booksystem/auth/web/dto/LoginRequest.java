package org.mryw.booksystem.auth.web.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public record LoginRequest(
        @Email(message = "Email should be valid")
        String email,
        @NotBlank(message = "Password is required")
        String password
) {
}
