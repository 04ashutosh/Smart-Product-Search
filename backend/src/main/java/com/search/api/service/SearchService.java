package com.search.api.service;

import co.elastic.clients.elasticsearch._types.query_dsl.MatchQuery;
import co.elastic.clients.elasticsearch._types.query_dsl.MultiMatchQuery;
import co.elastic.clients.elasticsearch._types.query_dsl.Query;
import co.elastic.clients.elasticsearch._types.query_dsl.TextQueryType;
import com.search.api.model.Product;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.elasticsearch.client.elc.NativeQuery;
import org.springframework.data.elasticsearch.client.elc.NativeQueryBuilder;
import org.springframework.data.elasticsearch.core.ElasticsearchOperations;
import org.springframework.data.elasticsearch.core.SearchHit;
import org.springframework.data.elasticsearch.core.SearchHits;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class SearchService {
    private final ElasticsearchOperations elasticsearchOperations;

    public List<Product> searchProducts(String keyword,int page,int size){
        //Multi-match query against name, brand, category, description
        //Boosts matches found in name (^3) and brand (^2)

        Query query = MultiMatchQuery.of(m->m
                .query(keyword)
                .fields("name^3","brand^2","category^2","description")
                .type(TextQueryType.BestFields)
                .fuzziness("AUTO") //Handles fuzzy  types seamlessly
        )._toQuery();

        NativeQuery nativeQuery = new NativeQueryBuilder()
                .withQuery(query)
                .withPageable(PageRequest.of(page,size))
                .build();

        SearchHits<Product> searchHits = elasticsearchOperations.search(nativeQuery, Product.class);

        return searchHits.getSearchHits().stream()
                .map(SearchHit::getContent)
                .collect(Collectors.toList());
    }

    public List<Product> autocomplete(String prefix){
        //Prefix match for autocomplete
        Query query = MatchQuery.of(m->m
                .field("name")
                .query(prefix))._toQuery();

        NativeQuery nativeQuery = new NativeQueryBuilder()
                .withQuery(query)
                .withPageable(PageRequest.of(0,5)) //Return top 5 suggestions
                .build();

        SearchHits<Product> searchHits = elasticsearchOperations.search(nativeQuery, Product.class);

        return searchHits.getSearchHits().stream()
                .map(SearchHit :: getContent)
                .collect(Collectors.toList());
    }
}