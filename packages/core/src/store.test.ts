import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { useTaskStore, flushPendingSave } from './store';
import { storage } from './storage';
import { act } from '@testing-library/react';

// Mock the storage module
vi.mock('./storage', () => ({
    storage: {
        getData: vi.fn().mockResolvedValue({ tasks: [], projects: [], settings: {} }),
        saveData: vi.fn().mockResolvedValue(undefined),
    },
    setStorageAdapter: vi.fn(),
}));

describe('TaskStore', () => {
    beforeEach(() => {
        useTaskStore.setState({ tasks: [], projects: [] });
        vi.clearAllMocks();
        vi.useFakeTimers();
    });

    afterEach(() => {
        vi.useRealTimers();
    });

    it('should add a task', () => {
        const { addTask } = useTaskStore.getState();

        act(() => {
            addTask('New Task');
        });

        const { tasks } = useTaskStore.getState();
        expect(tasks).toHaveLength(1);
        expect(tasks[0].title).toBe('New Task');
        expect(tasks[0].status).toBe('inbox');
    });

    it('should update a task', () => {
        const { addTask, updateTask } = useTaskStore.getState();

        act(() => {
            addTask('Task to Update');
        });

        const task = useTaskStore.getState().tasks[0];

        act(() => {
            updateTask(task.id, { title: 'Updated Task', status: 'next' });
        });

        const updatedTask = useTaskStore.getState().tasks[0];
        expect(updatedTask.title).toBe('Updated Task');
        expect(updatedTask.status).toBe('next');
    });

    it('should delete a task', () => {
        const { addTask, deleteTask } = useTaskStore.getState();

        act(() => {
            addTask('Task to Delete');
        });

        const task = useTaskStore.getState().tasks[0];

        act(() => {
            deleteTask(task.id);
        });

        const { tasks } = useTaskStore.getState();
        expect(tasks).toHaveLength(0);
    });

    it('should debounced save and allow immediate flush', async () => {
        const { addTask } = useTaskStore.getState();

        // 1. Trigger a change
        act(() => {
            addTask('Test Save');
        });

        // Should not have saved yet (debounced)
        expect(storage.saveData).not.toHaveBeenCalled();

        // 2. Flush pending save
        await flushPendingSave();

        // Should have saved immediately
        expect(storage.saveData).toHaveBeenCalledTimes(1);

        // 3. Fast-forward timer - should not save again
        vi.runAllTimers();
        expect(storage.saveData).toHaveBeenCalledTimes(1);
    });

    it('should add a project', () => {
        const { addProject } = useTaskStore.getState();

        act(() => {
            addProject('New Project', '#ff0000');
        });

        const { projects } = useTaskStore.getState();
        expect(projects).toHaveLength(1);
        expect(projects[0].title).toBe('New Project');
        expect(projects[0].color).toBe('#ff0000');
    });
});
