import { useEffect, useState } from 'react';
import { Layout } from './components/Layout';
import { ListView } from './components/views/ListView';
import { CalendarView } from './components/views/CalendarView';
import { BoardView } from './components/views/BoardView';
import { ProjectsView } from './components/views/ProjectsView';
import { ContextsView } from './components/views/ContextsView';
import { ReviewView } from './components/views/ReviewView';
import { TutorialView } from './components/views/TutorialView';
import { SettingsView } from './components/views/SettingsView';
import { ArchiveView } from './components/views/ArchiveView';
import { AgendaView } from './components/views/AgendaView';
import { SearchView } from './components/views/SearchView';
import { useTaskStore, flushPendingSave } from '@mindwtr/core';
import { GlobalSearch } from './components/GlobalSearch';
import { ErrorBoundary } from './components/ErrorBoundary';
import { useLanguage } from './contexts/language-context';
import { KeybindingProvider } from './contexts/keybinding-context';
import { QuickAddModal } from './components/QuickAddModal';
import { startDesktopNotifications, stopDesktopNotifications } from './lib/notification-service';
import { SyncService } from './lib/sync-service';
import { isTauriRuntime } from './lib/runtime';

    function App() {
        const [currentView, setCurrentView] = useState('inbox');
        const { fetchData } = useTaskStore();
        const { t } = useLanguage();

    useEffect(() => {
        fetchData();

        const handleUnload = () => {
            flushPendingSave().catch(console.error);
        };
        window.addEventListener('beforeunload', handleUnload);

        if (isTauriRuntime()) {
            startDesktopNotifications().catch(console.error);
        }

        let lastAutoSync = 0;
        const autoSync = async () => {
            if (!isTauriRuntime()) return;
            const path = await SyncService.getSyncPath();
            if (!path) return;
            const now = Date.now();
            if (now - lastAutoSync < 30_000) return;
            lastAutoSync = now;
            await SyncService.performSync();
        };

        const focusListener = () => {
            autoSync().catch(console.error);
        };

        // Background/on-resume sync (focus) and initial auto-sync.
        window.addEventListener('focus', focusListener);
        setTimeout(() => autoSync().catch(console.error), 1500);

        return () => {
            window.removeEventListener('beforeunload', handleUnload);
            window.removeEventListener('focus', focusListener);
            stopDesktopNotifications();
        };
    }, [fetchData]);

    const renderView = () => {
        if (currentView.startsWith('savedSearch:')) {
            const savedSearchId = currentView.replace('savedSearch:', '');
            return <SearchView savedSearchId={savedSearchId} />;
        }
        switch (currentView) {
            case 'inbox':
                return <ListView title={t('list.inbox')} statusFilter="inbox" />;
            case 'agenda':
                return <AgendaView />;
            case 'next':
                return <ListView title={t('list.next')} statusFilter="next" />;
            case 'someday':
                return <ListView title={t('list.someday')} statusFilter="someday" />;
            case 'waiting':
                return <ListView title={t('list.waiting')} statusFilter="waiting" />;
            case 'done':
                return <ListView title={t('list.done')} statusFilter="done" />;
            case 'calendar':
                return <CalendarView />;
            case 'board':
                return <BoardView />;
            case 'projects':
                return <ProjectsView />;
            case 'contexts':
                return <ContextsView />;
            case 'review':
                return <ReviewView />;
            case 'tutorial':
                return <TutorialView />;
            case 'settings':
                return <SettingsView />;
            case 'archived':
                return <ArchiveView />;
            default:
                return <ListView title={t('list.inbox')} statusFilter="inbox" />;
        }
    };

    return (
        <ErrorBoundary>
            <KeybindingProvider currentView={currentView} onNavigate={setCurrentView}>
                <Layout currentView={currentView} onViewChange={setCurrentView}>
                    {renderView()}
                    <GlobalSearch onNavigate={(view, _id) => setCurrentView(view)} />
                    <QuickAddModal />
                </Layout>
            </KeybindingProvider>
        </ErrorBoundary>
    );
}

export default App;
