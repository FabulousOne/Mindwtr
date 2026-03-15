import {
    normalizeObsidianRelativePath,
    parseObsidianTasksFromMarkdown,
    type ObsidianTask,
} from '@mindwtr/core';

export type ObsidianConfig = {
    vaultPath: string | null;
    vaultName: string;
    scanFolders: string[];
    lastScannedAt: string | null;
    enabled: boolean;
};

export type ObsidianScanResult = {
    tasks: ObsidianTask[];
    scannedFileCount: number;
};

type ScannerDirEntry = {
    name?: string;
    path?: string;
    isFile?: boolean;
    isDirectory?: boolean;
};

type ScannerFileInfo = {
    mtime: Date | null;
    isFile?: boolean;
    isDirectory?: boolean;
};

export type ObsidianScannerDependencies = {
    exists: (path: string) => Promise<boolean>;
    readDir: (path: string) => Promise<ScannerDirEntry[]>;
    readTextFile: (path: string) => Promise<string>;
    stat: (path: string) => Promise<ScannerFileInfo>;
};

const DEFAULT_SCAN_FOLDERS = ['/'];

const basename = (input: string): string => {
    const normalized = input.replace(/[\\/]+$/, '');
    const lastSlash = Math.max(normalized.lastIndexOf('/'), normalized.lastIndexOf('\\'));
    return lastSlash >= 0 ? normalized.slice(lastSlash + 1) : normalized;
};

const joinPath = (...parts: string[]): string => {
    const filtered = parts.filter(Boolean);
    if (filtered.length === 0) return '';

    const [first, ...rest] = filtered;
    const normalizedFirst = first.replace(/[\\/]+$/, '');
    const suffix = rest
        .map((part) => part.replace(/^[\\/]+/, '').replace(/[\\/]+$/, ''))
        .filter(Boolean)
        .join('/');
    if (!suffix) return normalizedFirst;
    return `${normalizedFirst}/${suffix}`;
};

const shouldSkipEntry = (name: string): boolean => {
    if (!name) return true;
    if (name === '.obsidian' || name === '.trash' || name === 'node_modules') return true;
    if (name.startsWith('.')) return true;
    return false;
};

const shouldSkipRelativePath = (relativePath: string): boolean => {
    const segments = normalizeObsidianRelativePath(relativePath)
        .split('/')
        .map((segment) => segment.trim())
        .filter(Boolean);
    return segments.some(shouldSkipEntry);
};

export const deriveVaultName = (vaultPath: string | null | undefined): string => {
    const trimmed = String(vaultPath || '').trim();
    if (!trimmed) return '';
    return basename(trimmed);
};

const sanitizeScanFolder = (value: string): string => {
    const trimmed = String(value || '').trim().replace(/\\/g, '/');
    if (!trimmed || trimmed === '/') return '/';

    const segments = trimmed
        .split('/')
        .map((segment) => segment.trim())
        .filter(Boolean)
        .reduce<string[]>((acc, segment) => {
            if (segment === '.') return acc;
            if (segment === '..') {
                acc.pop();
                return acc;
            }
            acc.push(segment);
            return acc;
        }, []);

    return segments.length > 0 ? segments.join('/') : '/';
};

export const sanitizeScanFolders = (folders: string[] | null | undefined): string[] => {
    const source = Array.isArray(folders) ? folders : DEFAULT_SCAN_FOLDERS;
    const sanitized = source.map(sanitizeScanFolder);
    const unique = Array.from(new Set(sanitized.filter(Boolean)));
    return unique.length > 0 ? unique : [...DEFAULT_SCAN_FOLDERS];
};

export const normalizeObsidianConfig = (config: Partial<ObsidianConfig> | null | undefined): ObsidianConfig => {
    const vaultPath = String(config?.vaultPath || '').trim() || null;
    const scanFolders = sanitizeScanFolders(config?.scanFolders);
    const lastScannedAt = String(config?.lastScannedAt || '').trim() || null;
    const enabled = vaultPath ? config?.enabled !== false : false;

    return {
        vaultPath,
        vaultName: deriveVaultName(vaultPath),
        scanFolders,
        lastScannedAt,
        enabled,
    };
};

const sortTasks = (tasks: ObsidianTask[]): ObsidianTask[] => {
    return [...tasks].sort((left, right) => {
        const pathCompare = left.source.relativeFilePath.localeCompare(right.source.relativeFilePath);
        if (pathCompare !== 0) return pathCompare;
        return left.source.lineNumber - right.source.lineNumber;
    });
};

export async function scanObsidianVault(
    rawConfig: Partial<ObsidianConfig> | null | undefined,
    deps: ObsidianScannerDependencies
): Promise<ObsidianScanResult> {
    const config = normalizeObsidianConfig(rawConfig);
    const vaultPath = config.vaultPath;
    if (!config.enabled || !vaultPath) {
        return { tasks: [], scannedFileCount: 0 };
    }

    const tasks: ObsidianTask[] = [];
    const seenFiles = new Set<string>();
    let scannedFileCount = 0;

    const scanMarkdownFile = async (absolutePath: string, relativePath: string): Promise<void> => {
        if (!relativePath.toLowerCase().endsWith('.md')) return;
        if (shouldSkipRelativePath(relativePath) || seenFiles.has(relativePath)) return;
        seenFiles.add(relativePath);

        const [markdown, fileInfo] = await Promise.all([
            deps.readTextFile(absolutePath),
            deps.stat(absolutePath),
        ]);

        scannedFileCount += 1;
        const fileModifiedAt = fileInfo.mtime?.toISOString() ?? new Date(0).toISOString();
        const parsed = parseObsidianTasksFromMarkdown(markdown, {
            vaultName: config.vaultName,
            vaultPath,
            relativeFilePath: relativePath,
            fileModifiedAt,
        });
        tasks.push(...parsed.tasks);
    };

    const walkDirectory = async (absoluteDirPath: string, relativeDirPath: string): Promise<void> => {
        const entries = await deps.readDir(absoluteDirPath);
        for (const entry of entries) {
            const name = String(entry.name || basename(String(entry.path || ''))).trim();
            if (!name || shouldSkipEntry(name)) continue;

            const absolutePath = String(entry.path || joinPath(absoluteDirPath, name));
            const relativePath = normalizeObsidianRelativePath(relativeDirPath ? `${relativeDirPath}/${name}` : name);

            if (entry.isDirectory) {
                await walkDirectory(absolutePath, relativePath);
                continue;
            }

            if (!entry.isFile) continue;
            await scanMarkdownFile(absolutePath, relativePath);
        }
    };

    for (const scanFolder of config.scanFolders) {
        if (scanFolder !== '/' && shouldSkipRelativePath(scanFolder)) continue;
        const absolutePath = scanFolder === '/' ? vaultPath : joinPath(vaultPath, scanFolder);
        if (!(await deps.exists(absolutePath))) continue;
        const fileInfo = await deps.stat(absolutePath);
        if (fileInfo.isFile && absolutePath.toLowerCase().endsWith('.md')) {
            await scanMarkdownFile(absolutePath, normalizeObsidianRelativePath(scanFolder));
            continue;
        }
        await walkDirectory(absolutePath, scanFolder === '/' ? '' : normalizeObsidianRelativePath(scanFolder));
    }

    return {
        tasks: sortTasks(tasks),
        scannedFileCount,
    };
}
