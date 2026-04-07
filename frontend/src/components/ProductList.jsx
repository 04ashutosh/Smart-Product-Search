import React from "react";
import ProductCard from './ProductCard';

const ProductList = ({products,isLoading})=>{
    if (isLoading){
        return(
            <div className="loading-state">
                <div className="spinner"></div>
                <p>Searching for products...</p>
            </div>
        );
    }

    if (!products || products.length===0){
        return(
            <div className="empty-state">
                <h2>No products found</h2>
                <p>Try adjusting your search or filters.</p>
            </div>
        );
    }

    return(
        <div className="product-list-grid">
            {products.map(product=>(
                <ProductCard key={product.id} product={product}/>
            ))}
        </div>
    );
};

export default ProductList;