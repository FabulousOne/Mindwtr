import React, { useEffect, useRef, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useTaskStore, parseQuickAdd, Task } from '@mindwtr/core';
import { useTheme } from '../contexts/theme-context';
import { useLanguage } from '../contexts/language-context';
import { Colors } from '@/constants/theme';

export default function CaptureScreen() {
  const params = useLocalSearchParams<{ text?: string }>();
  const router = useRouter();
  const { addTask, projects } = useTaskStore();
  const { isDark } = useTheme();
  const { t } = useLanguage();
  const initialText = typeof params.text === 'string' ? decodeURIComponent(params.text) : '';
  const [value, setValue] = useState(initialText);
  const inputRef = useRef<TextInput>(null);

  useEffect(() => {
    setTimeout(() => inputRef.current?.focus(), 120);
  }, []);

  useEffect(() => {
    if (typeof params.text === 'string') {
      setValue(decodeURIComponent(params.text));
    }
  }, [params.text]);

  const tc = {
    bg: isDark ? Colors.dark.background : Colors.light.background,
    cardBg: isDark ? '#1F2937' : '#FFFFFF',
    text: isDark ? Colors.dark.text : Colors.light.text,
    secondaryText: isDark ? '#9CA3AF' : '#6B7280',
    border: isDark ? '#374151' : '#E5E7EB',
    placeholder: isDark ? '#6B7280' : '#9CA3AF',
    inputBg: isDark ? '#374151' : '#F9FAFB',
  };

  const handleSave = () => {
    if (!value.trim()) return;
    const { title, props } = parseQuickAdd(value, projects);
    const finalTitle = title || value;
    if (!finalTitle.trim()) return;
    const initialProps: Partial<Task> = { status: 'inbox', ...props };
    if (!props.status) initialProps.status = 'inbox';
    addTask(finalTitle, initialProps);
    router.replace('/inbox');
  };

  return (
    <View style={[styles.container, { backgroundColor: tc.bg }]}>
      <View style={[styles.card, { backgroundColor: tc.cardBg, borderColor: tc.border }]}>
        <Text style={[styles.title, { color: tc.text }]}>{t('nav.addTask')}</Text>
        <TextInput
          ref={inputRef}
          style={[styles.input, { backgroundColor: tc.inputBg, borderColor: tc.border, color: tc.text }]}
          placeholder={t('quickAdd.example')}
          placeholderTextColor={tc.placeholder}
          value={value}
          onChangeText={setValue}
          onSubmitEditing={handleSave}
          returnKeyType="done"
          multiline
        />
        <Text style={[styles.help, { color: tc.secondaryText }]}>{t('quickAdd.help')}</Text>
        <View style={styles.actions}>
          <TouchableOpacity onPress={() => router.back()} style={[styles.button, styles.cancel, { backgroundColor: tc.inputBg }]}>
            <Text style={{ color: tc.text }}>{t('common.cancel')}</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleSave} style={[styles.button, styles.save]}>
            <Text style={styles.saveText}>{t('common.save')}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    justifyContent: 'center',
  },
  card: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 16,
    gap: 12,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    minHeight: 80,
  },
  help: {
    fontSize: 12,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 8,
  },
  button: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 8,
  },
  cancel: {},
  save: {
    backgroundColor: '#3B82F6',
  },
  saveText: {
    color: '#fff',
    fontWeight: '600',
  },
});
