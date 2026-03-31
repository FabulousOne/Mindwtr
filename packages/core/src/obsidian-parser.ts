import type { TaskPriority, TaskStatus } from './types';
import {
    parseObsidianFrontmatterProperties,
    type ObsidianFrontmatterProperties,
    splitObsidianFrontmatter,
} from './obsidian-frontmatter';

export type ObsidianSourceRef = {
    vaultName: string;
    vaultPath: string;
    relativeFilePath: string;
    lineNumber: number;
    fileModifiedAt: string;
    noteTags: string[];
};

export type ObsidianTaskFormat = 'inline' | 'tasknotes';
export type ObsidianTaskNotesStatus = Extract<TaskStatus, 'inbox' | 'next' | 'waiting' | 'someday' | 'done' | 'archived'>;

export type ObsidianTaskNotesData = {
    rawStatus: string;
    mindwtrStatus: ObsidianTaskNotesStatus;
    priority: TaskPriority | null;
    dueDate: string | null;
    scheduledDate: string | null;
    contexts: string[];
    projects: string[];
    timeEstimateMinutes: number | null;
    recurrenceRule: string | null;
    completedDate: string | null;
    bodyPreview: string | null;
};

export type ObsidianTask = {
    id: string;
    text: string;
    completed: boolean;
    tags: string[];
    wikiLinks: string[];
    nestingLevel: number;
    source: ObsidianSourceRef;
    format: ObsidianTaskFormat;
    taskNotesData?: ObsidianTaskNotesData;
};

export type ObsidianFrontmatter = {
    tags: string[];
    due?: string;
    properties: ObsidianFrontmatterProperties;
};

export type ParseObsidianTasksOptions = {
    vaultName: string;
    vaultPath: string;
    relativeFilePath: string;
    fileModifiedAt: string;
};

export type ParseObsidianTasksResult = {
    tasks: ObsidianTask[];
    frontmatter: ObsidianFrontmatter;
};

const FENCE_RE = /^\s*(`{3,}|~{3,})/;
const TASK_RE = /^([ \t]*)(?:[-*+])\s+\[( |x|X)\]\s+(.+)$/;
const WIKI_LINK_RE = /\[\[([^\]|]+)(?:\|([^\]]+))?\]\]/g;
const TAG_RE = /(^|\s)#([\p{L}\p{N}_/.:-]+)/gu;

export const normalizeObsidianTagValue = (value: string): string => {
    const trimmed = value.trim();
    if (!trimmed) return '';
    return trimmed.startsWith('#') ? trimmed.slice(1) : trimmed;
};

export const uniqueObsidianStrings = (items: string[]): string[] => {
    const seen = new Set<string>();
    const result: string[] = [];
    for (const item of items) {
        const trimmed = item.trim();
        if (!trimmed || seen.has(trimmed)) continue;
        seen.add(trimmed);
        result.push(trimmed);
    }
    return result;
};

export const normalizeObsidianRelativePath = (value: string): string => {
    const normalized = String(value || '').trim().replace(/\\/g, '/').replace(/\/+/g, '/');
    if (!normalized) return '';
    if (normalized.startsWith('/')) {
        throw new Error('Obsidian relative paths cannot be absolute.');
    }
    if (/^[A-Za-z]:/.test(normalized)) {
        throw new Error('Obsidian relative paths cannot include drive prefixes.');
    }

    const segments = normalized
        .split('/')
        .map((segment) => segment.trim())
        .filter(Boolean);

    if (segments.some((segment) => segment === '..')) {
        throw new Error('Obsidian relative paths cannot contain parent traversal.');
    }

    return segments.filter((segment) => segment !== '.').join('/');
};

const hashObsidianSource = (source: string): string => {
    let hash = 0x811c9dc5;
    for (let index = 0; index < source.length; index += 1) {
        hash ^= source.charCodeAt(index);
        hash = Math.imul(hash, 0x01000193);
    }
    return (hash >>> 0).toString(36);
};

export const buildObsidianTaskId = (relativeFilePath: string, lineNumber: number): string => {
    const normalizedLineNumber = Number.isFinite(lineNumber) ? Math.max(0, Math.floor(lineNumber)) : 0;
    const source = `${normalizeObsidianRelativePath(relativeFilePath)}:${normalizedLineNumber}`;
    return `obsidian-${normalizedLineNumber}-${hashObsidianSource(source)}`;
};

export const buildObsidianFileTaskId = (relativeFilePath: string, format: ObsidianTaskFormat = 'tasknotes'): string => {
    const source = `${format}:${normalizeObsidianRelativePath(relativeFilePath)}`;
    return `obsidian-file-${hashObsidianSource(source)}`;
};

export const extractObsidianTags = (text: string): string[] => {
    const tags: string[] = [];
    let match: RegExpExecArray | null;
    TAG_RE.lastIndex = 0;
    while ((match = TAG_RE.exec(text)) !== null) {
        const value = normalizeObsidianTagValue(match[2] || '');
        if (value) tags.push(value);
    }
    return uniqueObsidianStrings(tags);
};

export const extractObsidianWikiLinks = (text: string): string[] => {
    const links: string[] = [];
    let match: RegExpExecArray | null;
    WIKI_LINK_RE.lastIndex = 0;
    while ((match = WIKI_LINK_RE.exec(text)) !== null) {
        const value = (match[1] || '').trim();
        if (value) links.push(value);
    }
    return uniqueObsidianStrings(links);
};

export const parseObsidianNoteFrontmatter = (input: string): ObsidianFrontmatter => {
    const properties = parseObsidianFrontmatterProperties(input);

    const noteTags = uniqueObsidianStrings([
        ...((Array.isArray(properties.tags) ? properties.tags : typeof properties.tags === 'string' ? [properties.tags] : [])
            .filter((value): value is string => typeof value === 'string')
            .map(normalizeObsidianTagValue)
            .filter(Boolean)),
        ...((Array.isArray(properties.tag) ? properties.tag : typeof properties.tag === 'string' ? [properties.tag] : [])
            .filter((value): value is string => typeof value === 'string')
            .map(normalizeObsidianTagValue)
            .filter(Boolean)),
    ]);

    const dueValue = properties.due;
    const due = typeof dueValue === 'string' && dueValue.trim() ? dueValue.trim() : undefined;

    return {
        tags: noteTags,
        ...(due ? { due } : {}),
        properties,
    };
};

const computeIndentLevel = (rawIndent: string): number => {
    let tabs = 0;
    let spaces = 0;
    for (const char of rawIndent) {
        if (char === '\t') {
            tabs += 1;
            continue;
        }
        if (char === ' ') {
            spaces += 1;
        }
    }
    return tabs + Math.floor(spaces / 2);
};

export const parseObsidianTasksFromMarkdown = (
    markdown: string,
    options: ParseObsidianTasksOptions
): ParseObsidianTasksResult => {
    const normalizedRelativePath = normalizeObsidianRelativePath(options.relativeFilePath);
    const split = splitObsidianFrontmatter(markdown);
    const frontmatter: ObsidianFrontmatter = {
        tags: uniqueObsidianStrings([
            ...((Array.isArray(split.properties.tags) ? split.properties.tags : typeof split.properties.tags === 'string' ? [split.properties.tags] : [])
                .filter((value): value is string => typeof value === 'string')
                .map(normalizeObsidianTagValue)
                .filter(Boolean)),
            ...((Array.isArray(split.properties.tag) ? split.properties.tag : typeof split.properties.tag === 'string' ? [split.properties.tag] : [])
                .filter((value): value is string => typeof value === 'string')
                .map(normalizeObsidianTagValue)
                .filter(Boolean)),
        ]),
        ...(typeof split.properties.due === 'string' && split.properties.due.trim() ? { due: split.properties.due.trim() } : {}),
        properties: split.properties,
    };
    const tasks: ObsidianTask[] = [];
    let inFence = false;

    for (let index = 0; index < split.bodyLines.length; index += 1) {
        const line = split.bodyLines[index] ?? '';
        if (FENCE_RE.test(line)) {
            inFence = !inFence;
            continue;
        }
        if (inFence) continue;

        const match = TASK_RE.exec(line);
        if (!match) continue;
        const text = (match[3] || '').trim();
        if (!text) continue;

        const lineNumber = split.bodyStartLineNumber + index;
        const taskTags = uniqueObsidianStrings([...extractObsidianTags(text), ...frontmatter.tags]);
        tasks.push({
            id: buildObsidianTaskId(normalizedRelativePath, lineNumber),
            text,
            completed: (match[2] || '').toLowerCase() === 'x',
            tags: taskTags,
            wikiLinks: extractObsidianWikiLinks(text),
            nestingLevel: computeIndentLevel(match[1] || ''),
            source: {
                vaultName: options.vaultName,
                vaultPath: options.vaultPath,
                relativeFilePath: normalizedRelativePath,
                lineNumber,
                fileModifiedAt: options.fileModifiedAt,
                noteTags: frontmatter.tags,
            },
            format: 'inline',
        });
    }

    return { tasks, frontmatter };
};
