package org.mryw.booksystem.log.logentry;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.time.Instant;
import java.util.Optional;

@RestController
@RequestMapping("/api/logs")
@RequiredArgsConstructor
public class LogEntryController {

    private final LogEntryService service;

    @PostMapping
    public ResponseEntity<LogEntryResponse> addLog(@Valid @RequestBody LogEntryRequest request) {
        LogEntryResponse saved = service.save(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(saved);
    }

    @GetMapping
    public ResponseEntity<Page<LogEntryResponse>> listLogs(
            @RequestParam Optional<String> level,
            @RequestParam Optional<String> action,
            @RequestParam Optional<String> username,
            @RequestParam Optional<String> source,
            @RequestParam Optional<Instant> from,
            @RequestParam Optional<Instant> to,
            @PageableDefault(size = 20, sort = "timestamp", direction = org.springframework.data.domain.Sort.Direction.DESC) Pageable pageable
    ) {
        Page<LogEntryResponse> result = service.search(level, action, username, source, from, to, pageable);
        return ResponseEntity.ok(result);
    }
}
