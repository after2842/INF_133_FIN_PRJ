import React from 'react';

function EventControls({ 
    selectedCategory, 
    setSelectedCategory, 
    isSortedByCategory, 
    setIsSortedByCategory, 
    categories 
}) {
    return (
        <div className="flex gap-4 mb-6">
            <div className="flex items-center gap-2">
                <label className="text-slate-600">Filter by:</label>
                <select 
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="border rounded-lg px-3 py-1"
                >
                    {categories.map(category => (
                        <option key={category} value={category}>
                            {category.charAt(0).toUpperCase() + category.slice(1)}
                        </option>
                    ))}
                </select>
            </div>
            
            <button 
                onClick={() => setIsSortedByCategory(!isSortedByCategory)}
                className={`px-4 py-1 rounded-lg border ${
                    isSortedByCategory 
                        ? 'bg-blue-500 text-white' 
                        : 'text-slate-600 hover:bg-slate-50'
                }`}
            >
                Sort by Category {isSortedByCategory ? '✓' : ''}
            </button>
        </div>
    );
}

export default EventControls;