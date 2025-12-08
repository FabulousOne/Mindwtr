import React, { useState } from 'react';
import { View, Text, TextInput, FlatList, StyleSheet, TouchableOpacity, Modal } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTaskStore } from '@focus-gtd/core';

import { TaskList } from '../components/task-list';
import { Project } from '@focus-gtd/core';
import { useTheme } from '../contexts/theme-context';
import { useLanguage } from '../contexts/language-context';
import { Colors } from '@/constants/theme';

export default function ProjectsScreen() {
  const { projects, addProject, deleteProject } = useTaskStore();
  const { isDark } = useTheme();
  const { t } = useLanguage();
  const [newProjectTitle, setNewProjectTitle] = useState('');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  const tc = {
    bg: isDark ? Colors.dark.background : Colors.light.background,
    cardBg: isDark ? '#1F2937' : '#FFFFFF',
    text: isDark ? Colors.dark.text : Colors.light.text,
    secondaryText: isDark ? '#9CA3AF' : '#6B7280',
    border: isDark ? '#374151' : '#E5E7EB',
    inputBg: isDark ? '#374151' : '#f9f9f9',
  };

  const colors = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];
  const [selectedColor, setSelectedColor] = useState(colors[0]);

  const handleAddProject = () => {
    if (newProjectTitle.trim()) {
      addProject(newProjectTitle, selectedColor);
      setNewProjectTitle('');
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: tc.bg }]}>
      <View style={[styles.header, { borderBottomColor: tc.border }]}>
        <Text style={[styles.title, { color: tc.text }]}>{t('projects.title')}</Text>
        <Text style={[styles.count, { color: tc.secondaryText }]}>{projects.length} {t('projects.count')}</Text>
      </View>

      <View style={[styles.inputContainer, { borderBottomColor: tc.border }]}>
        <TextInput
          style={[styles.input, { borderColor: tc.border, backgroundColor: tc.inputBg, color: tc.text }]}
          placeholder={t('projects.addPlaceholder')}
          placeholderTextColor={tc.secondaryText}
          value={newProjectTitle}
          onChangeText={setNewProjectTitle}
          onSubmitEditing={handleAddProject}
          returnKeyType="done"
        />
        <View style={styles.colorPicker}>
          {colors.map((color) => (
            <TouchableOpacity
              key={color}
              style={[
                styles.colorOption,
                { backgroundColor: color },
                selectedColor === color && styles.colorOptionSelected,
              ]}
              onPress={() => setSelectedColor(color)}
            />
          ))}
        </View>
        <TouchableOpacity
          onPress={handleAddProject}
          style={[styles.addButton, !newProjectTitle.trim() && styles.addButtonDisabled]}
          disabled={!newProjectTitle.trim()}
        >
          <Text style={styles.addButtonText}>{t('projects.add')}</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={projects}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={[styles.emptyText, { color: tc.secondaryText }]}>{t('projects.empty')}</Text>
          </View>
        }
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[styles.projectItem, { backgroundColor: tc.cardBg }]}
            onPress={() => setSelectedProject(item)}
          >
            <View style={[styles.projectColor, { backgroundColor: item.color }]} />
            <View style={styles.projectContent}>
              <Text style={[styles.projectTitle, { color: tc.text }]}>{item.title}</Text>
              <Text style={[styles.projectMeta, { color: tc.secondaryText }]}>{item.status}</Text>
            </View>
            <TouchableOpacity
              onPress={() => deleteProject(item.id)}
              style={styles.deleteButton}
            >
              <Text style={styles.deleteText}>×</Text>
            </TouchableOpacity>
          </TouchableOpacity>
        )}
      />

      <Modal
        visible={!!selectedProject}
        animationType="slide"
        onRequestClose={() => setSelectedProject(null)}
      >
        <SafeAreaView style={{ flex: 1, backgroundColor: tc.bg }}>
          {selectedProject && (
            <>
              <View style={[styles.modalHeader, { borderBottomColor: tc.border, backgroundColor: tc.cardBg }]}>
                <TouchableOpacity onPress={() => setSelectedProject(null)} style={styles.backButton}>
                  <Text style={styles.backButtonText}>{t('projects.back')}</Text>
                </TouchableOpacity>
                <Text style={[styles.modalTitle, { color: tc.text }]}>{selectedProject.title}</Text>
                <View style={{ width: 60 }} />
              </View>
              <TaskList
                statusFilter="all"
                title={selectedProject.title}
                projectId={selectedProject.id}
                allowAdd={true}
              />
            </>
          )}
        </SafeAreaView>
      </Modal>
    </View >
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e5e5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  count: {
    fontSize: 14,
    color: '#666',
  },
  inputContainer: {
    padding: 16,
    gap: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e5e5',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 16,
  },
  colorPicker: {
    flexDirection: 'row',
    gap: 8,
  },
  colorOption: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  colorOptionSelected: {
    borderColor: '#000',
  },
  addButton: {
    backgroundColor: '#007AFF',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
  },
  addButtonDisabled: {
    opacity: 0.5,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  listContent: {
    padding: 16,
  },
  projectItem: {
    flexDirection: 'row',
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
    alignItems: 'center',
  },
  projectColor: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 12,
  },
  projectContent: {
    flex: 1,
  },
  projectTitle: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 4,
  },
  projectMeta: {
    fontSize: 12,
    color: '#666',
  },
  deleteButton: {
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  deleteText: {
    fontSize: 28,
    color: '#999',
    fontWeight: '300',
  },
  emptyContainer: {
    padding: 48,
    alignItems: 'center',
  },
  emptyText: {
    color: '#999',
    fontSize: 16,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e5e5',
  },
  backButton: {
    padding: 8,
    width: 60,
  },
  backButtonText: {
    fontSize: 16,
    color: '#007AFF',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});
