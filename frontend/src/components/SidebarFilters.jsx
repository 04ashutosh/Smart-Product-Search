import React from 'react';

const SidebarFilters = ({ onFilterChange }) => {
    return (
        <aside className="sidebar-filters">
            <h3>Filters</h3>

            <div className="filter-group">
                <h4>Category</h4>
                <label className="checkbox-label">
                    <input type="checkbox" name="category" value="electronics" onChange={onFilterChange} />
                    <span className="checkbox-custom"></span>
                    Electronics
                </label>
                <label className="checkbox-label">
                    <input type="checkbox" name="category" value="home" onChange={onFilterChange} />
                    <span className="checkbox-custom"></span>
                    Home & Garden
                </label>
            </div>

            <div className="filter-group">
                <h4>Price Range</h4>
                <input type="range" min="0" max="1000" className="price-slider" />
                <div className="price-labels">
                    <span>$0</span>
                    <span>$1000+</span>
                </div>
            </div>
        </aside>
    );
};

export default SidebarFilters;
