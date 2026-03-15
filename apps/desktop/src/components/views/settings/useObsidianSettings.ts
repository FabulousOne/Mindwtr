import { useCallback, useEffect, useMemo, useState } from 'react';

import {
    normalizeObsidianScanFolders,
    ObsidianService,
} from '../../../lib/obsidian-service';
import { useObsidianStore } from '../../../store/obsidian-store';
import { useUiStore } from '../../../store/ui-store';

type UseObsidianSettingsOptions = {
    isTauri: boolean;
    showSaved: () => void;
    selectVaultFolderTitle: string;
};

const toErrorMessage = (error: unknown, fallback: string): string => {
    if (error instanceof Error && error.message.trim()) return error.message.trim();
    const text = String(error || '').trim();
    return text || fallback;
};

const parseScanFoldersInput = (value: string): string[] => {
    return normalizeObsidianScanFolders(
        value
            .split(/\r?\n|,/)
            .map((item) => item.trim())
            .filter(Boolean)
    );
};

export const useObsidianSettings = ({
    isTauri,
    showSaved,
    selectVaultFolderTitle,
}: UseObsidianSettingsOptions) => {
    const showToast = useUiStore((state) => state.showToast);
    const config = useObsidianStore((state) => state.config);
    const hasVaultMarker = useObsidianStore((state) => state.hasVaultMarker);
    const isScanning = useObsidianStore((state) => state.isScanning);
    const refreshConfig = useObsidianStore((state) => state.refreshConfig);
    const saveConfig = useObsidianStore((state) => state.saveConfig);
    const removeConfig = useObsidianStore((state) => state.removeConfig);
    const scan = useObsidianStore((state) => state.scan);

    const [vaultPath, setVaultPath] = useState('');
    const [enabled, setEnabled] = useState(false);
    const [scanFoldersText, setScanFoldersText] = useState('/');
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        void refreshConfig();
    }, [refreshConfig]);

    useEffect(() => {
        setVaultPath(config.vaultPath ?? '');
        setEnabled(config.enabled);
        setScanFoldersText(config.scanFolders.join('\n'));
    }, [config.enabled, config.scanFolders, config.vaultPath]);

    const hasConfiguredVault = Boolean((vaultPath || '').trim());

    const vaultWarning = useMemo(() => {
        if (!hasConfiguredVault) return null;
        if (hasVaultMarker === null || hasVaultMarker) return null;
        return 'The selected folder does not contain a .obsidian directory. You can still save it if your vault layout is unconventional.';
    }, [hasConfiguredVault, hasVaultMarker]);

    const handleBrowseVault = useCallback(async () => {
        if (!isTauri) return;
        try {
            const { open } = await import('@tauri-apps/plugin-dialog');
            const selected = await open({
                directory: true,
                multiple: false,
                title: selectVaultFolderTitle,
            });
            if (!selected || typeof selected !== 'string') return;
            setVaultPath(selected);
            const inspection = await ObsidianService.inspectVault(selected);
            if (!inspection.hasObsidianDir) {
                showToast(
                    'The selected folder does not contain a .obsidian directory. You can still save it if your vault layout is unconventional.',
                    'info',
                    5000
                );
            }
        } catch (error) {
            showToast(toErrorMessage(error, 'Failed to choose Obsidian vault folder.'), 'error');
        }
    }, [isTauri, selectVaultFolderTitle, showToast]);

    const handleSave = useCallback(async () => {
        setIsSaving(true);
        try {
            await saveConfig({
                vaultPath: vaultPath.trim() || null,
                enabled,
                scanFolders: parseScanFoldersInput(scanFoldersText),
            });
            showSaved();
        } catch (error) {
            showToast(toErrorMessage(error, 'Failed to save Obsidian config.'), 'error');
        } finally {
            setIsSaving(false);
        }
    }, [enabled, saveConfig, scanFoldersText, showSaved, showToast, vaultPath]);

    const handleRemove = useCallback(async () => {
        try {
            await removeConfig();
            setVaultPath('');
            setEnabled(false);
            setScanFoldersText('/');
            showSaved();
        } catch (error) {
            showToast(toErrorMessage(error, 'Failed to remove Obsidian config.'), 'error');
        }
    }, [removeConfig, showSaved, showToast]);

    const handleRescan = useCallback(async () => {
        try {
            await scan();
            const error = useObsidianStore.getState().error;
            if (error) {
                showToast(error, 'error');
                return;
            }
            showToast('Obsidian vault scanned.', 'success');
        } catch (error) {
            showToast(toErrorMessage(error, 'Failed to scan Obsidian vault.'), 'error');
        }
    }, [scan, showToast]);

    return {
        obsidianVaultPath: vaultPath,
        setObsidianVaultPath: setVaultPath,
        obsidianEnabled: enabled,
        setObsidianEnabled: setEnabled,
        obsidianScanFoldersText: scanFoldersText,
        setObsidianScanFoldersText: setScanFoldersText,
        obsidianLastScannedAt: config.lastScannedAt,
        obsidianHasVaultMarker: hasVaultMarker,
        obsidianVaultWarning: vaultWarning,
        isSavingObsidian: isSaving,
        isScanningObsidian: isScanning,
        onBrowseObsidianVault: handleBrowseVault,
        onSaveObsidian: handleSave,
        onRemoveObsidian: handleRemove,
        onRescanObsidian: handleRescan,
    };
};
