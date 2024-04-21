package com.backapi.Myfridge.emailmodel;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.ClassPathResource;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.mail.javamail.MimeMessagePreparator;
import org.springframework.stereotype.Service;

import jakarta.mail.internet.MimeMessage;

@Service
public class MailService {
	
	@Autowired
	private JavaMailSender mailSender;
	
	@Value("${spring.mail.username}")
	private String fromMail;
	
	public void sendMail(String mail, MailStructure mailStructure) {
	    mailSender.send(new MimeMessagePreparator() {
	        @Override
	        public void prepare(MimeMessage mimeMessage) throws Exception {
	            MimeMessageHelper mimeMessageHelper = new MimeMessageHelper(mimeMessage, true, "UTF-8");
	            
	            mimeMessageHelper.setFrom(fromMail);
	            mimeMessageHelper.setTo(mail);
	            mimeMessageHelper.setSubject(mailStructure.getSubject());
	            mimeMessageHelper.setText(mailStructure.getMessage(), true);
	            
	            ClassPathResource logoResource = new ClassPathResource("templates/MyFridgeTEST.jpg");
	            mimeMessageHelper.addInline("logo", logoResource);
	        }
	    });
	}
	
	public String prepareConfirmationEmail(String firstName, String confirmationLink) {
	    String emailTemplate = "<!DOCTYPE html>\r\n"
	            + "<html lang=\"en\">\r\n"
	            + "<head>\r\n"
	            + "    <meta charset=\"UTF-8\">\r\n"
	            + "    <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">\r\n"
	            + "    <title>Email Confirmation</title>\r\n"
	            + "    <style>\r\n"
	            + "        body {\r\n"
	            + "            font-family: Arial, sans-serif;\r\n"
	            + "            line-height: 1.6;\r\n"
	            + "            color: #333;\r\n"
	            + "        }\r\n"
	            + "        .container {\r\n"
	            + "            text-align: center;\r\n"
	            + "        }\r\n"
	            + "        img {\r\n"
	            + "            width: 100px;\r\n"
	            + "            height: 100px;\r\n"
	            + "        }\r\n"
	            + "        p {\r\n"
	            + "            margin-bottom: 15px;\r\n"
	            + "        }\r\n"
	            + "        a {\r\n"
	            + "            color: #007BFF;\r\n"
	            + "            text-decoration: none;\r\n"
	            + "            font-weight: bold;\r\n"
	            + "        }\r\n"
	            + "    </style>\r\n"
	            + "</head>\r\n"
	            + "<body>\r\n"
	            + "    <div class=\"container\">\r\n"
	            + "        <img src='cid:logo' alt='Logo'>\r\n"
	            + "        <p>Dear " + firstName + ",</p>\r\n"
	            + "        <p>Thank you for registering with MyFridge! To activate your account, please click the link below:</p>\r\n"
	            + "        <p><a href=\"" + confirmationLink + "\">Confirm Your Account</a></p>\r\n"
	            + "        <p>If you didn't sign up for MyFridge, please ignore this email.</p>\r\n"
	            + "        <p>Best regards,<br>Your MyFridge Team</p>\r\n"
	            + "    </div>\r\n"
	            + "</body>\r\n"
	            + "</html>";

	    return emailTemplate;
	}
}
