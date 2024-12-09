import { useState, useEffect } from 'react';
import { X, PlusIcon } from 'lucide-react';

function EditEventModal({ isOpen, onClose, onSubmit, event,isLoading }) {
    const [title, setTitle] = useState(event?.title || '');
    const [time, setTime] = useState(event?.time || '');
    const [content, setContent] = useState(event?.content || '');
    const [category, setCategory] = useState(event?.category || '');

    // Update state when event prop changes
    useEffect(() => {
        if (event) {
            setTitle(event.title);
            setTime(event.time);
            setContent(event.content);
            setCategory(event.category);
        }
    }, [event]);

    const categories = [
        'work', 
        'study', 
        'personal', 
        'health', 
        'social'
    ];

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!title || !time || !category) {
            alert('Please fill in all required fields');
            return;
        }

        const updatedEvent = {
            ...event,
            title,
            time,
            content,
            category
        };

        await onSubmit(updatedEvent);
        onClose();
    };

    if (!isOpen) return null;


    

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white rounded-xl p-8 w-full max-w-md relative">
                <button 
                    onClick={onClose} 
                    className="absolute top-4 right-4 text-slate-500 hover:text-slate-700"
                >
                    <X className="h-6 w-6" />
                </button>
                <h2 className="text-2xl font-bold mb-6">Edit Event</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block mb-2 text-sm font-medium">
                            Title
                        </label>
                        <input 
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="w-full px-3 py-2 border rounded-lg"
                            placeholder="Enter event title"
                            required
                        />
                    </div>
                    <div>
                        <label className="block mb-2 text-sm font-medium">
                            Time
                        </label>
                        <input 
                            type="time"
                            value={time}
                            onChange={(e) => setTime(e.target.value)}
                            className="w-full px-3 py-2 border rounded-lg"
                            required
                        />
                    </div>
                    <div>
                        <label className="block mb-2 text-sm font-medium">
                            Description
                        </label>
                        <textarea 
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            className="w-full px-3 py-2 border rounded-lg"
                            placeholder="Optional event description"
                            rows="3"
                        />
                    </div>
                    <div>
                        <label className="block mb-2 text-sm font-medium">
                            Category
                        </label>
                        <select 
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                            className="w-full px-3 py-2 border rounded-lg"
                            required
                        >
                            <option value="">Select a category</option>
                            {categories.map((cat) => (
                                <option key={cat} value={cat}>
                                    {cat.charAt(0).toUpperCase() + cat.slice(1)}
                                </option>
                            ))}
                        </select>
                    </div>
                    <button 
                        type="submit"
                        disabled={isLoading}
                        className="w-full flex items-center justify-center gap-2 bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition"
                    >
                        {isLoading ? 'Updating...' : 'Update Event'}
                    </button>
                </form>
            </div>
        </div>
    );
}

export default EditEventModal;