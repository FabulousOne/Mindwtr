import { useCallback, useEffect, useState } from 'react';
import { generateUUID, type AppData, type ExternalCalendarSubscription } from '@mindwtr/core';
import { ExternalCalendarService } from '../../../lib/external-calendar-service';
import { reportError } from '../../../lib/report-error';

type UseCalendarSettingsOptions = {
    showSaved: () => void;
    settings: AppData['settings'] | undefined;
    updateSettings: (updates: Partial<AppData['settings']>) => Promise<void>;
};

export function useCalendarSettings({ showSaved, settings, updateSettings }: UseCalendarSettingsOptions) {
    const [externalCalendars, setExternalCalendars] = useState<ExternalCalendarSubscription[]>([]);
    const [newCalendarName, setNewCalendarName] = useState('');
    const [newCalendarUrl, setNewCalendarUrl] = useState('');
    const [calendarError, setCalendarError] = useState<string | null>(null);

    useEffect(() => {
        let cancelled = false;
        ExternalCalendarService.getCalendars()
            .then(async (stored) => {
                if (cancelled) return;
                if (Array.isArray(settings?.externalCalendars)) {
                    setExternalCalendars(settings.externalCalendars);
                    if (settings.externalCalendars.length || stored.length) {
                        await ExternalCalendarService.setCalendars(settings.externalCalendars);
                    }
                    return;
                }
                setExternalCalendars(stored);
            })
            .catch((error) => reportError('Failed to load calendars', error));
        return () => {
            cancelled = true;
        };
    }, [settings?.externalCalendars]);

    const persistCalendars = useCallback(async (next: ExternalCalendarSubscription[]) => {
        setCalendarError(null);
        setExternalCalendars(next);
        try {
            await ExternalCalendarService.setCalendars(next);
            await updateSettings({ externalCalendars: next });
            showSaved();
        } catch (error) {
            reportError('Failed to save calendars', error);
            setCalendarError(String(error));
        }
    }, [showSaved, updateSettings]);

    const handleAddCalendar = useCallback(() => {
        const url = newCalendarUrl.trim();
        if (!url) return;
        const name = (newCalendarName.trim() || 'Calendar').trim();
        const next = [
            ...externalCalendars,
            { id: generateUUID(), name, url, enabled: true },
        ];
        setNewCalendarName('');
        setNewCalendarUrl('');
        persistCalendars(next);
    }, [externalCalendars, newCalendarName, newCalendarUrl, persistCalendars]);

    const handleToggleCalendar = useCallback((id: string, enabled: boolean) => {
        const next = externalCalendars.map((calendar) => (calendar.id === id ? { ...calendar, enabled } : calendar));
        persistCalendars(next);
    }, [externalCalendars, persistCalendars]);

    const handleRemoveCalendar = useCallback((id: string) => {
        const next = externalCalendars.filter((calendar) => calendar.id !== id);
        persistCalendars(next);
    }, [externalCalendars, persistCalendars]);

    return {
        externalCalendars,
        newCalendarName,
        newCalendarUrl,
        calendarError,
        setNewCalendarName,
        setNewCalendarUrl,
        handleAddCalendar,
        handleToggleCalendar,
        handleRemoveCalendar,
    };
}
