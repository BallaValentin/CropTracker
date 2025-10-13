package com.edu.bbte.allamvizsga.util;

import java.awt.*;
import java.awt.image.BufferedImage;
import java.util.Random;

public class InitialAvatarGenerator {
    public static BufferedImage generateAvatar(Integer size, String name) {
        BufferedImage image = new BufferedImage(size, size, BufferedImage.TYPE_4BYTE_ABGR);
        Graphics2D g2d = image.createGraphics();

        g2d.setRenderingHint(RenderingHints.KEY_ANTIALIASING, RenderingHints.VALUE_ANTIALIAS_ON);

        Color bgColor = getRandomColor();
        g2d.setColor(bgColor);
        g2d.fillOval(0, 0, size, size);

        String initial = name == null || name.isBlank() ? "?" : name.substring(0, 1).toUpperCase();

        g2d.setColor(Color.WHITE);
        Font font = new Font("SansSerif", Font.BOLD, size / 2);
        g2d.setFont(font);

        FontMetrics fontMetrics = g2d.getFontMetrics();
        int textWidth = fontMetrics.stringWidth(initial);
        int textHeight = fontMetrics.getAscent();
        int x = (size - textWidth) / 2;
        int y = (size + textHeight) / 2 - fontMetrics.getDescent();

        g2d.drawString(initial, x, y);
        g2d.dispose();

        return image;
    }

    private static Color getRandomColor() {
        Random random = new Random();
        float hue = random.nextFloat();
        float saturation = 0.7f;
        float brightness = 0.9f;
        return Color.getHSBColor(hue, saturation, brightness);
    }
}
