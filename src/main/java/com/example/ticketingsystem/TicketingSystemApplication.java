package com.example.ticketingsystem;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import javax.swing.JOptionPane;
import java.awt.Desktop;
import java.net.URI;

@SpringBootApplication
public class TicketingSystemApplication {

    public static void main(String[] args) {
        // Step 1: Ask user what to do
        int choice = JOptionPane.showOptionDialog(
                null,
                "Welcome to the Ticketing System.\nWhat would you like to do?",
                "GSI Ticketing System",
                JOptionPane.DEFAULT_OPTION,
                JOptionPane.QUESTION_MESSAGE,
                null,
                new String[]{"Open in Browser", "Exit"},
                "Open in Browser"
        );

        if (choice == 1 || choice == JOptionPane.CLOSED_OPTION) {
            System.out.println("❌ Application launch aborted by user.");
            System.exit(0);
        }

        // Step 2: Run Spring Boot in a separate thread
        new Thread(() -> SpringApplication.run(TicketingSystemApplication.class, args)).start();

        // Step 3: Try opening the browser
        try {
            String url = "http://localhost:5173";
            Thread.sleep(3000); // Optional delay to give server time to boot
            if (Desktop.isDesktopSupported()) {
                Desktop.getDesktop().browse(new URI(url));
                System.out.println("✅ Browser launched at " + url);
            }
        } catch (Exception e) {
            e.printStackTrace();
            System.out.println("⚠ Could not open browser automatically.");
        }

        // Optional: Keep another dialog open until user chooses to close
        JOptionPane.showMessageDialog(
                null,
                "Ticketing system is running in the browser.\nYou may close this window.",
                "Server Running",
                JOptionPane.INFORMATION_MESSAGE
        );
    }
}
