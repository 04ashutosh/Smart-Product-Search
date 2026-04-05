import React, { useEffect, useState } from "react";
import { Search } from "lucide-react";

const SearchBar = ({ onSearch, onAutocomplete, suggestions }) => {
    const [query, setQuery] = useState('');
    const [showSuggestions, setShowSuggestions] = useState(false);

    // Debounce for autocomplete
    useEffect(() => {
        const timer = setTimeout(() => {
            if (query.trim()) {
                onAutocomplete(query);
                setShowSuggestions(true);
            } else {
                setShowSuggestions(false);
            }
        }, 300);

        return () => clearTimeout(timer); // ✅ cleanup
    }, [query, onAutocomplete]);

    // ✅ Search submit
    const handleSearch = (e) => {
        e.preventDefault();
        setShowSuggestions(false);
        onSearch(query);
    };

    // ✅ Suggestion click
    const handleSuggestionClick = (suggestion) => {
        setQuery(suggestion.name);
        setShowSuggestions(false);
        onSearch(suggestion.name);
    };

    return (
        <div className="search-bar-container">
            <form onSubmit={handleSearch} className="search-form">
                <input 
                    type="text"
                    className="search-input"
                    placeholder="Search for products, categories, or brands..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onFocus={() => query && setShowSuggestions(true)}
                    onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                />
                <button type="submit" className="search-btn">
                    <Search size={20} />
                </button>
            </form>

            {showSuggestions && suggestions?.length > 0 && (
                <ul className="suggestions-dropdown">
                    {suggestions.map((item) => (
                        <li
                            key={item.id}
                            className="suggestion-item"
                            onClick={() => handleSuggestionClick(item)}
                        >
                            {item.name}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default SearchBar;