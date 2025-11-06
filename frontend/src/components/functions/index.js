export const formatDuration = (seconds) => {
    if (!seconds) return '';
    const numSeconds = typeof seconds === 'string' ? parseFloat(seconds) : seconds;
    const hours = Math.floor(numSeconds / 3600);
    const minutes = Math.floor((numSeconds % 3600) / 60);
    const secs = Math.floor(numSeconds % 60);

    if (hours > 0) {
        return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
};

export function formatDate(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now - date;

    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    const years = Math.floor(days / 365)

    if (years > 0) return `${years} day${years > 1 ? "s" : ""} ago`;
    if (days > 0) return `${days} day${days > 1 ? "s" : ""} ago`;
    if (hours > 0) return `${hours} hour${hours > 1 ? "s" : ""} ago`;
    if (minutes > 0) return `${minutes} minute${minutes > 1 ? "s" : ""} ago`;
    return "just now";
}

export function formatValue(val) {
    if (val < 1000) return val.toString()
    if (val < 1_000_000) return (val / 1000).toFixed(1).replace(/\.0$/, '') + 'K'
    if (val < 1_000_000_000) return (val / 1_000_000).toFixed(1).replace(/\.0$/, '') + 'M'
    return (val / 1_000_000_000).toFixed(1).replace(/\.0$/, '') + 'B'
} 