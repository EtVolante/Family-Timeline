import type { Person, Event } from '../types';

export const people: Person[] = [
    { id: '1', name: 'Howard Lenos', birthDate: '1963-04-28', color: 'bg-blue-100' },
    { id: '2', name: 'Joanne Lenos', birthDate: '1965-10-17', color: 'bg-pink-100' },
    { id: '3', name: 'Karla Magee', birthDate: '1988-07-01', color: 'bg-purple-100' },
    { id: '4', name: 'Josiah Lenos', birthDate: '1990-06-06', color: 'bg-green-100' },
    { id: '5', name: 'Jared Lenos', birthDate: '1992-01-10', color: 'bg-yellow-100' },
    { id: '6', name: 'Derek Lenos', birthDate: '1994-01-30', color: 'bg-orange-100' },
];

export const events: Event[] = [
    // Alive events (Background events)
    { id: 'e1', personId: '1', title: 'Alive', type: 'Alive', startDate: '1963-04-28', notes: '62 years and 7 months old' },
    { id: 'e2', personId: '2', title: 'Alive', type: 'Alive', startDate: '1965-10-17', notes: '60 years and 2 months old' },

    // Married
    { id: 'e3', personId: '1', title: 'Married', type: 'Married', startDate: '1986-06-06', notes: 'Joanne Lenos' },
    { id: 'e4', personId: '2', title: 'Married', type: 'Married', startDate: '1986-06-06', notes: 'Howard Lenos' },

    // Kids Alive
    { id: 'e5', personId: '3', title: 'Alive', type: 'Alive', startDate: '1988-07-01', notes: '37 years and 5 months old' },
    { id: 'e6', personId: '4', title: 'Alive', type: 'Alive', startDate: '1990-06-06', notes: '35 years and 6 months old' },
    { id: 'e7', personId: '5', title: 'Alive', type: 'Alive', startDate: '1992-01-10', notes: '33 years and 11 months old' },
    { id: 'e8', personId: '6', title: 'Alive', type: 'Alive', startDate: '1994-01-30', notes: '31 years and 10 months old' },

    // Work/Home
    { id: 'e9', personId: '1', title: 'Home', type: 'Home', startDate: '1998-07-24', notes: '243 Stonybrook Drive, Kitchener, ON' },
    { id: 'e10', personId: '1', title: 'Work', type: 'Work', startDate: '2005-12-01', notes: 'Volante' },
    { id: 'e11', personId: '2', title: 'Work', type: 'Work', startDate: '2005-12-01', notes: 'Volante' },
];
