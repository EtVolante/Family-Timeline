import { Search, X } from 'lucide-react';

interface FilterBarProps {
    searchTerm: string;
    onSearchChange: (value: string) => void;
    selectedType: string;
    onTypeChange: (value: string) => void;
    onClear: () => void;
}

export function FilterBar({
    searchTerm,
    onSearchChange,
    selectedType,
    onTypeChange,
    onClear
}: FilterBarProps) {
    const eventTypes = ['All Events', 'Alive', 'Married', 'Work', 'Home', 'Education'];

    return (
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-6 flex flex-wrap gap-4 items-center">

            {/* Search Input */}
            <div className="relative flex-1 min-w-[200px]">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-4 w-4 text-gray-400" />
                </div>
                <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => onSearchChange(e.target.value)}
                    placeholder="Search events, notes, or people..."
                    className="block w-full pl-10 pr-3 py-2 border border-gray-200 rounded-lg leading-5 bg-gray-50 placeholder-gray-400 focus:outline-none focus:bg-white focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-colors"
                />
            </div>

            {/* Event Type Dropdown */}
            <div className="w-full sm:w-auto">
                <select
                    value={selectedType}
                    onChange={(e) => onTypeChange(e.target.value)}
                    className="block w-full pl-3 pr-10 py-2 text-base border-gray-200 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-lg bg-gray-50"
                >
                    {eventTypes.map((type) => (
                        <option key={type} value={type}>
                            {type}
                        </option>
                    ))}
                </select>
            </div>

            {/* Clear Button */}
            {(searchTerm || selectedType !== 'All Events') && (
                <button
                    onClick={onClear}
                    className="flex items-center px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-600 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                >
                    <X className="h-4 w-4 mr-2" />
                    Clear
                </button>
            )}
        </div>
    );
}
