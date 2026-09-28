package com.quizbuilder.service;

import com.quizbuilder.entity.enums.MediaType;
import com.quizbuilder.exception.BadRequestException;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.*;
import java.util.UUID;

@Service
public class MediaService {

    @Value("${app.upload.dir:uploads}")
    private String uploadDir;

    public String storeFile(MultipartFile file) {
        if (file.isEmpty()) {
            throw new BadRequestException("Cannot upload empty file");
        }

        try {
            Path uploadPath = Paths.get(uploadDir).toAbsolutePath().normalize();
            if (!Files.exists(uploadPath)) {
                Files.createDirectories(uploadPath);
            }

            String originalFilename = StringUtils.cleanPath(file.getOriginalFilename());
            String fileExtension = "";
            int extIndex = originalFilename.lastIndexOf('.');
            if (extIndex >= 0) {
                fileExtension = originalFilename.substring(extIndex);
            }

            String newFilename = UUID.randomUUID().toString() + fileExtension;
            Path targetLocation = uploadPath.resolve(newFilename);
            Files.copy(file.getInputStream(), targetLocation, StandardCopyOption.REPLACE_EXISTING);

            return "/api/media/files/" + newFilename;
        } catch (IOException e) {
            throw new RuntimeException("Could not store file. Error: " + e.getMessage(), e);
        }
    }

    public MediaType determineMediaType(String contentType) {
        if (contentType == null) return MediaType.FILE;
        if (contentType.startsWith("image/")) return MediaType.IMAGE;
        if (contentType.startsWith("video/")) return MediaType.VIDEO;
        if (contentType.startsWith("audio/")) return MediaType.AUDIO;
        return MediaType.FILE;
    }
}
