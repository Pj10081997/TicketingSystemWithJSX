package com.example.ticketingsystem.controller;

import com.example.ticketingsystem.model.Ticket;
import com.example.ticketingsystem.service.TicketService;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/tickets")
public class TicketController {

    @Autowired
    private TicketService ticketService;

    // ✅ CREATE ticket
    @PostMapping
    public ResponseEntity<Ticket> createTicket(@Valid @RequestBody Ticket ticket) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String currentUsername = auth.getName();

        ticket.setCreatedBy(currentUsername);
        ticket.setCreatedAt(LocalDateTime.now());
        ticket.setUpdatedAt(LocalDateTime.now());
        ticket.setStatus("OPEN");

        Ticket created = ticketService.createTicket(ticket);
        return ResponseEntity.ok(created);
    }

    // ✅ LIST / FILTER tickets
    @GetMapping
    public ResponseEntity<List<Ticket>> getAllTickets(
            @RequestParam(required = false) String resolvedBy,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate,
            @RequestParam(required = false) String status
    ) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String username = auth.getName();
        boolean isAdmin = auth.getAuthorities().stream()
                .anyMatch(role -> role.getAuthority().equals("ROLE_ADMIN"));

        if (status != null && !status.trim().isEmpty()) {
            status = status.trim().toUpperCase();
            if (!status.matches("OPEN|IN_PROGRESS|CLOSED")) {
                return ResponseEntity.badRequest().body(null); // 🧼 Clean handling of invalid status
            }
        }

        List<Ticket> tickets = ticketService.getFilteredTickets(username, isAdmin, resolvedBy, startDate, endDate, status);
        return ResponseEntity.ok(tickets);
    }

    // ✅ GET ticket by ID
    @GetMapping("/{id}")
    public ResponseEntity<Ticket> getTicketById(@PathVariable String id) {
        try {
            Ticket ticket = ticketService.getTicketById(id);
            return ResponseEntity.ok(ticket);
        } catch (Exception e) {
            return ResponseEntity.notFound().build(); // 🧼 Return proper 404 on not found
        }
    }

    // ✅ UPDATE status only via /status
    @PutMapping("/{id}/status")
    public ResponseEntity<?> updateStatus(@PathVariable String id, @RequestParam String status) {
        if (!status.matches("OPEN|IN_PROGRESS|CLOSED")) {
            return ResponseEntity.badRequest().body("Invalid status value.");
        }

        try {
            Ticket updated = ticketService.updateTicketStatus(id, status);
            return ResponseEntity.ok(updated);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Failed to update status: " + e.getMessage());
        }
    }

    // ✅ NEW: Unified PUT for JSON-based updates (e.g., React PUT /api/tickets/{id})
    @PutMapping("/{id}")
    public ResponseEntity<?> updateTicket(@PathVariable String id, @RequestBody Map<String, String> updates, Authentication auth) {
        try {
            Ticket ticket = ticketService.getTicketById(id);

            // Handle status
            String status = updates.get("status");
            if (status != null && status.matches("OPEN|IN_PROGRESS|CLOSED")) {
                ticket.setStatus(status);
                if ("CLOSED".equals(status)) {
                    ticket.setClosedAt(LocalDateTime.now());
                    ticket.setResolvedBy(auth.getName());
                }
            }

            // Handle remarks
            if (updates.containsKey("remarks")) {
                ticket.setRemarks(updates.get("remarks"));
            }

            ticket.setUpdatedAt(LocalDateTime.now());
            ticketService.saveTicket(ticket);

            return ResponseEntity.ok(ticket);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Failed to update ticket: " + e.getMessage());
        }
    }

    // ✅ UPDATE remarks
    @PostMapping("/{id}/remarks")
    public ResponseEntity<?> updateRemarks(@PathVariable String id, @RequestParam String remarks) {
        try {
            Ticket ticket = ticketService.getTicketById(id);
            ticket.setRemarks(remarks);
            ticketService.saveTicket(ticket);
            return ResponseEntity.ok("Remarks updated.");
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Failed to update remarks: " + e.getMessage());
        }
    }

    // ✅ DELETE ticket
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteTicket(@PathVariable String id) {
        try {
            ticketService.deleteTicket(id);
            return ResponseEntity.ok("Ticket deleted successfully.");
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Failed to delete ticket: " + e.getMessage());
        }
    }
}
