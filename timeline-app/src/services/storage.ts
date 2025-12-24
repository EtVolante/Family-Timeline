import type { Person, Event } from '../types';

const STORAGE_KEY_PEOPLE = 'timeline_people';
const STORAGE_KEY_EVENTS = 'timeline_events';
const STORAGE_KEY_LAST_SYNC = 'timeline_last_sync';

export const storage = {
    getPeople(): Person[] | null {
        try {
            const data = localStorage.getItem(STORAGE_KEY_PEOPLE);
            return data ? JSON.parse(data) : null;
        } catch {
            return null;
        }
    },

    savePeople(people: Person[]) {
        localStorage.setItem(STORAGE_KEY_PEOPLE, JSON.stringify(people));
    },

    getEvents(): Event[] | null {
        try {
            const data = localStorage.getItem(STORAGE_KEY_EVENTS);
            return data ? JSON.parse(data) : null;
        } catch {
            return null;
        }
    },

    saveEvents(events: Event[]) {
        localStorage.setItem(STORAGE_KEY_EVENTS, JSON.stringify(events));
    },

    setLastSync(timestamp: number) {
        localStorage.setItem(STORAGE_KEY_LAST_SYNC, timestamp.toString());
    },

    getLastSync(): number | null {
        const data = localStorage.getItem(STORAGE_KEY_LAST_SYNC);
        return data ? parseInt(data, 10) : null;
    }
};
