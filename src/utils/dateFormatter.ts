import { parseISO, format, formatDistanceToNow } from 'date-fns';

export const formatDate = (isoString: string, pattern = "MMM d, yyyy h:mm a") => {
    if (!isoString) return "";
    return format(parseISO(isoString), pattern);
};

export const formatRelative = (isoString: string) => {
    if (!isoString) return "";
    return formatDistanceToNow(parseISO(isoString), { addSuffix: true });
};