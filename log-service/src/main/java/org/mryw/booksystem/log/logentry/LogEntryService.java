package org.mryw.booksystem.log.logentry;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class LogEntryService {

    private final LogEntryRepository repository;

    public LogEntryResponse save(LogEntryRequest request) {
        LogEntry entry = LogEntry.builder()
                .timestamp(Instant.now())
                .level(request.level())
                .action(request.action())
                .username(request.username())
                .source(request.source())
                .message(request.message())
                .build();
        return LogEntryResponse.from(repository.save(entry));
    }

    public Page<LogEntryResponse> search(
            Optional<String> level,
            Optional<String> action,
            Optional<String> username,
            Optional<String> source,
            Optional<Instant> from,
            Optional<Instant> to,
            Pageable pageable
    ) {
        Specification<LogEntry> spec = Specification.where(null);
        if (level.isPresent()) {
            spec = spec.and((root, query, cb) -> cb.equal(cb.upper(root.get("level")), level.get().toUpperCase()));
        }
        if (action.isPresent()) {
            spec = spec.and((root, query, cb) -> cb.equal(root.get("action"), action.get()));
        }
        if (username.isPresent()) {
            spec = spec.and((root, query, cb) -> cb.equal(root.get("username"), username.get()));
        }
        if (source.isPresent()) {
            spec = spec.and((root, query, cb) -> cb.equal(root.get("source"), source.get()));
        }
        if (from.isPresent()) {
            spec = spec.and((root, query, cb) -> cb.greaterThanOrEqualTo(root.get("timestamp"), from.get()));
        }
        if (to.isPresent()) {
            spec = spec.and((root, query, cb) -> cb.lessThanOrEqualTo(root.get("timestamp"), to.get()));
        }

        return repository.findAll(spec, pageable).map(LogEntryResponse::from);
    }
}
