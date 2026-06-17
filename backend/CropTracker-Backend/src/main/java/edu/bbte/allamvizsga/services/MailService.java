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

    public void sendEmailVerificationMail(String toMail, String toUser, String verificationCode) {
        SimpleMailMessage mailMessage = new SimpleMailMessage();
        mailMessage.setTo(toMail);
        mailMessage.setSubject("Verify Email Address");
        mailMessage.setText("""
                Hello %s,
                
                Thank you, for registering an account with CropTracker. To complete your registration and secure your profile, please verify your email address by entering the verification code below:
                %s
                
                Please note that this code is confidential and will expire shortly. If you didn’t initiate this registration request, you can ignore this email.
                
                – CropTracker Team
                """.formatted(toUser, verificationCode));

        javaMailSender.send(mailMessage);
    }
}
