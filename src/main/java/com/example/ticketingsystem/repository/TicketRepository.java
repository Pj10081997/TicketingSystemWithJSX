package com.example.ticketingsystem.repository;

import com.example.ticketingsystem.model.Ticket;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.time.LocalDateTime;
import java.util.List;

public interface TicketRepository extends MongoRepository<Ticket, String> {

    List<Ticket> findByStatus(String status);

    List<Ticket> findByCreatedBy(String createdBy);

    List<Ticket> findByResolvedBy(String resolvedBy);

    List<Ticket> findByResolvedByAndClosedAtBetween(String resolvedBy, LocalDateTime start, LocalDateTime end);

    List<Ticket> findByClosedAtBetween(LocalDateTime start, LocalDateTime end);

    List<Ticket> findByCreatedByAndClosedAtBetween(String createdBy, LocalDateTime start, LocalDateTime end);

    List<Ticket> findByCreatedByAndResolvedByAndClosedAtBetween(String createdBy, String resolvedBy, LocalDateTime start, LocalDateTime end);
}
