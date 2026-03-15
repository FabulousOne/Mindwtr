import { afterEach, describe, expect, it, vi } from 'vitest';
import type { ObsidianSourceRef } from '@mindwtr/core';

import { ObsidianService, formatScanFoldersInput, parseScanFoldersInput } from './obsidian-service';

const sourceRef: ObsidianSourceRef = {
    vaultName: 'My Vault',
    vaultPath: '/Vault',
    relativeFilePath: 'Projects/Alpha Plan.md',
    lineNumber: 12,
    fileModifiedAt: '2026-03-14T12:00:00.000Z',
    noteTags: [],
};

afterEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
});

describe('obsidian-service helpers', () => {
    it('parses scan folder input into normalized relative folders', () => {
        expect(parseScanFoldersInput('Projects\nInbox, /, ./Area/../Daily')).toEqual([
            'Projects',
            'Inbox',
            '/',
            'Daily',
        ]);
    });

    it('formats scan folders into a stable editable string', () => {
        expect(formatScanFoldersInput(['Projects', '/', 'Projects', 'Daily/Notes'])).toBe('Projects, /, Daily/Notes');
    });

    it('builds Obsidian URIs with encoded vault and file names', () => {
        expect(ObsidianService.buildObsidianUri(sourceRef)).toBe(
            'obsidian://open?vault=My%20Vault&file=Projects%2FAlpha%20Plan'
        );
    });

    it('opens obsidian URIs through the browser when not running in Tauri', async () => {
        const openSpy = vi.spyOn(window, 'open').mockReturnValue(null);

        await ObsidianService.openTaskInObsidian(sourceRef);

        expect(openSpy).toHaveBeenCalledWith(
            'obsidian://open?vault=My%20Vault&file=Projects%2FAlpha%20Plan',
            '_blank',
            'noopener,noreferrer'
        );
    });
});
