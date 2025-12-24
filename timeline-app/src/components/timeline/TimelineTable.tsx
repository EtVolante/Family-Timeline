import { format, parseISO } from 'date-fns';
import { calculateAge, calculateDuration } from '../../utils/dateUtils';
import type { Event, Person } from '../../types';
import { cn } from '../../lib/utils';

interface TimelineTableProps {
    events: Event[];
    peopleMap: Record<string, Person>;
}

export function TimelineTable({ events, peopleMap }: TimelineTableProps) {
    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                    <thead className="bg-gray-50 text-gray-500 font-medium border-b border-gray-100">
                        <tr>
                            <th className="px-6 py-4">Person</th>
                            <th className="px-6 py-4">Event</th>
                            <th className="px-6 py-4">Begin Date</th>
                            <th className="px-6 py-4">End Date</th>
                            <th className="px-6 py-4 w-1/3">Notes</th>
                            <th className="px-6 py-4 text-right">Since</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                        {events.map((event) => {
                            const person = peopleMap[event.personId];

                            return (
                                <tr
                                    key={event.id}
                                    className={cn(
                                        "transition-colors",
                                        // Apply subtle background if person has color, otherwise white
                                        person?.color ? person.color.replace('bg-', 'bg-opacity-20 bg-') : "bg-white",
                                        "hover:bg-opacity-30"
                                    )}
                                >
                                    <td className="px-6 py-4 font-medium text-gray-900">
                                        {person?.name || 'Unknown'}
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={cn(
                                            "px-2.5 py-1 rounded-full text-xs font-semibold border",
                                            event.type === 'Alive' ? "bg-green-50 text-green-700 border-green-100" :
                                                event.type === 'Married' ? "bg-pink-50 text-pink-700 border-pink-100" :
                                                    event.type === 'Work' ? "bg-blue-50 text-blue-700 border-blue-100" :
                                                        "bg-gray-50 text-gray-700 border-gray-100"
                                        )}>
                                            {event.title}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-gray-600 font-mono text-xs">
                                        {format(parseISO(event.startDate), 'M/d/yyyy')}
                                    </td>
                                    <td className="px-6 py-4 text-gray-600 font-mono text-xs">
                                        {event.endDate ? format(parseISO(event.endDate), 'M/d/yyyy') : 'Now'}
                                    </td>
                                    <td className="px-6 py-4 text-gray-600 max-w-xs truncate">
                                        {event.notes}
                                    </td>
                                    <td className="px-6 py-4 text-right font-mono text-xs font-medium text-gray-500">
                                        {event.type === 'Alive'
                                            ? calculateAge(event.startDate)
                                            : calculateDuration(event.startDate, event.endDate)}
                                    </td>
                                </tr>
                            );
                        })}

                        {events.length === 0 && (
                            <tr>
                                <td colSpan={6} className="px-6 py-12 text-center text-gray-400">
                                    No events found matching your criteria
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
