import { useState, useEffect } from "react"
import api from "../api"
import { ClockIcon, Key, PlusIcon } from "lucide-react";
import Event from "../components/event";
import AddEventModal from "../components/addEvent";
import EditEventModal from "../components/editEvent";

//sample events to test without api
const sampleEvents = [
    {
        id: '1',
        title: 'CS Project Meeting',
        time: '10:00 AM',
        content: 'Discuss project milestone progress',
        category: 'study',
        created_at: new Date('2024-01-15T08:00:00')
    },
    {
        id: '2',
        title: 'Work Shift',
        time: '2:00 PM',
        content: 'Evening retail shift',
        category: 'work',
        created_at: new Date('2024-01-15T10:30:00')
    },
    {
        id: '3',
        title: 'Gym Workout',
        time: '6:00 PM',
        content: 'Strength training and cardio session',
        category: 'health',
        created_at: new Date('2024-01-15T12:45:00')
    },
    {
        id: '4',
        title: 'Dinner with Friends',
        time: '7:30 PM',
        content: 'Catch up and enjoy dinner at Mario\'s Bistro',
        category: 'social',
        created_at: new Date('2024-01-15T15:20:00')
    },
    {
        id: '5',
        title: 'Grocery Shopping',
        time: '5:00 PM',
        content: 'Pick up ingredients for weekly meal prep',
        category: 'personal',
        created_at: new Date('2024-01-15T16:10:00')
    }
];
//end of sample events

function Home() {
    const [events, setEvents] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [eventToEdit, setEventToEdit] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const [content, setContent] = useState("");
    const [time, setTime] = useState("");
    const [title, setTitle] = useState("");
    const [category, setCategory] = useState("");


    useEffect (() => {
        getEvents();
    }, []);

    const getEvents = () => {
        //update later
        setEvents(sampleEvents);

    }

    const deleteEvent = (id) => {
        console.log('testing delete')
        //placeholder
    }

    const createEvent = (newEvent) => {
        //placeholder
        setEvents([...events, newEvent]);
        console.log('testing create event')
    }

    //uncomment for real api calls
    // const createEvent = async (newEvent) => {
    //     try {
    //         // Remove the temporary ID before sending to the backend
    //         const { id, ...eventToSend } = newEvent;
            
    //         // Send the event to the Django backend
    //         const response = await api.post("/api/events/", eventToSend);
            
    //         // The backend should return the created event with a proper ID
    //         const createdEvent = response.data;
            
    //         // Update the local state with the event from the backend
    //         setEvents([...events, createdEvent]);
    //     } catch (error) {
    //         console.error("Failed to create event:", error);
    //         // Optionally, show an error message to the user
    //         alert("Failed to create event. Please try again.");
    //     }
    // }
  
   

    const handleUpdate = (updatedEvent) => {
        setEvents(events.map(event => 
            event.id === updatedEvent.id ? updatedEvent : event
        ));
        console.log('testing update event')
        //placeholder
    }
// update later when api is working
    // const handleUpdate = async (updatedEvent) => {
    //     setIsLoading(true);
    //     try {
    //         // When ready for API:
    //         // const response = await api.put(`/api/events/${updatedEvent.id}/`, updatedEvent);
    //         // const updatedEventFromServer = response.data;
            
    //         // For now, just update local state:
    //         setEvents(events.map(event => 
    //             event.id === updatedEvent.id ? updatedEvent : event
    //         ));
    //     } catch (error) {
    //         console.error("Failed to update event:", error);
    //         alert("Failed to update event. Please try again.");
    //     } finally {
    //         setIsLoading(false);
    //     }
    // };

    const openEditModal = (event) => {
        setEventToEdit(event);
        setIsEditModalOpen(true);
    };




    // use states to retrieve all the user data about events
    //api calls to get events, delete events, update events, create evetns
    return <div className="w-full max-w-[1440px] mx-auto px-0 py-0 sm:px-4 sm:py-8">
        <div className="flex items-center gap-6 mb-8">
            <a className="text-slate-600">Monthly View</a>
            <a className="text-blue-600 font-medium">Daily View</a>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-0 sm:p-8">
            <div className="flex justify-between items-center mb-8">
            <div className="flex items-center gap-4">
                <h1 className="text-2xl font-bold">
                Daily Schedule - Nov 15, 2024
                </h1>
                <ClockIcon className="h-6 w-6 text-slate-600" />
            </div>
            <button onClick={() =>setIsModalOpen(true)} className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-lg" data-prototypeId="2">
                <PlusIcon className="h-5 w-5" />
                Add Event
            </button>
 
            </div>

            <div className="space-y-6">
                {events.map((event) => (
                    <Event event={event} onDelete={deleteEvent} onUpdate={() => openEditModal(event)} key={event.id}  />
                ))}
            </div>
            <AddEventModal 
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSubmit={createEvent}
            />
            <EditEventModal 
                isOpen={isEditModalOpen}
                onClose={() => {
                    setIsEditModalOpen(false);
                    setEventToEdit(null);
                }}
                onSubmit={handleUpdate}
                event={eventToEdit}
                isLoading={isLoading}
            />
        </div>
    </div>;
}

export default Home