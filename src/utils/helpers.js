import { format } from "date-fns";

export const ensureArray = (data) => {
    // If data is null/undefined, return an empty array
    if (!data) return [];

    // If data is already an array, return it
    if (Array.isArray(data)) return data;

    // If data is not an array, wrap it in an array
    return [data];
};

export const parseEventTime = (isoDateTime) => {
    const date = new Date(isoDateTime);
    return {
        day: date.getDate(),
        weekDay: date.getDay(),
        time: format(date, "HH:mm"),
        hour: date.getHours(),
        fullDate: date,
    };
};

export const formatTimeTo12Hour = (time) => {
    const [hours, minutes] = time.split(":");
    const hour = parseInt(hours, 10);
    const ampm = hour >= 12 ? "PM" : "AM";
    const adjustedHour = hour % 12 || 12;
    return `${adjustedHour}:${minutes} ${ampm}`;
};
