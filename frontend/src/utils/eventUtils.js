export const filterEventsByCategory = (events, selectedCategory) => {
    return selectedCategory === 'all' 
        ? events 
        : events.filter(event => event.category === selectedCategory);
};

export const sortEventsByCategory = (events, shouldSort) => {
    return shouldSort 
        ? [...events].sort((a, b) => a.category.localeCompare(b.category))
        : events;
};

export const getUniqueCategories = (events) => {
    return ['all', ...new Set(events.map(event => event.category))];
};