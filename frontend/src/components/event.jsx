function Event({event, onUpdate, onDelete}) {

    const formattedDate = new Date(event.created_at).toLocaleDateString("en-US")
    //insert method to get time in am pm

    //for the color bar on the left side of the event
    const categoryColors = {
        'work': 'bg-blue-500',
        'personal': 'bg-green-500',
        'study': 'bg-yellow-500',
        'health': 'bg-red-500',
        'social': 'bg-purple-500',
        'default': 'bg-slate-500'
    }

    // Get the color based on category, default to slate if not found
    const categoryColor = categoryColors[event.category?.toLowerCase()] || categoryColors['default']


    return <div className="flex gap-4">
        <div className={`w-1 ${categoryColor} rounded-full`}></div>
            <div className="flex-1">
                <div className="flex justify-between items-start">
                    <div>
                        <h3 className="text-lg font-semibold">{event.title}</h3>
                        <p className="text-slate-600 text-lg">{event.time}</p>
                        <p className="text-slate-500 mt-1">
                            {event.content}
                        </p>
                    </div>
                <div className="flex gap-3">
            <button className="text-blue-500" onClick={() => onUpdate(event.id)}>Edit</button>
            <button className="text-red-500" onClick={() => onDelete(event.id)}>Delete</button>
            </div>
        </div>
    </div>
</div>
}

export default Event;

//also have a note category that correpesonds to the color
//if we don't have enough time then we shouldn't worry about implemeting this

//also have unique id for each note
//also haver date created at
