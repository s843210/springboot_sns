package com.asdf.minlog.controller;

import io.swagger.v3.oas.annotations.Operation;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Map;
import java.util.UUID;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/v2/upload")
public class UploadController {

  // 업로드 디렉토리 (프로젝트 루트 기준)
  private static final String UPLOAD_DIR = "uploads/";

  @PostMapping("/image")
  @Operation(summary = "이미지 업로드")
  public ResponseEntity<?> uploadImage(@RequestParam("file") MultipartFile file) {
    if (file.isEmpty()) {
      return ResponseEntity.badRequest().body("파일이 비어있습니다.");
    }

    String original = file.getOriginalFilename();
    String ext = (original != null && original.contains("."))
        ? original.substring(original.lastIndexOf("."))
        : ".jpg";

    // 중복 방지: UUID로 파일명 생성
    String filename = UUID.randomUUID() + ext;

    try {
      Path uploadPath = Paths.get(UPLOAD_DIR).toAbsolutePath().normalize();
      if (!Files.exists(uploadPath)) {
        Files.createDirectories(uploadPath);
      }
      file.transferTo(uploadPath.resolve(filename).toFile());
    } catch (IOException e) {
      return ResponseEntity.internalServerError().body("파일 저장 실패: " + e.getMessage());
    }

    // 프론트에서 접근 가능한 URL 반환
    String imageUrl = "/uploads/" + filename;
    return ResponseEntity.ok(Map.of("imageUrl", imageUrl));
  }
}
