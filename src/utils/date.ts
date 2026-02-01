const TZ = 'Europe/Berlin' as const;

export function toLocal(dt: string | number | Date, tz: string = TZ): string {
    try {
        return new Intl.DateTimeFormat('de-DE', {
            dateStyle: 'medium',
            timeStyle: 'short',
            timeZone: tz,
        }).format(new Date(dt));
    } catch {
        return String(dt);
    }
}


/**
 * Formatiert ein Date in "YYYY-MM-DDTHH:mm" (lokale Zeit, ohne Sekunden),
 * passend für <input type="datetime-local">
 */
export function toLocalInputValue(d: Date): string {
    const pad = (n: number) => String(n).padStart(2, '0');
    const yyyy = d.getFullYear();
    const mm = pad(d.getMonth() + 1);
    const dd = pad(d.getDate());
    const hh = pad(d.getHours());
    const min = pad(d.getMinutes());
    return `${yyyy}-${mm}-${dd}T${hh}:${min}`;
}

/**
 * Parst "YYYY-MM-DDTHH:mm" (lokal) zurück in ISO-String.
 * Achtung: new Date(localStr) interpretiert lokal → danach .toISOString()
 */
export function localInputToISO(localStr: string): string {
    return new Date(localStr).toISOString();
}
