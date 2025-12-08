import { StorageAdapter, AppData } from '@focus-gtd/core';
import { Platform } from 'react-native';

const DATA_KEY = 'focus-gtd-data';

// Platform-specific storage implementation
const createStorage = (): StorageAdapter => {
    // Web platform - use localStorage
    if (Platform.OS === 'web') {
        return {
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
    }

    // Native platforms - use AsyncStorage
    const AsyncStorage = require('@react-native-async-storage/async-storage').default;
    return {
        getData: async (): Promise<AppData> => {
            try {
                const jsonValue = await AsyncStorage.getItem(DATA_KEY);
                return jsonValue != null ? JSON.parse(jsonValue) : { tasks: [], projects: [], settings: {} };
            } catch (e) {
                console.error('Failed to load data', e);
                return { tasks: [], projects: [], settings: {} };
            }
        },
        saveData: async (data: AppData): Promise<void> => {
            try {
                const jsonValue = JSON.stringify(data);
                await AsyncStorage.setItem(DATA_KEY, jsonValue);
            } catch (e) {
                console.error('Failed to save data', e);
            }
        },
    };
};

export const mobileStorage = createStorage();
