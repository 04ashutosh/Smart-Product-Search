// backend/src/main/java/com/search/api/service/SearchService.java
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

    public List<Product> searchProducts(String keyword, List<String> categories, Double maxPrice, int page, int size){
        co.elastic.clients.elasticsearch._types.query_dsl.BoolQuery.Builder boolBuilder =
                new co.elastic.clients.elasticsearch._types.query_dsl.BoolQuery.Builder();

        // 1. Text Search (MultiMatch)
        if (keyword != null && !keyword.trim().isEmpty()) {
            boolBuilder.must(MultiMatchQuery.of(m->m
                    .query(keyword)
                    .fields("name^3","brand^2","category^2","description")
                    .type(TextQueryType.BestFields)
                    .fuzziness("AUTO")
            )._toQuery());
        }

        // 2. Categories Filter (Should match at least one if provided)
        if (categories != null && !categories.isEmpty()) {
            co.elastic.clients.elasticsearch._types.query_dsl.BoolQuery.Builder categoryBool =
                    new co.elastic.clients.elasticsearch._types.query_dsl.BoolQuery.Builder();
            for (String category : categories) {
                categoryBool.should(MatchQuery.of(m -> m.field("category").query(category))._toQuery());
            }
            categoryBool.minimumShouldMatch("1");
            boolBuilder.filter(categoryBool.build()._toQuery());
        }

        // 3. Max Price Filter
        if (maxPrice != null && maxPrice > 0) {
            boolBuilder.filter(co.elastic.clients.elasticsearch._types.query_dsl.RangeQuery.of(r -> r
                    .field("price")
                    .lte(co.elastic.clients.json.JsonData.of(maxPrice))
            )._toQuery());
        }

        NativeQuery nativeQuery = new NativeQueryBuilder()
                .withQuery(boolBuilder.build()._toQuery())
                .withPageable(PageRequest.of(page,size))
                .build();

        SearchHits<Product> searchHits = elasticsearchOperations.search(nativeQuery, Product.class);

        return searchHits.getSearchHits().stream()
                .map(SearchHit::getContent)
                .collect(Collectors.toList());
    }

    public List<Product> autocomplete(String prefix){
        Query query = MatchQuery.of(m->m
                .field("name")
                .query(prefix))._toQuery();

        NativeQuery nativeQuery = new NativeQueryBuilder()
                .withQuery(query)
                .withPageable(PageRequest.of(0,5))
                .build();

        SearchHits<Product> searchHits = elasticsearchOperations.search(nativeQuery, Product.class);

        return searchHits.getSearchHits().stream()
                .map(SearchHit :: getContent)
                .collect(Collectors.toList());
    }
}
