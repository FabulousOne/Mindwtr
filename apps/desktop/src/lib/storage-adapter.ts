import { StorageAdapter, AppData } from '@focus-gtd/core';

export const electronStorage: StorageAdapter = {
    getData: async (): Promise<AppData> => {
        return window.electronAPI.getData();
    },
    saveData: async (data: AppData): Promise<void> => {
        await window.electronAPI.saveData(data);
    },
};
