import Event from "./event";
import MiniEvent from "./MiniEvent";
//smaller version of the event to fit into the skinny weekly view columns. Took out description display
function WeeklyView({ events, deleteModal, editModal }) {
    // Get current week's dates
    console.log(events);
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
        // console.log(dates)
        return dates;
        
    };

    const weekDates = getCurrentWeekDates();
    console.log(weekDates)
    const debugDate = (date) => {
        return date.toISOString().split('T')[0];
    };

    return (
        <div className="bg-white rounded-xl shadow-sm p-0 sm:p-2">
            <div className="grid grid-cols-7 gap-0 md:gap-1">
                {weekDates.map((date, index) => (
                    <div key={index} className="border px-0 py-0">
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
                                console.log(eventDate==date)
                                return eventDate.toLocaleDateString('en-US', { weekday: 'short' }) === date.toLocaleDateString('en-US', { weekday: 'short' });
                            })
                            .map(event => (
                                <MiniEvent 
                                    event={event}
                                    key={event.id}
                                    onDelete={() => deleteModal(event.id)} 
                                    onUpdate={() => editModal(event)} 
                                   
                                />
                            ))}
                    </div>
                ))}
            </div>
        </div>
    );
}

export default WeeklyView;