import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { act, cleanup, render, screen, waitFor } from '@testing-library/react';

import { LanguageProvider } from '../../contexts/language-context';
import { useObsidianStore } from '../../store/obsidian-store';
import { ObsidianView } from './ObsidianView';

const initialState = useObsidianStore.getState();

const renderWithProviders = () => render(
    <LanguageProvider>
        <ObsidianView />
    </LanguageProvider>
);

const resetObsidianStore = () => {
    act(() => {
        useObsidianStore.setState(initialState, true);
    });
};

beforeEach(() => {
    resetObsidianStore();
    act(() => {
        useObsidianStore.setState((state) => ({
            ...state,
            config: {
                vaultPath: null,
                vaultName: '',
                scanFolders: ['/'],
                lastScannedAt: null,
                enabled: false,
            },
            tasks: [],
            scannedFileCount: 0,
            hasScannedThisSession: true,
            hasVaultMarker: null,
            isInitialized: true,
            isLoadingConfig: false,
            isScanning: false,
            error: null,
            loadConfig: vi.fn().mockResolvedValue(undefined),
            rescan: vi.fn().mockResolvedValue(undefined),
            clearError: vi.fn(),
        }));
    });
});

afterEach(() => {
    cleanup();
    resetObsidianStore();
    vi.restoreAllMocks();
});

describe('ObsidianView', () => {
    it('shows setup guidance when no vault is configured', () => {
        renderWithProviders();

        expect(screen.getByText('Set up an Obsidian vault')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Open settings' })).toBeInTheDocument();
    });

    it('renders imported tasks and source links', () => {
        act(() => {
            useObsidianStore.setState((state) => ({
                ...state,
                config: {
                    vaultPath: '/Vault',
                    vaultName: 'Vault',
                    scanFolders: ['/'],
                    lastScannedAt: '2026-03-14T11:00:00.000Z',
                    enabled: true,
                },
                scannedFileCount: 3,
                tasks: [{
                    id: 'obsidian-1',
                    text: 'Draft spec #writing',
                    completed: false,
                    tags: ['writing'],
                    wikiLinks: ['Spec Note'],
                    nestingLevel: 0,
                    source: {
                        vaultName: 'Vault',
                        vaultPath: '/Vault',
                        relativeFilePath: 'Projects/Alpha.md',
                        lineNumber: 12,
                        fileModifiedAt: '2026-03-14T10:00:00.000Z',
                        noteTags: ['project/alpha'],
                    },
                }],
            }));
        });

        renderWithProviders();

        expect(screen.getByText('Draft spec #writing')).toBeInTheDocument();
        expect(screen.getByText('Projects/Alpha.md:12')).toBeInTheDocument();
        expect(screen.getByText('[[Spec Note]]')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Open in Obsidian' })).toBeInTheDocument();
        expect(screen.getByText('Notes scanned: 3')).toBeInTheDocument();
    });

    it('rescans once when a configured vault has not been scanned in this session', async () => {
        const rescan = vi.fn().mockResolvedValue(undefined);

        act(() => {
            useObsidianStore.setState((state) => ({
                ...state,
                config: {
                    vaultPath: '/Vault',
                    vaultName: 'Vault',
                    scanFolders: ['/'],
                    lastScannedAt: null,
                    enabled: true,
                },
                hasScannedThisSession: false,
                rescan,
            }));
        });

        renderWithProviders();

        await waitFor(() => {
            expect(rescan).toHaveBeenCalledTimes(1);
        });
    });
});
