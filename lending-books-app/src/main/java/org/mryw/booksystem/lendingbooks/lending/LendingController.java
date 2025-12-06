package org.mryw.booksystem.lendingbooks.lending;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/lending")
@RequiredArgsConstructor
public class LendingController {

    private final LendingService lendingService;

    @PostMapping("/lend")
    public ResponseEntity<LendingResponse> lendBook(
            @Valid @RequestBody LendingRequest request
    ) {
        LendingResponse response = lendingService.lendBook(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PostMapping("/return/{lendingId}")
    public LendingResponse returnBook(@PathVariable Long lendingId) {
        return lendingService.returnBook(lendingId);
    }

    @GetMapping
    public List<LendingResponse> findAll() {
        return lendingService.findAll();
    }

    @GetMapping("/user/{userId}")
    public List<LendingResponse> findByUser(@PathVariable Long userId) {
        return lendingService.findByUserId(userId);
    }
}
