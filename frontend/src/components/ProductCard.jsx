import React from "react";

const ProductCard = ({product})=>{
    //Utility to render ElasticSearch highlighted text if it was matched
    const renderHighlighted = (text,field) => {
        //If your backend returns highlighted text wrapped in <em> tags
        if (product.highlightFields && product.highlightFields[field]){
            return <span dangerouslySetInnerHTML={{__html: product.highlightFields[field][0]}}/>;
        }
        return text;
    };

    return (
        <div className="product-card">
            <div className="product-header">
                <span className="product-category-tag">
                    {product.category}</span>
            </div>

            <div className="product-content">
                <h3 className="product-name">
                    {renderHighlighted(product.name, 'name')}
                </h3>
                <p className="product-brand">{product.brand}</p>
                <p className="product-desc">
                    {renderHighlighted(product.description,
                        'description'
                    )}
                </p>

                <div className="product-footer">
                    <div className="product-price">
                        ${product.price.toFixed(2)}
                    </div>
                    <div className="product-rating">
                        ⭐ {product.rating}
                    </div>
                </div>

                <button
                    className={`add-to-card-btn
                        ${!product.availability ? 'out-of-stock' : ''}`}
                        disabled={!product.availability}
                >
                    {product.availability ? 'Add to Cart' : 'Out of Stock'}
                </button>
            </div>
        </div>
    );
};

export default ProductCard;