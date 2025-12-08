import { StorageAdapter, AppData } from '@focus-gtd/core';

const DATA_KEY = 'focus-gtd-data';

// Web version using localStorage
export const mobileStorage: StorageAdapter = {
    getData: async (): Promise<AppData> => {
        try {
            if (typeof window === 'undefined') {
                return { tasks: [], projects: [], settings: {} };
            }
            const jsonValue = localStorage.getItem(DATA_KEY);
            return jsonValue != null ? JSON.parse(jsonValue) : { tasks: [], projects: [], settings: {} };
        } catch (e) {
            console.error('Failed to load data', e);
            return { tasks: [], projects: [], settings: {} };
        }
    },
    saveData: async (data: AppData): Promise<void> => {
        try {
            if (typeof window !== 'undefined') {
                const jsonValue = JSON.stringify(data);
                localStorage.setItem(DATA_KEY, jsonValue);
            }
        } catch (e) {
            console.error('Failed to save data', e);
        }
    },
};
