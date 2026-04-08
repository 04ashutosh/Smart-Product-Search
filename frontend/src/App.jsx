import React, { useState } from "react";
import SearchBar from "./components/SearchBar";
import ProductList from "./components/ProductList";
import SidebarFilters from "./components/SidebarFilters";
import { searchProducts, getAutoCompleteSuggestions } from "./api/searchApi";

function App() {
    const [products, setProducts] = useState([]);
    const [suggestions, setSuggestions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [hasSearched, setHasSearched] = useState(false);
    const [currentQuery, setCurrentQuery] = useState("");

    // Filter State
    const [filters, setFilters] = useState({
        category: [],
        maxPrice: 1000
    });

    React.useEffect(() => {
        if (!hasSearched) return;
        const fetchFiltered = async () => {
            setLoading(true);
            try {
                const results = await searchProducts(currentQuery, filters.category, filters.maxPrice, 0, 20);
                setProducts(results || []);
            } catch (error) {
                console.error("Filter Search Failed:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchFiltered();
    }, [filters]);

    const handleSearch = async (query) => {
        setHasSearched(true);
        setCurrentQuery(query);
        setLoading(true);

        try {
            console.log(`Making request to Spring Boot API: GET /api/search?q=${query}`);
            const results = await searchProducts(query, filters.category, filters.maxPrice, 0, 20);
            setProducts(results || []);
        } catch (error) {
            console.error("Search Failed:", error);
            setProducts([]);
        } finally {
            setLoading(false);
        }
    };

    const handleAutocomplete = async (prefix) => {
        try {
            const results = await getAutoCompleteSuggestions(prefix);
            const formatted = (results || []).map(p => ({
                id: p.id,
                name: p.name
            }));
            setSuggestions(formatted);
        } catch (error) {
            console.error("Autocomplete failed:", error);
            setSuggestions([]);
        }
    };

    const handleFilterChange = (e) => {
        const { name, value, checked, type } = e.target;
        if (type === 'checkbox') {
            setFilters(prev => {
                const currentCategories = prev.category || [];
                return {
                    ...prev,
                    [name]: checked
                        ? [...currentCategories, value.toLowerCase()]
                        : currentCategories.filter(c => c !== value.toLowerCase())
                };
            });
        } else if (type === 'range') {
            setFilters(prev => ({ ...prev, maxPrice: Number(value) }));
        }
    };



    return (
        <div className="app-container">
            <header className="header">
                <div style={{ display: 'flex', alignItems: 'center', gap: '2rem', width: '100%', maxWidth: '1200px' }}>
                    <div className="logo" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'white', fontWeight: 'bold', fontSize: '1.2rem' }}>
                        <span className="logo-icon">✨</span>
                        <span>LuminaSearch</span>
                    </div>
                    <div className="search-container" style={{ flexGrow: 1 }}>
                        <SearchBar
                            onSearch={handleSearch}
                            onAutocomplete={handleAutocomplete}
                            suggestions={suggestions}
                        />
                    </div>
                </div>
            </header>

            <main className="main-content">
                {hasSearched && <SidebarFilters onFilterChange={handleFilterChange} />}

                <div style={{ flexGrow: 1 }}>
                    <ProductList products={products} isLoading={loading} />
                </div>
            </main>
        </div>
    );
}

export default App;
