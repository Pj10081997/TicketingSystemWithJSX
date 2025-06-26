package com.example.ticketingsystem.service;

import com.example.ticketingsystem.model.Ticket;
import com.example.ticketingsystem.repository.TicketRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class TicketServiceImpl implements TicketService {

    @Autowired
    private TicketRepository ticketRepository;

    @Autowired
    private MongoTemplate mongoTemplate;

    @Override
    public Ticket createTicket(Ticket ticket) {
        return ticketRepository.save(ticket);
    }

    @Override
    public Ticket getTicketById(String id) {
        return ticketRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Ticket not found with ID: " + id));
    }

    @Override
    public Ticket updateTicketStatus(String id, String status) {
        Ticket ticket = getTicketById(id);
        ticket.setStatus(status);
        ticket.setUpdatedAt(LocalDateTime.now());

        if ("CLOSED".equalsIgnoreCase(status)) {
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            String currentUsername = auth.getName();

            ticket.setResolvedBy(currentUsername);
            ticket.setClosedAt(LocalDateTime.now());
        } else {
            // Clear resolution info if reopened
            ticket.setResolvedBy(null);
            ticket.setClosedAt(null);
        }

        return ticketRepository.save(ticket);
    }

    @Override
    public void deleteTicket(String id) {
        ticketRepository.deleteById(id);
    }

    @Override
    // ✅ NEW method for filtering by status in addition to others
    public List<Ticket> getFilteredTickets(String username, boolean isAdmin,
                                           String resolvedBy, LocalDate startDate,
                                           LocalDate endDate, String status) {

        Query query = new Query();

        if (!isAdmin) {
            query.addCriteria(Criteria.where("createdBy").is(username));
        }

        if (resolvedBy != null && !resolvedBy.trim().isEmpty()) {
            query.addCriteria(Criteria.where("resolvedBy").is(resolvedBy));
        }

        if (startDate != null || endDate != null) {
            Criteria dateCriteria = Criteria.where("createdAt").exists(true);

            if (startDate != null) {
                dateCriteria = dateCriteria.gte(startDate.atStartOfDay());
            }

            if (endDate != null) {
                dateCriteria = dateCriteria.lte(endDate.atTime(23, 59, 59));
            }

            query.addCriteria(dateCriteria);
        }

        if (status != null && !status.trim().isEmpty()) {
            query.addCriteria(Criteria.where("status").is(status));
        }

        return mongoTemplate.find(query, Ticket.class);
    }

    @Override
    public Ticket saveTicket(Ticket ticket) {
        return ticketRepository.save(ticket);
    }
}