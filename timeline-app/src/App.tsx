import { useState, useMemo, useEffect } from 'react';
import { Plus, RefreshCw, CheckCircle, AlertCircle } from 'lucide-react';
import { Layout } from './components/layout/Layout';
import { Sidebar } from './components/layout/Sidebar';
import { TimelineTable } from './components/timeline/TimelineTable';
import { FilterBar } from './components/timeline/FilterBar';
import { AddPersonModal } from './components/forms/AddPersonModal';
import { AddEventModal } from './components/forms/AddEventModal';
import { events as mockEvents, people as mockPeople } from './data/mockData';
import { api } from './services/api';
import { storage } from './services/storage';
import type { Person, Event } from './types';
import { cn } from './lib/utils';

type SyncStatus = 'idle' | 'syncing' | 'success' | 'error';

function App() {
  // Initialize from cache or fallback to empty (or mock if preferred for demo)
  const [people, setPeople] = useState<Person[]>(() => storage.getPeople() || mockPeople);
  const [events, setEvents] = useState<Event[]>(() => storage.getEvents() || mockEvents);

  const [selectedPersonId, setSelectedPersonId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('All Events');

  const [isAddPersonOpen, setIsAddPersonOpen] = useState(false);
  const [isAddEventOpen, setIsAddEventOpen] = useState(false);

  const [syncStatus, setSyncStatus] = useState<SyncStatus>('idle');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    syncData();
  }, []);

  const syncData = async () => {
    setSyncStatus('syncing');
    setErrorMessage(null);

    const data = await api.fetchData();

    if (data) {
      // Update state
      setPeople(data.people);
      setEvents(data.events);

      // Update cache
      storage.savePeople(data.people);
      storage.saveEvents(data.events);
      storage.setLastSync(Date.now());

      setSyncStatus('success');
      setTimeout(() => setSyncStatus('idle'), 3000);
    } else {
      // If no data returned (e.g. API URL not set or network error), 
      // check if we have cached data to stay in 'success' mode visually if functional,
      // or show error if we strictly need online.
      // For now, if we have cache, we are 'offline' but functional.
      if (storage.getPeople()) {
        setSyncStatus('idle'); // Just stay idle with cached data
      } else {
        setSyncStatus('error');
        setErrorMessage('Could not connect to Google Sheets');
      }
    }
  };

  const peopleMap = useMemo(() => {
    return people.reduce((acc, person) => {
      acc[person.id] = person;
      return acc;
    }, {} as Record<string, Person>);
  }, [people]);

  const filteredEvents = useMemo(() => {
    return events.filter((event) => {
      // Filter by person
      if (selectedPersonId && event.personId !== selectedPersonId) {
        return false;
      }

      // Filter by type
      if (selectedType !== 'All Events' && event.type !== selectedType) {
        return false;
      }

      // Filter by search term
      if (searchTerm) {
        const term = searchTerm.toLowerCase();
        const personName = peopleMap[event.personId]?.name.toLowerCase() || '';
        const notes = event.notes?.toLowerCase() || '';
        const title = event.title.toLowerCase();

        return (
          personName.includes(term) ||
          notes.includes(term) ||
          title.includes(term)
        );
      }

      return true;
    }).sort((a, b) => {
      // Default sort by date desc
      return new Date(a.startDate).getTime() - new Date(b.startDate).getTime();
    });
  }, [events, selectedPersonId, selectedType, searchTerm, peopleMap]);

  const handleAddPerson = async (newPersonData: Omit<Person, 'id'>) => {
    // 1. Optimistic Update
    const tempId = Math.random().toString(36).substr(2, 9);
    const newPerson: Person = { ...newPersonData, id: tempId };
    const updatedPeople = [...people, newPerson];

    setPeople(updatedPeople);
    storage.savePeople(updatedPeople);

    // 2. Sync to Backend
    setSyncStatus('syncing');
    const result = await api.addPerson(newPersonData);

    if (result.status === 'success') {
      setSyncStatus('success');
      // In a real app, we might replace the tempId with the server ID here if the backend generated it
      // But for this simple implementation we might rely on the next fetchSync to align everything
      // or we just trust the sync.

      // Trigger a re-sync to be safe and get canonical IDs if GAS generates them
      // syncData(); 
    } else {
      setSyncStatus('error');
      setErrorMessage(result.message || 'Failed to save person');
      // Revert optimistic update? Or just show error?
      // For now, keep it local.
    }
    setTimeout(() => setSyncStatus('idle'), 3000);
  };

  const handleAddEvent = async (newEventData: Omit<Event, 'id'>) => {
    // 1. Optimistic Update
    const tempId = Math.random().toString(36).substr(2, 9);
    const newEvent: Event = { ...newEventData, id: tempId };
    const updatedEvents = [...events, newEvent];

    setEvents(updatedEvents);
    storage.saveEvents(updatedEvents);

    // 2. Sync to Backend
    setSyncStatus('syncing');
    const result = await api.addEvent(newEventData);

    if (result.status === 'success') {
      setSyncStatus('success');
    } else {
      setSyncStatus('error');
      setErrorMessage(result.message || 'Failed to save event');
    }
    setTimeout(() => setSyncStatus('idle'), 3000);
  };

  return (
    <Layout
      sidebar={
        <Sidebar
          people={people}
          selectedPersonId={selectedPersonId}
          onSelectPerson={setSelectedPersonId}
          onAddPerson={() => setIsAddPersonOpen(true)}
        />
      }
    >
      {/* Header Area */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {selectedPersonId
              ? `${peopleMap[selectedPersonId]?.name}'s Timeline`
              : 'Family Timeline'}
          </h1>
          <div className="flex items-center space-x-3 mt-1">
            <p className="text-gray-500 text-sm">
              {filteredEvents.length} events found
            </p>

            {/* Sync Status Badge */}
            <div className="flex items-center space-x-1.5 px-2 py-0.5 rounded-full bg-gray-100 border border-gray-200">
              {syncStatus === 'syncing' && <RefreshCw className="w-3 h-3 text-blue-500 animate-spin" />}
              {syncStatus === 'success' && <CheckCircle className="w-3 h-3 text-green-500" />}
              {syncStatus === 'error' && <AlertCircle className="w-3 h-3 text-red-500" />}
              {syncStatus === 'idle' && <div className="w-1.5 h-1.5 rounded-full bg-gray-400" />}

              <span className={cn(
                "text-xs font-medium",
                syncStatus === 'error' ? "text-red-600" : "text-gray-500"
              )}>
                {syncStatus === 'syncing' ? 'Syncing...' :
                  syncStatus === 'error' ? 'Offline' :
                    syncStatus === 'success' ? 'Synced' : 'Ready'}
              </span>
            </div>

            {errorMessage && (
              <span className="text-xs text-red-500">{errorMessage}</span>
            )}
          </div>
        </div>

        <div className="flex space-x-3">
          <button
            onClick={() => syncData()}
            className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
            title="Force Sync"
          >
            <RefreshCw size={18} />
          </button>
          <button
            onClick={() => setIsAddEventOpen(true)}
            className="inline-flex items-center px-4 py-2 bg-gray-900 hover:bg-gray-800 text-white text-sm font-medium rounded-lg transition-colors shadow-sm"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Event
          </button>
        </div>
      </div>

      <FilterBar
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        selectedType={selectedType}
        onTypeChange={setSelectedType}
        onClear={() => {
          setSearchTerm('');
          setSelectedType('All Events');
        }}
      />

      <TimelineTable
        events={filteredEvents}
        peopleMap={peopleMap}
      />

      <AddPersonModal
        isOpen={isAddPersonOpen}
        onClose={() => setIsAddPersonOpen(false)}
        onAdd={handleAddPerson}
      />

      <AddEventModal
        isOpen={isAddEventOpen}
        onClose={() => setIsAddEventOpen(false)}
        onAdd={handleAddEvent}
        people={people}
        initialPersonId={selectedPersonId}
      />
    </Layout>
  );
}

export default App;
