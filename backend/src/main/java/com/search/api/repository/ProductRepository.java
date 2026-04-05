package com.search.api.repository;

import com.search.api.model.Product;
import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProductRepository extends ElasticsearchRepository<Product, String> {
    //Spring Data Elasticsearch will automatically implement this lookup
    List<Product> findByCategory(String category);
}