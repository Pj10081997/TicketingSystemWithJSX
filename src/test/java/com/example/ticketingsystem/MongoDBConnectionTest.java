package com.example.ticketingsystem;

import com.example.ticketingsystem.model.Ticket;
import com.example.ticketingsystem.repository.TicketRepository;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.TestPropertySource;

import static org.junit.jupiter.api.Assertions.assertNotNull;

@SpringBootTest
@TestPropertySource(locations = "classpath:application-test.properties")
public class MongoDBConnectionTest {
    @Autowired
    private TicketRepository ticketRepository;

    @Test
    public void testMongoDBConnection() {
        Ticket testTicket = new Ticket();
        testTicket.setTitle("Connection Test");
        testTicket.setDescription("Testing MongoDB connection");
        testTicket.setCreatedBy("tester");

        Ticket savedTicket = ticketRepository.save(testTicket);
        assertNotNull(savedTicket.getId());
    }

    @AfterEach
    public void cleanup() {
        ticketRepository.deleteAll();
    }
}