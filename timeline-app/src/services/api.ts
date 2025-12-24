import type { Person, Event } from '../types';

// This URL needs to be provided by the user after deployment
const API_URL = import.meta.env.VITE_API_URL || '';

export interface ApiResponse<T> {
    status: 'success' | 'error';
    data?: T;
    message?: string;
}

export interface SyncData {
    people: Person[];
    events: Event[];
}

export const api = {
    async fetchData(): Promise<SyncData | null> {
        if (!API_URL) {
            console.warn('API URL not set');
            return null;
        }

        try {
            const response = await fetch(`${API_URL}?format=json`);
            if (!response.ok) throw new Error('Network response was not ok');
            return await response.json();
        } catch (error) {
            console.error('Failed to fetch data:', error);
            return null;
        }
    },

    async addPerson(person: Omit<Person, 'id'>): Promise<ApiResponse<Person>> {
        return this.post('addPerson', person);
    },

    async addEvent(event: Omit<Event, 'id'>): Promise<ApiResponse<Event>> {
        return this.post('addEvent', event);
    },

    async post<T>(action: string, payload: any): Promise<ApiResponse<T>> {
        if (!API_URL) return { status: 'error', message: 'API URL not configured' };

        try {
            // CORS workaround for simple requests might be needed, but standard POST usually works with
            // correctly configured GAS Web Apps (ContentService.createTextOutput).
            // Sometimes 'no-cors' is used but that prevents reading response. 
            // We assume standard setup first.

            const response = await fetch(API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'text/plain;charset=utf-8', // GAS often requires text/plain to avoid preflight issues
                },
                body: JSON.stringify({ action, payload }),
            });

            return await response.json();

        } catch (error) {
            return { status: 'error', message: error instanceof Error ? error.message : 'Unknown error' };
        }
    }
};
