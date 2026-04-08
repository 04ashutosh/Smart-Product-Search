package com.search.api.controller;

import com.search.api.model.Product;
import com.search.api.service.SearchService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/search")
@RequiredArgsConstructor
public class SearchController {
    private final SearchService searchService;

    @GetMapping
    public ResponseEntity<List<Product>> searchProducts(
            @RequestParam(required = false, defaultValue = "") String q,
            @RequestParam(required = false) List<String> categories,
            @RequestParam(required = false) Double maxPrice,
            @RequestParam(required = false, defaultValue = "0") int page,
            @RequestParam(required = false, defaultValue = "20") int size){

        List<Product> results = searchService.searchProducts(q, categories, maxPrice, page, size);
        return ResponseEntity.ok(results);
    }

    @GetMapping("/autocomplete")
    public ResponseEntity<List<Product>> autocomplete(@RequestParam String q){
        List<Product> suggestions = searchService.autocomplete(q);
        return ResponseEntity.ok(suggestions);
    }
}