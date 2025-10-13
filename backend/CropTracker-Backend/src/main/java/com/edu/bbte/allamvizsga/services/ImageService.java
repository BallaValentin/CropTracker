package com.edu.bbte.allamvizsga.services;

import com.edu.bbte.allamvizsga.model.User;
import com.edu.bbte.allamvizsga.util.InitialAvatarGenerator;
import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.imageio.ImageIO;
import java.awt.image.BufferedImage;
import java.io.File;
import java.io.IOException;

@Service
@AllArgsConstructor(onConstructor = @__(@Autowired))
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
}
