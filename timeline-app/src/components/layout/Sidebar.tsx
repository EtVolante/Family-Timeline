import { LayoutDashboard, Plus, User } from 'lucide-react';
import { cn } from '../../lib/utils';
import type { Person } from '../../types';

interface SidebarProps {
    people: Person[];
    selectedPersonId: string | null; // null means 'All Events'
    onSelectPerson: (id: string | null) => void;
    onAddPerson: () => void;
}

export function Sidebar({ people, selectedPersonId, onSelectPerson, onAddPerson }: SidebarProps) {
    return (
        <div className="w-64 bg-white border-r border-gray-100 flex flex-col h-screen fixed left-0 top-0 z-10">
            <div className="p-6">
                <h1 className="text-xl font-bold text-gray-900 tracking-tight">Family Timeline</h1>
                <p className="text-xs text-gray-500 mt-1">Manage life events</p>
            </div>

            <div className="flex-1 overflow-y-auto px-4 py-2 space-y-6">
                <div>
                    <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3 px-2">
                        Overview
                    </h2>
                    <button
                        onClick={() => onSelectPerson(null)}
                        className={cn(
                            "w-full flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors text-sm font-medium",
                            selectedPersonId === null
                                ? "bg-blue-50 text-blue-700"
                                : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                        )}
                    >
                        <div className={cn(
                            "w-8 h-8 rounded-full flex items-center justify-center",
                            selectedPersonId === null ? "bg-blue-100 text-blue-600" : "bg-gray-100 text-gray-500"
                        )}>
                            <LayoutDashboard size={16} />
                        </div>
                        <span>All Events</span>
                    </button>
                </div>

                <div>
                    <div className="flex items-center justify-between px-2 mb-3">
                        <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                            People
                        </h2>
                        <button
                            onClick={onAddPerson}
                            className="text-gray-400 hover:text-blue-600 transition-colors"
                        >
                            <Plus size={16} />
                        </button>
                    </div>

                    <div className="space-y-1">
                        {people.map((person) => (
                            <button
                                key={person.id}
                                onClick={() => onSelectPerson(person.id)}
                                className={cn(
                                    "w-full flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors text-sm font-medium group",
                                    selectedPersonId === person.id
                                        ? "bg-blue-50 text-blue-700"
                                        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                                )}
                            >
                                <div className={cn(
                                    "w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold",
                                    person.color
                                )}>
                                    {person.name.charAt(0)}
                                </div>
                                <span className="truncate">{person.name}</span>
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            <div className="p-4 border-t border-gray-100">
                <div className="flex items-center space-x-3 px-2 py-2">
                    <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500">
                        <User size={16} />
                    </div>
                    <div className="text-sm">
                        <p className="font-medium text-gray-900">Admin User</p>
                        <p className="text-xs text-gray-500">View Only</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
