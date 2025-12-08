import { View, Text, ScrollView, Pressable, StyleSheet } from 'react-native';
import { useTaskStore } from '@focus-gtd/core';
import type { Task } from '@focus-gtd/core';
import { useTheme } from '../../contexts/theme-context';
import { useLanguage } from '../../contexts/language-context';
import { Colors } from '@/constants/theme';

function TaskCard({ task, onStatusChange }: {
  task: Task;
  onStatusChange: (id: string, status: 'next' | 'done') => void;
}) {
  return (
    <View style={styles.taskCard}>
      <View style={styles.taskContent}>
        <Text style={styles.taskTitle}>{task.title}</Text>
        {task.description && (
          <Text style={styles.taskDescription} numberOfLines={2}>
            {task.description}
          </Text>
        )}
        {task.contexts && task.contexts.length > 0 && (
          <View style={styles.contextsRow}>
            {task.contexts.map((ctx, idx) => (
              <Text key={idx} style={styles.contextTag}>
                {ctx}
              </Text>
            ))}
          </View>
        )}
        <Text style={styles.createdDate}>
          Added: {new Date(task.createdAt).toLocaleDateString()}
        </Text>
      </View>
      <View style={styles.actions}>
        <Pressable
          style={[styles.actionButton, styles.nextButton]}
          onPress={() => onStatusChange(task.id, 'next')}
        >
          <Text style={styles.actionButtonText}>Move to Next</Text>
        </Pressable>
        <Pressable
          style={[styles.actionButton, styles.doneButton]}
          onPress={() => onStatusChange(task.id, 'done')}
        >
          <Text style={styles.actionButtonText}>Archive</Text>
        </Pressable>
      </View>
    </View>
  );
}

export function SomedayView() {
  const { tasks, updateTask } = useTaskStore();
  const { isDark } = useTheme();
  const { t } = useLanguage();

  const tc = {
    bg: isDark ? Colors.dark.background : Colors.light.background,
    cardBg: isDark ? '#1F2937' : '#FFFFFF',
    text: isDark ? Colors.dark.text : Colors.light.text,
    secondaryText: isDark ? '#9CA3AF' : '#6B7280',
    border: isDark ? '#374151' : '#E5E7EB',
  };

  const somedayTasks = tasks
    .filter((t) => t.status === 'someday')
    .sort((a, b) => {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

  const handleStatusChange = (id: string, status: 'next' | 'done') => {
    updateTask(id, { status });
  };

  return (
    <View style={[styles.container, { backgroundColor: tc.bg }]}>
      <View style={[styles.header, { backgroundColor: tc.cardBg, borderBottomColor: tc.border }]}>
        <Text style={[styles.title, { color: tc.text }]}>💭 {t('someday.title')}</Text>
        <Text style={[styles.subtitle, { color: tc.secondaryText }]}>
          {t('someday.subtitle')}
        </Text>
      </View>

      <View style={[styles.stats, { backgroundColor: tc.cardBg, borderBottomColor: tc.border }]}>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{somedayTasks.length}</Text>
          <Text style={styles.statLabel}>Ideas</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>
            {somedayTasks.filter((t) => t.projectId).length}
          </Text>
          <Text style={styles.statLabel}>In Projects</Text>
        </View>
      </View>

      <ScrollView style={styles.taskList} showsVerticalScrollIndicator={false}>
        {somedayTasks.length > 0 ? (
          somedayTasks.map((task) => (
            <TaskCard key={task.id} task={task} onStatusChange={handleStatusChange} />
          ))
        ) : (
          <View style={styles.emptyState}>
            <Text style={styles.emptyIcon}>💭</Text>
            <Text style={styles.emptyTitle}>No someday/maybe items</Text>
            <Text style={styles.emptyText}>
              Use "Someday" status for ideas, goals, and projects you might want to do in
              the future but aren't ready to commit to now
            </Text>
          </View>
        )}
      </ScrollView>
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
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
  },
  subtitle: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 4,
  },
  stats: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    gap: 24,
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#8B5CF6',
  },
  statLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 4,
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
    borderLeftColor: '#8B5CF6',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  taskContent: {
    marginBottom: 12,
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
    marginBottom: 4,
  },
  contextsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginTop: 4,
    marginBottom: 4,
  },
  contextTag: {
    fontSize: 12,
    color: '#3B82F6',
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  createdDate: {
    fontSize: 12,
    color: '#9CA3AF',
    fontStyle: 'italic',
  },
  actions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  nextButton: {
    backgroundColor: '#3B82F6',
  },
  doneButton: {
    backgroundColor: '#6B7280',
  },
  actionButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 48,
    paddingHorizontal: 24,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 20,
  },
});
