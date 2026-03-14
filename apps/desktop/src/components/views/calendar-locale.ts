import { getLocalizedWeekdayLabels, resolveDateLocaleTag, type RecurrenceWeekday } from '@mindwtr/core';

const SUNDAY_FIRST_WEEKDAY_ORDER: RecurrenceWeekday[] = ['SU', 'MO', 'TU', 'WE', 'TH', 'FR', 'SA'];
const MONDAY_FIRST_WEEKDAY_ORDER: RecurrenceWeekday[] = ['MO', 'TU', 'WE', 'TH', 'FR', 'SA', 'SU'];
const MONTH_REFERENCE_DATES = Array.from({ length: 12 }, (_, index) => new Date(2024, index, 1, 12, 0, 0));

export function resolveCalendarLocale(params: {
    language?: string | null;
    dateFormat?: string | null;
    systemLocale?: string | null;
}): string {
    return resolveDateLocaleTag(params);
}

export function getCalendarWeekdayHeaders(locale: string, weekStartsOn: 0 | 1): string[] {
    const labels = getLocalizedWeekdayLabels(locale, 'short');
    const order = weekStartsOn === 1 ? MONDAY_FIRST_WEEKDAY_ORDER : SUNDAY_FIRST_WEEKDAY_ORDER;
    return order.map((weekday) => labels[weekday]);
}

export function getCalendarMonthNames(locale: string): string[] {
    try {
        const formatter = new Intl.DateTimeFormat(locale || 'en-US', { month: 'long' });
        return MONTH_REFERENCE_DATES.map((date) => formatter.format(date));
    } catch {
        const fallbackFormatter = new Intl.DateTimeFormat('en-US', { month: 'long' });
        return MONTH_REFERENCE_DATES.map((date) => fallbackFormatter.format(date));
    }
}
