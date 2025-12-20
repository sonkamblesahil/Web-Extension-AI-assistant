package com.research.backend;

import com.google.genai.Client;
import com.google.genai.types.GenerateContentResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
public class ResearchService {

    private final Client client;

    public ResearchService(@Value("${gemini.api.key}") String apiKey) {
        this.client = Client.builder()
                .apiKey(apiKey)
                .build();
        try {
            System.out.println("--- LISTING AVAILABLE MODELS ---");
            // Pager implements Iterable, so we can use forEach directly
            client.models.list(null).forEach(model -> {
                System.out.println("Model Name: " + model.name());
            });
            System.out.println("--------------------------------");
        } catch (Exception e) {
            System.err.println("Failed to list models: " + e.getMessage());
            e.printStackTrace(); // This will help us see if it's an Auth error
        }
    }

    public String processContent(ResearchRequest request) {
        String prompt = buildPrompt(request);

        GenerateContentResponse response = client.models.generateContent(
                "gemini-2.5-flash",
                prompt,
                null
        );

        return response.text();
    }

    private String buildPrompt(ResearchRequest request) {
        StringBuilder prompt = new StringBuilder();
        switch (request.getOperation().toLowerCase()) {
            case "summarize":
                prompt.append("Provide a concise summary of the following text: \n\n");
                break;
            case "suggest":
                prompt.append(
                        "Based on the following content, suggest related topics and further reading. " +
                                "Format the result with clear headings and bullet points: \n\n"
                );
                break;
            default:
                throw new IllegalArgumentException("Unknown Operation: " + request.getOperation());
        }
        prompt.append(request.getContent());
        return prompt.toString();
    }
}
