export type Category = 'Home' | 'Work' | 'Health' | 'Education' | 'Travel' | 'Other' | 'Alive' | 'Married';

export interface Person {
    id: string;
    name: string;
    birthDate: string; // ISO date string YYYY-MM-DD
    color: string;
    avatar?: string;
}

export interface Event {
    id: string;
    personId: string;
    title: string; // e.g., "Alive", "Married", "Work"
    type: Category;
    startDate: string; // ISO date string YYYY-MM-DD
    endDate?: string; // Optional, defaults to now/ongoing logic if missing or future
    notes?: string;
}
