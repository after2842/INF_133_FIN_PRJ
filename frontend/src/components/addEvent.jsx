import { useState } from 'react';
import { X, PlusIcon } from 'lucide-react';

function AddEventModal({ isOpen, onClose, onSubmit }) {
    const [title, setTitle] = useState('');
    const [time, setTime] = useState('');
    const [content, setContent] = useState('');
    const [category, setCategory] = useState('');

    const categories = [
        'work', 
        'study', 
        'personal', 
        'health', 
        'social'
    ];

    const handleSubmit = (e) => {
        e.preventDefault();
        
        // Basic validation
        if (!title || !time || !category) {
            alert('Please fill in all required fields');
            return;
        }

        const newEvent = {
            id: Math.random().toString(36).substr(2, 9), // Generate a temporary ID
            title,
            time,
            content,
            category,
            created_at: new Date()
        };

        onSubmit(newEvent);
        
        // Reset form
        setTitle('');
        setTime('');
        setContent('');
        setCategory('');
        
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
                <h2 className="text-2xl font-bold mb-6">Add New Event</h2>
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
                        className="w-full flex items-center justify-center gap-2 bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition"
                    >
                        <PlusIcon className="h-5 w-5" />
                        Add Event
                    </button>
                </form>
            </div>
        </div>
    );
}

export default AddEventModal;