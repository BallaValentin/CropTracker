package edu.bbte.allamvizsga.services;

import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class MailService {
    private final JavaMailSender javaMailSender;

    public MailService(JavaMailSender javaMailSender) {
        this.javaMailSender = javaMailSender;
    }

    public void sendVerificationEmail(String toMail, String toUser, String resetToken) {
        String changePasswordUrl = "http://localhost:5174/change-password?token=" + resetToken;

        SimpleMailMessage mailMessage = new SimpleMailMessage();
        mailMessage.setTo(toMail);
        mailMessage.setSubject("Password Reset Request");
        mailMessage.setText("""
                Hello %s,
                
                We received a request to reset your password. Click the link below to choose a new one:      
                %s
                
                If you didn’t request a password reset, you can ignore this email.
                
                – CropTracker Team
                """.formatted(toUser, changePasswordUrl));

        javaMailSender.send(mailMessage);
    }
}
