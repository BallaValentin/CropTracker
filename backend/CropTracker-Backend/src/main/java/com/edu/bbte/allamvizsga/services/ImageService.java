package com.edu.bbte.allamvizsga.services;

import com.edu.bbte.allamvizsga.model.User;
import com.edu.bbte.allamvizsga.util.InitialAvatarGenerator;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.imageio.ImageIO;
import java.awt.image.BufferedImage;
import java.io.ByteArrayInputStream;
import java.io.File;
import java.io.IOException;
import java.util.Base64;

@Service
@AllArgsConstructor(onConstructor = @__(@Autowired))
@Slf4j
public class ImageService {

    public void uploadDefaultImage(User user) throws IOException {
        int size = 200;
        BufferedImage avatar = InitialAvatarGenerator.generateAvatar(size, user.getFirstName());

        String folderName = "./images/" + user.getUid();
        File imageFolder = new File(folderName);

        if (!imageFolder.exists()) {
            imageFolder.mkdirs();
        }

        String filename = folderName + "/profile.png";
        ImageIO.write(avatar, "png", new File(filename));
    }

    public void updateUserAvatar(User user, String newImageSrc) throws IOException {
        String folderName = "./images/" + user.getUid();
        File imageFolder = new File(folderName);

        if (!imageFolder.exists()) {
            imageFolder.mkdirs();
        }

        if (newImageSrc.contains(",")) {
            newImageSrc = newImageSrc.split(",")[1];
        }


        byte[] imageBytes = Base64.getDecoder().decode(newImageSrc);

        ByteArrayInputStream bis = new ByteArrayInputStream(imageBytes);
        BufferedImage avatar = ImageIO.read(bis);

        String filename = folderName + "/profile.png";
        log.info("The filename is: {}", filename);
        ImageIO.write(avatar, "png", new File(filename));
    }
}
