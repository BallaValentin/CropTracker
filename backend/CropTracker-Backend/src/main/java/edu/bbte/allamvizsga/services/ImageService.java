package edu.bbte.allamvizsga.services;

import edu.bbte.allamvizsga.model.User;
import edu.bbte.allamvizsga.util.InitialAvatarGenerator;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.stereotype.Service;

import javax.imageio.ImageIO;
import java.awt.image.BufferedImage;
import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Base64;

@Service
@AllArgsConstructor(onConstructor = @__(@Autowired))
@Slf4j
public class ImageService {

    public void uploadDefaultImage(User user) throws IOException {
        int size = 200;
        BufferedImage avatar = InitialAvatarGenerator.generateAvatar(size, user.getFirstName(), user.getLastName());

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

    public Resource getUserAvatar(User user) {

        String uploadDir = "./images/" + user.getUid().toString() + "/profile.png";
        Path path = Paths.get(uploadDir);

        try {
            if (Files.exists(path)) {
                return new UrlResource(path.toUri());
            }

            BufferedImage defaultAvatar = InitialAvatarGenerator.generateAvatar(200, user.getFirstName(), user.getLastName());

            ByteArrayOutputStream os = new ByteArrayOutputStream();
            ImageIO.write(defaultAvatar, "png", os);
            byte[] imageBytes = os.toByteArray();

            return new ByteArrayResource(imageBytes) {
                @Override
                public String getFilename() {
                    return "default_profile.png";
                }
            };
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }
}
