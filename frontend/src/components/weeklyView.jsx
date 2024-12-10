function WeeklyView({ events }) {
    // Get current week's dates
    const getCurrentWeekDates = () => {
        const dates = [];
        const today = new Date();
        const monday = new Date(today);
        monday.setDate(monday.getDate() - monday.getDay() + 1);
        
        for (let i = 0; i < 7; i++) {
            const day = new Date(monday);
            day.setDate(monday.getDate() + i);
            dates.push(day);
        }
        return dates;
    };

    const weekDates = getCurrentWeekDates();

    return (
        <div className="bg-white rounded-xl shadow-sm p-0 sm:p-8">
            <div className="grid grid-cols-7 gap-4">
                {weekDates.map((date, index) => (
                    <div key={index} className="border p-4">
                        <h3 className="font-medium mb-2">
                            {date.toLocaleDateString('en-US', { weekday: 'short' })}
                        </h3>
                        <p className="text-sm text-slate-600 mb-4">
                            {date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                        </p>
                        {/* Filter and display events for this day */}
                        {events
                            .filter(event => {
                                const eventDate = new Date(event.created_at);
                                return eventDate.toDateString() === date.toDateString();
                            })
                            .map(event => (
                                <Event 
                                    key={event.id}
                                    event={event}
                                    compact={true} // You might want to create a compact version of the Event component
                                />
                            ))}
                    </div>
                ))}
            </div>
        </div>
    );
}

export default WeeklyView;