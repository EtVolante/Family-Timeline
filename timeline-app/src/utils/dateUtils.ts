import { format, differenceInYears, differenceInMonths, parseISO } from 'date-fns';

export const formatDate = (dateStr: string): string => {
    if (!dateStr) return '';
    return format(parseISO(dateStr), 'M/d/yyyy');
};

export const calculateAge = (birthDateStr: string, endDateStr?: string): string => {
    const start = parseISO(birthDateStr);
    const end = endDateStr ? parseISO(endDateStr) : new Date();

    const years = differenceInYears(end, start);
    const months = differenceInMonths(end, start) % 12;

    return `${years} years and ${months} months old`;
};

export const calculateDuration = (startDateStr: string, endDateStr?: string): string => {
    const start = parseISO(startDateStr);
    const end = endDateStr ? parseISO(endDateStr) : new Date();

    const years = differenceInYears(end, start);
    const months = differenceInMonths(end, start) % 12;

    if (years === 0 && months === 0) return '0m';
    if (years === 0) return `${months}m`;
    if (months === 0) return `${years}y`;

    return `${years}y ${months}m`;
};
