import type Database from 'better-sqlite3';
import { generateUUID, normalizeTaskStatus, parseQuickAdd, type Project, type Task, type TaskStatus } from '@mindwtr/core';
import { parseJson } from './db';

export type ListTasksInput = {
  status?: TaskStatus | 'all';
  projectId?: string;
  includeDeleted?: boolean;
  limit?: number;
  offset?: number;
  search?: string;
};

export type AddTaskInput = {
  title?: string;
  quickAdd?: string;
  status?: TaskStatus;
  projectId?: string;
  dueDate?: string;
  startTime?: string;
  contexts?: string[];
  tags?: string[];
  description?: string;
  priority?: string;
  timeEstimate?: string;
};

export type CompleteTaskInput = { id: string };

export type TaskRow = Task & {
  contexts?: string[];
  tags?: string[];
  checklist?: Task['checklist'];
  attachments?: Task['attachments'];
};

const taskSelectColumns = `
  id,
  title,
  status,
  priority,
  taskMode,
  startTime,
  dueDate,
  recurrence,
  pushCount,
  tags,
  contexts,
  checklist,
  description,
  attachments,
  location,
  projectId,
  orderNum,
  isFocusedToday,
  timeEstimate,
  reviewAt,
  completedAt,
  createdAt,
  updatedAt,
  deletedAt,
  purgedAt
`;

function mapTaskRow(row: any): TaskRow {
  return {
    id: row.id as string,
    title: row.title as string,
    status: normalizeTaskStatus(row.status as string),
    priority: row.priority ?? undefined,
    taskMode: row.taskMode ?? undefined,
    startTime: row.startTime ?? undefined,
    dueDate: row.dueDate ?? undefined,
    recurrence: parseJson(row.recurrence, undefined),
    pushCount: row.pushCount ?? undefined,
    tags: parseJson(row.tags, []),
    contexts: parseJson(row.contexts, []),
    checklist: parseJson(row.checklist, []),
    description: row.description ?? undefined,
    attachments: parseJson(row.attachments, []),
    location: row.location ?? undefined,
    projectId: row.projectId ?? undefined,
    orderNum: row.orderNum ?? undefined,
    isFocusedToday: row.isFocusedToday === 1,
    timeEstimate: row.timeEstimate ?? undefined,
    reviewAt: row.reviewAt ?? undefined,
    completedAt: row.completedAt ?? undefined,
    createdAt: row.createdAt as string,
    updatedAt: row.updatedAt as string,
    deletedAt: row.deletedAt ?? undefined,
    purgedAt: row.purgedAt ?? undefined,
  };
}

export function listTasks(db: Database.Database, input: ListTasksInput): TaskRow[] {
  const where: string[] = [];
  const params: any[] = [];

  if (!input.includeDeleted) {
    where.push('deletedAt IS NULL');
  }
  if (input.status && input.status !== 'all') {
    where.push('status = ?');
    params.push(input.status);
  }
  if (input.projectId) {
    where.push('projectId = ?');
    params.push(input.projectId);
  }
  if (input.search) {
    where.push('(title LIKE ? OR description LIKE ?)');
    const pattern = `%${input.search}%`;
    params.push(pattern, pattern);
  }

  const limit = Number.isFinite(input.limit) ? Math.max(1, Math.min(500, input.limit as number)) : 200;
  const offset = Number.isFinite(input.offset) ? Math.max(0, input.offset as number) : 0;

  const sql = `SELECT ${taskSelectColumns} FROM tasks ${where.length ? `WHERE ${where.join(' AND ')}` : ''} ORDER BY updatedAt DESC LIMIT ? OFFSET ?`;
  const rows = db.prepare(sql).all(...params, limit, offset);
  return rows.map(mapTaskRow);
}

function getProjects(db: Database.Database): Project[] {
  const rows = db.prepare('SELECT id, title, status, areaId, areaTitle, color, orderNum, tagIds, isSequential, isFocused, supportNotes, attachments, reviewAt, createdAt, updatedAt, deletedAt FROM projects WHERE deletedAt IS NULL').all();
  return rows.map((row: any) => ({
    id: row.id,
    title: row.title,
    status: row.status,
    color: row.color ?? '#94a3b8',
    orderNum: row.orderNum ?? undefined,
    tagIds: parseJson(row.tagIds, []),
    isSequential: row.isSequential === 1,
    isFocused: row.isFocused === 1,
    supportNotes: row.supportNotes ?? undefined,
    attachments: parseJson(row.attachments, []),
    reviewAt: row.reviewAt ?? undefined,
    areaId: row.areaId ?? undefined,
    areaTitle: row.areaTitle ?? undefined,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
    deletedAt: row.deletedAt ?? undefined,
  }));
}

export function addTask(db: Database.Database, input: AddTaskInput): TaskRow {
  const now = new Date().toISOString();
  let title = (input.title || '').trim();
  let props: Partial<Task> = {};

  if (input.quickAdd) {
    const projects = getProjects(db);
    const quick = parseQuickAdd(input.quickAdd, projects, new Date());
    title = quick.title || title || input.quickAdd;
    props = quick.props;
  }

  if (!title) {
    throw new Error('Task title is required.');
  }

  const status = input.status ?? (props.status as TaskStatus) ?? 'inbox';
  const task: Task = {
    id: generateUUID(),
    title,
    status,
    priority: (input.priority ?? props.priority) as Task['priority'],
    taskMode: props.taskMode,
    startTime: input.startTime ?? props.startTime,
    dueDate: input.dueDate ?? props.dueDate,
    recurrence: props.recurrence,
    pushCount: props.pushCount,
    tags: input.tags ?? (props.tags as string[] | undefined) ?? [],
    contexts: input.contexts ?? (props.contexts as string[] | undefined) ?? [],
    checklist: props.checklist,
    description: input.description ?? props.description,
    attachments: props.attachments,
    location: props.location,
    projectId: input.projectId ?? props.projectId,
    orderNum: props.orderNum ?? undefined,
    isFocusedToday: props.isFocusedToday ?? false,
    timeEstimate: input.timeEstimate ?? props.timeEstimate,
    reviewAt: props.reviewAt,
    completedAt: props.completedAt,
    createdAt: now,
    updatedAt: now,
    deletedAt: undefined,
    purgedAt: undefined,
  };

  const insert = db.prepare(`
    INSERT INTO tasks (
      id, title, status, priority, taskMode, startTime, dueDate, recurrence, pushCount, tags, contexts, checklist, description,
      attachments, location, projectId, orderNum, isFocusedToday, timeEstimate, reviewAt, completedAt, createdAt, updatedAt, deletedAt, purgedAt
    ) VALUES (
      @id, @title, @status, @priority, @taskMode, @startTime, @dueDate, @recurrence, @pushCount, @tags, @contexts, @checklist, @description,
      @attachments, @location, @projectId, @orderNum, @isFocusedToday, @timeEstimate, @reviewAt, @completedAt, @createdAt, @updatedAt, @deletedAt, @purgedAt
    )
  `);

  insert.run({
    id: task.id,
    title: task.title,
    status: task.status,
    priority: task.priority ?? null,
    taskMode: task.taskMode ?? null,
    startTime: task.startTime ?? null,
    dueDate: task.dueDate ?? null,
    recurrence: task.recurrence ? JSON.stringify(task.recurrence) : null,
    pushCount: task.pushCount ?? null,
    tags: JSON.stringify(task.tags ?? []),
    contexts: JSON.stringify(task.contexts ?? []),
    checklist: task.checklist ? JSON.stringify(task.checklist) : null,
    description: task.description ?? null,
    attachments: task.attachments ? JSON.stringify(task.attachments) : null,
    location: task.location ?? null,
    projectId: task.projectId ?? null,
    orderNum: task.orderNum ?? null,
    isFocusedToday: task.isFocusedToday ? 1 : 0,
    timeEstimate: task.timeEstimate ?? null,
    reviewAt: task.reviewAt ?? null,
    completedAt: task.completedAt ?? null,
    createdAt: task.createdAt,
    updatedAt: task.updatedAt,
    deletedAt: task.deletedAt ?? null,
    purgedAt: task.purgedAt ?? null,
  });

  return task as TaskRow;
}

export function completeTask(db: Database.Database, input: CompleteTaskInput): TaskRow {
  const now = new Date().toISOString();
  const update = db.prepare(`
    UPDATE tasks
    SET status = 'done', completedAt = ?, updatedAt = ?
    WHERE id = ?
  `);
  const info = update.run(now, now, input.id);
  if (info.changes === 0) {
    throw new Error('Task not found.');
  }

  const row = db.prepare(`SELECT ${taskSelectColumns} FROM tasks WHERE id = ?`).get(input.id);
  return mapTaskRow(row);
}
