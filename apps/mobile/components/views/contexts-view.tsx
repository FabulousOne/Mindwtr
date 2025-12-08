import { View, Text, ScrollView, Pressable, StyleSheet } from 'react-native';
import { useTaskStore } from '@focus-gtd/core';
import type { Task } from '@focus-gtd/core';
import { useState } from 'react';
import { useTheme } from '../../contexts/theme-context';
import { useLanguage } from '../../contexts/language-context';
import { Colors } from '@/constants/theme';

function TaskItem({ task, onPress }: { task: Task; onPress: () => void }) {
  return (
    <Pressable style={styles.taskItem} onPress={onPress}>
      <View style={styles.taskContent}>
        <Text style={styles.taskTitle} numberOfLines={2}>
          {task.title}
        </Text>
        {task.description && (
          <Text style={styles.taskDescription} numberOfLines={1}>
            {task.description}
          </Text>
        )}
        {task.dueDate && (
          <Text style={styles.taskDueDate}>
            Due: {new Date(task.dueDate).toLocaleDateString()}
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
      </View>
      <View style={[styles.statusIndicator, { backgroundColor: getStatusColor(task.status) }]} />
    </Pressable>
  );
}

function TaskItemWithTheme({ task, onPress, isDark, tc }: { task: Task; onPress: () => void; isDark: boolean; tc: any }) {
  return (
    <Pressable style={[styles.taskItem, { backgroundColor: tc.cardBg }]} onPress={onPress}>
      <View style={styles.taskContent}>
        <Text style={[styles.taskTitle, { color: tc.text }]} numberOfLines={2}>
          {task.title}
        </Text>
        {task.description && (
          <Text style={[styles.taskDescription, { color: tc.secondaryText }]} numberOfLines={1}>
            {task.description}
          </Text>
        )}
        {task.dueDate && (
          <Text style={styles.taskDueDate}>
            Due: {new Date(task.dueDate).toLocaleDateString()}
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
      </View>
      <View style={[styles.statusIndicator, { backgroundColor: getStatusColor(task.status) }]} />
    </Pressable>
  );
}

function getStatusColor(status: string): string {
  const colors: Record<string, string> = {
    inbox: '#6B7280',
    next: '#3B82F6',
    waiting: '#F59E0B',
    someday: '#8B5CF6',
    done: '#10B981',
  };
  return colors[status] || '#6B7280';
}

export function ContextsView() {
  const { tasks } = useTaskStore();
  const { isDark } = useTheme();
  const { t } = useLanguage();
  const [selectedContext, setSelectedContext] = useState<string | null>(null);

  const tc = {
    bg: isDark ? Colors.dark.background : Colors.light.background,
    cardBg: isDark ? '#1F2937' : '#FFFFFF',
    text: isDark ? Colors.dark.text : Colors.light.text,
    secondaryText: isDark ? '#9CA3AF' : '#6B7280',
    border: isDark ? '#374151' : '#E5E7EB',
  };

  // Extract all unique contexts from tasks
  const allContexts = Array.from(
    new Set(tasks.flatMap((t) => t.contexts || []))
  ).sort();

  const activeTasks = tasks.filter((t) => t.status !== 'done');
  const filteredTasks = selectedContext
    ? activeTasks.filter((t) => t.contexts?.includes(selectedContext))
    : activeTasks.filter((t) => (t.contexts?.length || 0) > 0);

  // Sort by due date
  const sortedTasks = [...filteredTasks].sort((a, b) => {
    if (a.dueDate && !b.dueDate) return -1;
    if (!a.dueDate && b.dueDate) return 1;
    if (a.dueDate && b.dueDate) {
      return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
    }
    return 0;
  });

  return (
    <View style={[styles.container, { backgroundColor: tc.bg }]}>
      <View style={[styles.header, { backgroundColor: tc.cardBg, borderBottomColor: tc.border }]}>
        <Text style={[styles.title, { color: tc.text }]}>{t('contexts.title')}</Text>
        <Text style={[styles.subtitle, { color: tc.secondaryText }]}>{t('contexts.filter')}</Text>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={[styles.contextsBar, { backgroundColor: tc.cardBg, borderBottomColor: tc.border }]}
        contentContainerStyle={styles.contextsBarContent}
      >
        <Pressable
          style={[
            styles.contextButton,
            { backgroundColor: isDark ? '#374151' : '#F3F4F6' },
            selectedContext === null && styles.contextButtonActive,
          ]}
          onPress={() => setSelectedContext(null)}
        >
          <Text
            style={[
              styles.contextButtonText,
              { color: isDark ? '#D1D5DB' : '#4B5563' },
              selectedContext === null && styles.contextButtonTextActive,
            ]}
          >
            {t('contexts.all')}
          </Text>
          <View style={styles.contextBadge}>
            <Text style={styles.contextBadgeText}>
              {activeTasks.filter((t) => (t.contexts?.length || 0) > 0).length}
            </Text>
          </View>
        </Pressable>

        {allContexts.map((context) => {
          const count = activeTasks.filter((t) => t.contexts?.includes(context)).length;
          return (
            <Pressable
              key={context}
              style={[
                styles.contextButton,
                { backgroundColor: isDark ? '#374151' : '#F3F4F6' },
                selectedContext === context && styles.contextButtonActive,
              ]}
              onPress={() => setSelectedContext(context)}
            >
              <Text
                style={[
                  styles.contextButtonText,
                  { color: isDark ? '#D1D5DB' : '#4B5563' },
                  selectedContext === context && styles.contextButtonTextActive,
                ]}
              >
                {context}
              </Text>
              <View style={styles.contextBadge}>
                <Text style={styles.contextBadgeText}>{count}</Text>
              </View>
            </Pressable>
          );
        })}
      </ScrollView>

      <View style={styles.content}>
        <View style={[styles.contentHeader, { backgroundColor: tc.cardBg, borderBottomColor: tc.border }]}>
          <Text style={[styles.contentTitle, { color: tc.text }]}>
            {selectedContext || t('contexts.all')}
          </Text>
          <Text style={[styles.contentCount, { color: tc.secondaryText }]}>{sortedTasks.length} {t('common.tasks')}</Text>
        </View>

        <ScrollView style={[styles.taskList, { backgroundColor: tc.bg }]} showsVerticalScrollIndicator={false}>
          {sortedTasks.length > 0 ? (
            sortedTasks.map((task) => (
              <TaskItemWithTheme
                key={task.id}
                task={task}
                isDark={isDark}
                tc={tc}
                onPress={() => {
                  // Could navigate to task detail or open modal
                }}
              />
            ))
          ) : (
            <View style={styles.emptyState}>
              {allContexts.length === 0 ? (
                <>
                  <Text style={styles.emptyIcon}>🏷️</Text>
                  <Text style={[styles.emptyTitle, { color: tc.text }]}>{t('contexts.noContexts').split('.')[0]}</Text>
                  <Text style={[styles.emptyText, { color: tc.secondaryText }]}>
                    {t('contexts.noContexts')}
                  </Text>
                </>
              ) : (
                <>
                  <Text style={styles.emptyIcon}>✓</Text>
                  <Text style={[styles.emptyTitle, { color: tc.text }]}>{t('contexts.noTasks')}</Text>
                  <Text style={[styles.emptyText, { color: tc.secondaryText }]}>
                    {selectedContext
                      ? `${t('contexts.noTasks')} ${selectedContext}`
                      : t('contexts.noTasks')}
                  </Text>
                </>
              )}
            </View>
          )}
        </ScrollView>
      </View>
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
  contextsBar: {
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    maxHeight: 70,
  },
  contextsBarContent: {
    padding: 12,
    gap: 8,
  },
  contextButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
  },
  contextButtonActive: {
    backgroundColor: '#3B82F6',
  },
  contextButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#4B5563',
  },
  contextButtonTextActive: {
    color: '#FFFFFF',
  },
  contextBadge: {
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 10,
    minWidth: 20,
    alignItems: 'center',
  },
  contextBadgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  content: {
    flex: 1,
  },
  contentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  contentTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
  },
  contentCount: {
    fontSize: 14,
    color: '#6B7280',
  },
  taskList: {
    flex: 1,
    padding: 16,
  },
  taskItem: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  taskContent: {
    flex: 1,
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
  taskDueDate: {
    fontSize: 12,
    color: '#DC2626',
    marginBottom: 4,
  },
  contextsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginTop: 4,
  },
  contextTag: {
    fontSize: 12,
    color: '#3B82F6',
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  statusIndicator: {
    width: 4,
    borderRadius: 2,
    marginLeft: 12,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 48,
    paddingHorizontal: 24,
  },
  emptyIcon: {
    fontSize: 48,
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
  },
});
