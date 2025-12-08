import { View, Text, ScrollView, TextInput, Pressable, StyleSheet, type ViewStyle, type TextStyle } from 'react-native';
import { useTaskStore } from '@focus-gtd/core';
import { useState } from 'react';
import type { Task, TaskStatus } from '@focus-gtd/core';
import { useTheme } from '../../contexts/theme-context';
import { useLanguage } from '../../contexts/language-context';
import { Colors } from '@/constants/theme';

const STATUS_OPTIONS: TaskStatus[] = ['inbox', 'next', 'waiting', 'someday', 'done'];

const STATUS_COLORS: Record<TaskStatus, string> = {
  inbox: '#6B7280',
  todo: '#E5E7EB',
  next: '#3B82F6',
  'in-progress': '#F59E0B',
  waiting: '#F59E0B',
  someday: '#8B5CF6',
  done: '#10B981',
  archived: '#9CA3AF',
};

const getStatusLabels = (lang: 'en' | 'zh'): Record<TaskStatus, string> => {
  if (lang === 'zh') {
    return {
      inbox: '📥 收集箱',
      todo: '📝 待办',
      next: '▶️ 下一步',
      'in-progress': '🚧 进行中',
      waiting: '⏸️ 等待中',
      someday: '💭 将来',
      done: '✅ 完成',
      archived: '🗄️ 归档',
    };
  }
  return {
    inbox: '📥 Inbox',
    todo: '📝 Todo',
    next: '▶️ Next',
    'in-progress': '🚧 In Progress',
    waiting: '⏸️ Waiting',
    someday: '💭 Someday',
    done: '✅ Done',
    archived: '🗄️ Archived',
  };
};

import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { TaskEditModal } from '@/components/task-edit-modal';
import { TaskStatusBadge } from '@/components/task-status-badge';

function TaskCard({ task, onEdit, t }: { task: Task; onEdit: (task: Task) => void; t: (key: string) => string }) {
  const { updateTask, deleteTask } = useTaskStore();
  const [isExpanded, setIsExpanded] = useState(false);

  const handleStatusChange = (newStatus: TaskStatus) => {
    updateTask(task.id, { status: newStatus });
  };

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return t('review.notSet');
    const date = new Date(dateStr);
    return date.toLocaleDateString();
  };

  const formatTime = (dateStr?: string) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <Pressable
      style={[styles.taskCard, { borderLeftColor: STATUS_COLORS[task.status] }]}
      onPress={() => setIsExpanded(!isExpanded)}
    >
      <View style={styles.taskHeader}>
        <View style={styles.taskTitleRow}>
          <Text style={styles.taskTitle}>{task.title}</Text>
          <TaskStatusBadge
            status={task.status}
            onUpdate={(newStatus: TaskStatus) => updateTask(task.id, { status: newStatus })}
          />
        </View>
      </View>

      {isExpanded && (
        <View style={styles.taskDetails}>
          <>
            {task.description && (
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>{t('review.description')}:</Text>
                <Text style={styles.detailValue}>{task.description}</Text>
              </View>
            )}

            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>{t('review.startTime')}:</Text>
              <Text style={styles.detailValue}>
                {formatDate(task.startTime)}
                {task.startTime && ` ${formatTime(task.startTime)}`}
              </Text>
            </View>

            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>{t('review.deadline')}:</Text>
              <Text style={[styles.detailValue, task.dueDate && styles.deadlineText]}>
                {formatDate(task.dueDate)}
                {task.dueDate && ` ${formatTime(task.dueDate)}`}
              </Text>
            </View>

            {task.contexts && task.contexts.length > 0 && (
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>{t('review.contexts')}:</Text>
                <Text style={styles.detailValue}>{task.contexts.join(', ')}</Text>
              </View>
            )}

            <View style={styles.actionButtons}>
              <Pressable
                style={[styles.button, styles.editButton]}
                onPress={() => onEdit(task)}
              >
                <Text style={styles.buttonText}>✏️ {t('common.edit')}</Text>
              </Pressable>

              {task.status !== 'done' && (
                <Pressable
                  style={[styles.button, styles.doneButton]}
                  onPress={() => handleStatusChange('done')}
                >
                  <Text style={styles.buttonText}>✅ {t('review.markDone')}</Text>
                </Pressable>
              )}

              <Pressable
                style={[styles.button, styles.deleteButton]}
                onPress={() => deleteTask(task.id)}
              >
                <Text style={styles.buttonText}>🗑️ {t('common.delete')}</Text>
              </Pressable>
            </View>
          </>
        </View>
      )}
    </Pressable>
  );
}

export default function ReviewScreen() {
  const { tasks, updateTask } = useTaskStore();
  const { isDark } = useTheme();
  const { language, t } = useLanguage();
  const [filterStatus, setFilterStatus] = useState<TaskStatus | 'all'>('all');
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const STATUS_LABELS = getStatusLabels(language as 'en' | 'zh');

  // Theme-aware colors
  const tc = {
    bg: isDark ? Colors.dark.background : Colors.light.background,
    cardBg: isDark ? '#1F2937' : '#FFFFFF',
    text: isDark ? Colors.dark.text : Colors.light.text,
    secondaryText: isDark ? '#9CA3AF' : '#6B7280',
    border: isDark ? '#374151' : '#E5E7EB',
    filterBg: isDark ? '#374151' : '#F3F4F6',
  };

  const filteredTasks = tasks.filter((task) =>
    filterStatus === 'all' ? true : task.status === filterStatus
  );

  const sortedTasks = [...filteredTasks].sort((a, b) => {
    // Sort by dueDate first (earliest first), then by status
    if (a.dueDate && !b.dueDate) return -1;
    if (!a.dueDate && b.dueDate) return 1;
    if (a.dueDate && b.dueDate) {
      return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
    }
    return a.status.localeCompare(b.status);
  });

  return (
    <View style={[styles.container, { backgroundColor: tc.bg }]}>
      <View style={[styles.header, { backgroundColor: tc.cardBg, borderBottomColor: tc.border }]}>
        <Text style={[styles.title, { color: tc.text }]}>📋 {t('review.title')}</Text>
        <Text style={[styles.count, { color: tc.secondaryText }]}>{filteredTasks.length} {t('common.tasks')}</Text>
      </View>

      <ScrollView horizontal style={[styles.filterBar, { backgroundColor: tc.cardBg, borderBottomColor: tc.border }]} showsHorizontalScrollIndicator={false}>
        <Pressable
          style={[styles.filterButton, { backgroundColor: tc.filterBg }, filterStatus === 'all' && styles.filterButtonActive]}
          onPress={() => setFilterStatus('all')}
        >
          <Text style={[styles.filterText, { color: tc.secondaryText }, filterStatus === 'all' && styles.filterTextActive]}>
            {t('common.all')} ({tasks.length})
          </Text>
        </Pressable>
        {STATUS_OPTIONS.map((status) => (
          <Pressable
            key={status}
            style={[styles.filterButton, { backgroundColor: tc.filterBg }, filterStatus === status && styles.filterButtonActive]}
            onPress={() => setFilterStatus(status)}
          >
            <Text style={[styles.filterText, { color: tc.secondaryText }, filterStatus === status && styles.filterTextActive]}>
              {STATUS_LABELS[status]} ({tasks.filter((t) => t.status === status).length})
            </Text>
          </Pressable>
        ))}
      </ScrollView>

      <ScrollView style={styles.taskList}>
        {sortedTasks.map((task) => (
          <TaskCard
            key={task.id}
            task={task}
            t={t}
            onEdit={(t) => {
              setEditingTask(t);
              setIsModalVisible(true);
            }}
          />
        ))}
        {sortedTasks.length === 0 && (
          <View style={styles.emptyState}>
            <Text style={[styles.emptyText, { color: tc.secondaryText }]}>{t('review.noTasks')}</Text>
          </View>
        )}
      </ScrollView>

      <TaskEditModal
        visible={isModalVisible}
        task={editingTask}
        onClose={() => setIsModalVisible(false)}
        onSave={(taskId, updates) => updateTask(taskId, updates)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
  },
  count: {
    fontSize: 14,
    color: '#6B7280',
  },
  filterBar: {
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    paddingHorizontal: 16,
    paddingVertical: 12,
    maxHeight: 60,
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    marginRight: 8,
  },
  filterButtonActive: {
    backgroundColor: '#3B82F6',
  },
  filterText: {
    fontSize: 14,
    color: '#4B5563',
    fontWeight: '500',
  },
  filterTextActive: {
    color: '#FFFFFF',
  },
  taskList: {
    flex: 1,
    padding: 16,
  },
  taskCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderLeftWidth: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  taskHeader: {
    marginBottom: 8,
  },
  taskTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  taskTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    flex: 1,
    marginRight: 12,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  taskDetails: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  detailRow: {
    marginBottom: 8,
  },
  detailLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 2,
  },
  detailValue: {
    fontSize: 14,
    color: '#111827',
  },
  deadlineText: {
    color: '#DC2626',
    fontWeight: '500',
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
    marginTop: 12,
    marginBottom: 8,
  },
  statusButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 12,
  },
  statusButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    marginRight: 8,
    marginBottom: 8,
  },
  statusButtonText: {
    fontSize: 12,
    color: '#4B5563',
    fontWeight: '500',
  },
  statusButtonTextActive: {
    color: '#FFFFFF',
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 12,
  },
  button: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  editButton: {
    backgroundColor: '#3B82F6',
  },
  doneButton: {
    backgroundColor: '#10B981',
  },
  deleteButton: {
    backgroundColor: '#EF4444',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  editForm: {
    gap: 12,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 4,
  },
  input: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    backgroundColor: '#FFFFFF',
  },
  dateButton: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    padding: 12,
    backgroundColor: '#FFFFFF',
    alignItems: 'flex-start',
  },
  dateButtonText: {
    fontSize: 14,
    color: '#111827',
  },
  textArea: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 8,
  },
  saveButton: {
    backgroundColor: '#10B981',
  },
  cancelButton: {
    backgroundColor: '#6B7280',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 48,
  },
  emptyText: {
    fontSize: 16,
    color: '#9CA3AF',
  },
});
