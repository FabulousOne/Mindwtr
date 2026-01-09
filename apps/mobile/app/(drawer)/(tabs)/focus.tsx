import React, { useMemo } from 'react';
import { View, Text, SectionList, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { format } from 'date-fns';

import { useTaskStore, safeParseDate, type Task, type TaskStatus } from '@mindwtr/core';
import { SwipeableTaskItem } from '@/components/swipeable-task-item';
import { useThemeColors } from '@/hooks/use-theme-colors';
import { useTheme } from '../../../contexts/theme-context';
import { useLanguage } from '../../../contexts/language-context';

export default function FocusScreen() {
  const router = useRouter();
  const { tasks, updateTask, deleteTask } = useTaskStore();
  const { isDark } = useTheme();
  const { t } = useLanguage();
  const tc = useThemeColors();

  const { schedule, nextActions } = useMemo(() => {
    const now = new Date();
    const endOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);

    const scheduleItems = tasks.filter((task) => {
      if (task.deletedAt) return false;
      if (task.status === 'done') return false;
      const due = safeParseDate(task.dueDate);
      const start = safeParseDate(task.startTime);
      return Boolean(task.isFocusedToday)
        || Boolean(due && due <= endOfToday)
        || Boolean(start && start <= endOfToday);
    });

    const scheduleIds = new Set(scheduleItems.map((task) => task.id));

    const nextItems = tasks.filter((task) => {
      if (task.deletedAt) return false;
      if (task.status !== 'next') return false;
      return !scheduleIds.has(task.id);
    });

    return { schedule: scheduleItems, nextActions: nextItems };
  }, [tasks]);

  const sections = useMemo(() => ([
    { title: t('focus.schedule') ?? 'Today', data: schedule, type: 'schedule' as const },
    { title: t('focus.nextActions') ?? t('list.next'), data: nextActions, type: 'next' as const },
  ]), [schedule, nextActions, t]);

  const renderItem = ({ item }: { item: Task }) => (
    <View style={styles.itemWrapper}>
      <SwipeableTaskItem
        task={item}
        isDark={isDark}
        tc={tc}
        onPress={() => router.push(`/check-focus?id=${item.id}`)}
        onStatusChange={(status) => updateTask(item.id, { status: status as TaskStatus })}
        onDelete={() => deleteTask(item.id)}
        showFocusToggle
      />
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: tc.bg }]}>
      <SectionList
        sections={sections}
        keyExtractor={(item) => item.id}
        stickySectionHeadersEnabled={false}
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={(
          <View style={styles.header}>
            <Text style={[styles.greeting, { color: tc.text }]}>{t('tab.next')}</Text>
            <Text style={[styles.dateText, { color: tc.secondaryText }]}>
              {format(new Date(), 'EEEE, MMMM do')}
            </Text>
          </View>
        )}
        renderSectionHeader={({ section }) => (
          section.data.length > 0 ? (
            <View style={styles.sectionHeader}>
              <Text style={[styles.sectionTitle, { color: tc.tint }]}>{section.title}</Text>
              <View style={[styles.sectionLine, { backgroundColor: tc.border }]} />
            </View>
          ) : null
        )}
        renderItem={renderItem}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={[styles.emptyTitle, { color: tc.text }]}>{t('agenda.allClear')}</Text>
            <Text style={[styles.emptySubtitle, { color: tc.secondaryText }]}>{t('agenda.noTasks')}</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 110,
  },
  header: {
    marginTop: 16,
    marginBottom: 16,
  },
  greeting: {
    fontSize: 28,
    fontWeight: '800',
    marginBottom: 4,
  },
  dateText: {
    fontSize: 13,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginTop: 18,
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  sectionLine: {
    flex: 1,
    height: 1,
    borderRadius: 1,
  },
  itemWrapper: {
    marginBottom: 10,
  },
  emptyState: {
    paddingVertical: 40,
    alignItems: 'center',
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '700',
  },
  emptySubtitle: {
    marginTop: 4,
    fontSize: 12,
    fontWeight: '600',
  },
});
