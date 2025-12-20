package com.research.backend;

import lombok.AllArgsConstructor;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@CrossOrigin("*")
@RequestMapping("/api/research")
@RequiredArgsConstructor
public class ResearchController {
   private final ResearchService researchService;

    @PostMapping("/process")
    public ResponseEntity<String> processContent(@RequestBody ResearchRequest request){
        if (request.getContent() == null || request.getContent().isBlank()) {
            return ResponseEntity.badRequest().body("Content cannot be empty");
        }
        String result = researchService.processContent(request);

        return  ResponseEntity.ok(result);
    }
}
