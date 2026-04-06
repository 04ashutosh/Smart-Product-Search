import React, { useState } from "react";
import SearchBar from "./components/SearchBar";
import ProductCard from "./components/ProductCard";

function App(){
    const [products,setProducts] = useState([]);
    const [suggestions,setSuggestions] = useState([]);
    const [loading,setLoading] = useState(false);
    const [hasSearched, setHasSearched] = useState(false);

    //We will connect this to the real Axios API next.
    //For now, it handles the UI State correctly!
    const handleSearch = async (query) => {
        setHasSearched(true);
        setLoading(true);

        try{
            console.log(`Making request to Spring Boot API: GET/api/search?q=${query}`);
            //MOCK timeout until API is plugged in
            setTimeout(()=>{
                setProducts([
                    {
                        id: '1', name: 'Mock Smartphone X', brand: 'TechCorp', category: 'Electronics', 
                        description: 'Latest 5G smartphone with 120Hz display.', price: 899.99, rating: 4.8, availability: true 
                    }
                ]);
                setLoading(false);
            },500);
        }catch(error){
            console.error("Search Failed:",error);
            setLoading(false);
        }
    };

    const handleAutocomplete = async (prefix) => {
        try{
            console.log(`Making autocomplete to Spring Boot: /api/autocomplete?q=${prefix}`);
            //MOCK format
            setSuggestions([
                {id:'1',name:`${prefix} Smartphone`},
                {id:'2',name:`${prefix} Accessories`}
            ]);
        }catch(error){
            console.error(error);
        }
    };

    return(
        <div className="app-container">
            <header className="app-header">
                <div className="logo">
                    <span className="logo-icon">✨</span>
                    <h1>LuminaSearch</h1>
                </div>
                <div className="search-wrapper">
                    <SearchBar 
                        onSearch={handleSearch}
                        onAutocomplete={handleAutocomplete}
                        suggestions={suggestions}
                    />
                </div>
            </header>

            <main className="main-content">
                {loading && <div className="loader">Searching the catalog...</div>}
                {!loading && hasSearched && products.length===0 && (
                    <div className="no-results">
                        No products found. Try adjusting your search!
                    </div>
                )}

                {!loading && products.length>0 && (
                    <div className="product-grid">
                        {products.map(product => (
                            <ProductCard key={product.id} product={product}/>
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
}

export default App;