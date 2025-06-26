package com.example.ticketingsystem.service;

import com.example.ticketingsystem.model.Ticket;

import java.time.LocalDate;
import java.util.List;

public interface TicketService {
    Ticket createTicket(Ticket ticket);
    List<Ticket> getFilteredTickets(String username, boolean isAdmin, String resolvedBy, LocalDate startDate, LocalDate endDate, String status);
    Ticket getTicketById(String id);
    Ticket updateTicketStatus(String id, String status);
    void deleteTicket(String id);
    
    Ticket saveTicket(Ticket ticket);

}