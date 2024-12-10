function DeleteConfirmModal({ isOpen, onClose, onConfirm, eventTitle }) {
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white rounded-xl p-8 w-full max-w-md">
                <h2 className="text-2xl font-bold mb-4">Delete Event</h2>
                <p className="text-slate-600 mb-6">
                    {`Are you sure you want to delete ${eventTitle}? This action cannot be undone`}
                </p>
                <div className="flex gap-4 justify-end">
                    <button 
                        onClick={onClose}
                        className="px-4 py-2 text-slate-600 hover:text-slate-800"
                    >
                        Cancel
                    </button>
                    <button 
                        onClick={onConfirm}
                        className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                    >
                        Delete
                    </button>
                </div>
            </div>
        </div>
    );
}

export default DeleteConfirmModal;