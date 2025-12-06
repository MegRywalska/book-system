package org.mryw.booksystem.lendingbooks.lending;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface LendingRepository extends JpaRepository<Lending, Long> {
    List<Lending> findByUserId(Long userId);
}

