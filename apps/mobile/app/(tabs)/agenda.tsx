import { View, Text, SectionList, Pressable, StyleSheet } from 'react-native';
import { useTaskStore } from '@focus-gtd/core';
import type { Task } from '@focus-gtd/core';
import { useState, useCallback, useMemo } from 'react';
import { useTheme } from '../../contexts/theme-context';
import { useLanguage } from '../../contexts/language-context';
import { Colors } from '@/constants/theme';

function TaskCard({ task, onPress, tc }: { task: Task; onPress: () => void; tc: any }) {
  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      'in-progress': '#EF4444',
      next: '#3B82F6',
      todo: '#10B981',
      waiting: '#F59E0B',
    };
    return colors[status] || '#6B7280';
  };

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      'in-progress': '🔄 In Progress',
      next: '▶️ Next',
      todo: '📋 To Do',
      waiting: '⏸️ Waiting',
    };
    return labels[status] || status;
  };

  const isOverdue = task.dueDate && new Date(task.dueDate) < new Date();
  const isDueToday = task.dueDate &&
    new Date(task.dueDate).toDateString() === new Date().toDateString();

  return (
    <Pressable style={[styles.taskCard, { backgroundColor: tc.cardBg }]} onPress={onPress}>
      <View style={[styles.statusBar, { backgroundColor: getStatusColor(task.status) }]} />
      <View style={styles.taskContent}>
        <Text style={[styles.taskTitle, { color: tc.text }]} numberOfLines={2}>
          {task.title}
        </Text>

        {task.description && (
          <Text style={[styles.taskDescription, { color: tc.secondaryText }]} numberOfLines={1}>
            {task.description}
          </Text>
        )}

        <View style={styles.taskMeta}>
          <View style={[styles.statusBadge, { backgroundColor: getStatusColor(task.status) }]}>
            <Text style={styles.statusText}>{getStatusLabel(task.status)}</Text>
          </View>

          {task.dueDate && (
            <Text style={[
              styles.dueDate,
              isOverdue && styles.overdue,
              isDueToday && styles.dueToday,
            ]}>
              {isOverdue ? '🔴 Overdue' : isDueToday ? '🟡 Today' :
                new Date(task.dueDate).toLocaleDateString()}
            </Text>
          )}
        </View>

        {task.contexts && task.contexts.length > 0 && (
          <View style={styles.contextsRow}>
            {task.contexts.slice(0, 3).map((ctx, idx) => (
              <Text key={idx} style={styles.contextTag}>
                {ctx}
              </Text>
            ))}
          </View>
        )}
      </View>
    </Pressable>
  );
}

export default function AgendaScreen() {
  const { tasks, updateTask } = useTaskStore();
  const { isDark } = useTheme();
  const { t } = useLanguage();
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  // Theme colors
  const tc = {
    bg: isDark ? Colors.dark.background : Colors.light.background,
    cardBg: isDark ? '#1F2937' : '#FFFFFF',
    text: isDark ? Colors.dark.text : Colors.light.text,
    secondaryText: isDark ? '#9CA3AF' : '#6B7280',
    border: isDark ? '#374151' : '#E5E7EB',
  };

  const sections = useMemo(() => {
    const activeTasks = tasks.filter(t => t.status !== 'done' && t.status !== 'archived');

    const inProgressTasks = activeTasks.filter(t => t.status === 'in-progress');
    const overdueTasks = activeTasks.filter(t =>
      t.dueDate && new Date(t.dueDate) < new Date() && t.status !== 'in-progress'
    );
    const todayTasks = activeTasks.filter(t =>
      t.dueDate &&
      new Date(t.dueDate).toDateString() === new Date().toDateString() &&
      t.status !== 'in-progress'
    );
    const nextTasks = activeTasks.filter(t => t.status === 'next').slice(0, 5);
    const upcomingTasks = activeTasks
      .filter(t => t.dueDate && new Date(t.dueDate) > new Date() && t.status !== 'in-progress')
      .sort((a, b) => new Date(a.dueDate!).getTime() - new Date(b.dueDate!).getTime())
      .slice(0, 5);

    const result = [];
    if (inProgressTasks.length > 0) result.push({ title: `🔄 ${t('agenda.inProgress')}`, data: inProgressTasks });
    if (overdueTasks.length > 0) result.push({ title: `🔴 ${t('agenda.overdue')}`, data: overdueTasks });
    if (todayTasks.length > 0) result.push({ title: `🟡 ${t('agenda.dueToday')}`, data: todayTasks });
    if (nextTasks.length > 0) result.push({ title: `▶️ ${t('agenda.nextActions')}`, data: nextTasks });
    if (upcomingTasks.length > 0) result.push({ title: `📆 ${t('agenda.upcoming')}`, data: upcomingTasks });

    return result;
  }, [tasks, t]);

  const handleTaskPress = useCallback((task: Task) => {
    setSelectedTask(task);
  }, []);

  const handleStatusChange = (status: 'todo' | 'next' | 'in-progress' | 'done') => {
    if (selectedTask) {
      updateTask(selectedTask.id, { status });
      setSelectedTask(null);
    }
  };

  const renderItem = useCallback(({ item }: { item: Task }) => (
    <TaskCard task={item} onPress={() => handleTaskPress(item)} tc={tc} />
  ), [handleTaskPress, tc]);

  const renderSectionHeader = useCallback(({ section: { title } }: { section: { title: string } }) => (
    <View style={[styles.sectionHeaderContainer, { backgroundColor: tc.bg }]}>
      <Text style={[
        styles.sectionTitle,
        { color: tc.text },
        title.includes('Overdue') && styles.overdueTitle
      ]}>{title}</Text>
    </View>
  ), [tc]);

  return (
    <View style={[styles.container, { backgroundColor: tc.bg }]}>
      <View style={[styles.header, { backgroundColor: tc.cardBg, borderBottomColor: tc.border }]}>
        <Text style={[styles.headerTitle, { color: tc.text }]}>📅 {t('agenda.title')}</Text>
        <Text style={[styles.headerSubtitle, { color: tc.secondaryText }]}>
          {sections.reduce((acc, sec) => acc + sec.data.length, 0)} {t('agenda.active')}
        </Text>
      </View>

      <SectionList
        sections={sections}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        renderSectionHeader={renderSectionHeader}
        contentContainerStyle={styles.content}
        stickySectionHeadersEnabled={false}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={styles.emptyIcon}>✨</Text>
            <Text style={[styles.emptyTitle, { color: tc.text }]}>{t('agenda.allClear')}</Text>
            <Text style={[styles.emptyText, { color: tc.secondaryText }]}>{t('agenda.noTasks')}</Text>
          </View>
        }
      />

      {/* Quick Action Modal */}
      {selectedTask && (
        <View style={styles.modal}>
          <View style={[styles.modalContent, { backgroundColor: tc.cardBg }]}>
            <Text style={[styles.modalTitle, { color: tc.text }]}>{selectedTask.title}</Text>
            <Text style={[styles.modalLabel, { color: tc.secondaryText }]}>Update Status:</Text>
            <View style={styles.actionButtons}>
              <Pressable
                style={[styles.actionButton, styles.todoButton]}
                onPress={() => handleStatusChange('todo')}
              >
                <Text style={styles.actionButtonText}>📋 To Do</Text>
              </Pressable>
              <Pressable
                style={[styles.actionButton, styles.nextButton]}
                onPress={() => handleStatusChange('next')}
              >
                <Text style={styles.actionButtonText}>▶️ Next</Text>
              </Pressable>
              <Pressable
                style={[styles.actionButton, styles.progressButton]}
                onPress={() => handleStatusChange('in-progress')}
              >
                <Text style={styles.actionButtonText}>🔄 Start</Text>
              </Pressable>
              <Pressable
                style={[styles.actionButton, styles.doneButton]}
                onPress={() => handleStatusChange('done')}
              >
                <Text style={styles.actionButtonText}>✅ Done</Text>
              </Pressable>
            </View>
            <Pressable
              style={styles.cancelButton}
              onPress={() => setSelectedTask(null)}
            >
              <Text style={[styles.cancelButtonText, { color: tc.secondaryText }]}>{t('common.cancel')}</Text>
            </Pressable>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#111827',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 4,
  },
  content: {
    flex: 1,
  },
  sectionHeaderContainer: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
    backgroundColor: '#F9FAFB',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
  },
  overdueTitle: {
    color: '#DC2626',
  },
  taskCard: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginBottom: 12,
    marginHorizontal: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
    overflow: 'hidden',
  },
  statusBar: {
    width: 4,
  },
  taskContent: {
    flex: 1,
    padding: 12,
  },
  taskTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  taskDescription: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 8,
  },
  taskMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 11,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  dueDate: {
    fontSize: 12,
    color: '#6B7280',
  },
  overdue: {
    color: '#DC2626',
    fontWeight: '600',
  },
  dueToday: {
    color: '#F59E0B',
    fontWeight: '600',
  },
  contextsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  contextTag: {
    fontSize: 11,
    color: '#3B82F6',
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 80,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
  },
  modal: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 24,
    width: '85%',
    maxWidth: 400,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 16,
  },
  modalLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6B7280',
    marginBottom: 12,
  },
  actionButtons: {
    gap: 8,
    marginBottom: 16,
  },
  actionButton: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  todoButton: {
    backgroundColor: '#10B981',
  },
  nextButton: {
    backgroundColor: '#3B82F6',
  },
  progressButton: {
    backgroundColor: '#EF4444',
  },
  doneButton: {
    backgroundColor: '#6B7280',
  },
  actionButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  cancelButton: {
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
  },
  cancelButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
  },
});
