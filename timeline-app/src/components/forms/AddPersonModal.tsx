import { useState } from 'react';
import { X } from 'lucide-react';
import type { Person } from '../../types';

interface AddPersonModalProps {
    isOpen: boolean;
    onClose: () => void;
    onAdd: (person: Omit<Person, 'id'>) => void;
}

export function AddPersonModal({ isOpen, onClose, onAdd }: AddPersonModalProps) {
    const [name, setName] = useState('');
    const [birthDate, setBirthDate] = useState('');
    const [color, setColor] = useState('bg-blue-100');

    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onAdd({
            name,
            birthDate,
            color,
        });
        onClose();
        setName('');
        setBirthDate('');
    };

    const colors = [
        'bg-blue-100', 'bg-green-100', 'bg-yellow-100',
        'bg-red-100', 'bg-purple-100', 'bg-pink-100', 'bg-orange-100'
    ];

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white rounded-xl shadow-lg w-full max-w-md mx-4 overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                    <h3 className="font-semibold text-gray-900">Add New Person</h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                        <input
                            type="text"
                            required
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                            placeholder="e.g. Jane Doe"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Birth Date</label>
                        <input
                            type="date"
                            required
                            value={birthDate}
                            onChange={(e) => setBirthDate(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Color Theme</label>
                        <div className="flex gap-2 flex-wrap">
                            {colors.map((c) => (
                                <button
                                    key={c}
                                    type="button"
                                    onClick={() => setColor(c)}
                                    className={`w-8 h-8 rounded-full border-2 ${c} ${color === c ? 'border-primary ring-2 ring-primary/20' : 'border-transparent'}`}
                                />
                            ))}
                        </div>
                    </div>

                    <div className="pt-4 flex justify-end space-x-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-lg"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg"
                        >
                            Add Person
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
