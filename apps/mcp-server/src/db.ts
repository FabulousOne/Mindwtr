import Database from 'better-sqlite3';
import { resolveMindwtrDbPath } from './paths';

export type DbOptions = {
  dbPath?: string;
  readonly?: boolean;
};

export function openMindwtrDb(options: DbOptions = {}) {
  const path = resolveMindwtrDbPath(options.dbPath);
  const db = new Database(path, {
    readonly: options.readonly ?? false,
    fileMustExist: true,
  });

  db.pragma('journal_mode = WAL');
  db.pragma('foreign_keys = ON');
  db.pragma('busy_timeout = 5000');

  return { db, path };
}

export function closeDb(db: Database.Database) {
  try {
    db.close();
  } catch {
    // ignore close errors
  }
}

export function parseJson<T>(value: unknown, fallback: T): T {
  if (typeof value !== 'string' || !value.trim()) return fallback;
  try {
    return JSON.parse(value) as T;
  } catch {
    return fallback;
  }
}
