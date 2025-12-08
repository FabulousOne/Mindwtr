import React, { createContext, useContext, useState, useEffect } from 'react';

export type Language = 'en' | 'zh';

interface LanguageContextType {
    language: Language;
    setLanguage: (lang: Language) => void;
    t: (key: string) => string;
}

const translations: Record<Language, Record<string, string>> = {
    en: {
        // App
        'app.name': 'Focus GTD',

        // Navigation
        'nav.inbox': 'Inbox',
        'nav.board': 'Board View',
        'nav.projects': 'Projects',
        'nav.contexts': 'Contexts',
        'nav.next': 'Next Actions',
        'nav.waiting': 'Waiting For',
        'nav.someday': 'Someday/Maybe',
        'nav.calendar': 'Calendar',
        'nav.review': 'Weekly Review',
        'nav.tutorial': 'Tutorial',
        'nav.settings': 'Settings',
        'nav.done': 'Done',
        'nav.addTask': 'Add Task',

        // List Views
        'list.inbox': 'Inbox',
        'list.next': 'Next Actions',
        'list.someday': 'Someday/Maybe',
        'list.waiting': 'Waiting For',
        'list.done': 'Completed',

        // Board
        'board.title': 'Board View',
        'board.todo': 'Todo',
        'board.inProgress': 'In Progress',
        'board.done': 'Done',

        // Calendar
        'calendar.title': 'Calendar',

        // Projects
        'projects.title': 'Projects',
        'projects.noProjects': 'No projects yet.',
        'projects.selectProject': 'Select a project to view tasks',
        'projects.addTask': 'Add Task',
        'projects.addTaskPlaceholder': 'Add a task to this project...',
        'projects.noActiveTasks': 'No active tasks in this project.',
        'projects.projectName': 'Project Name',
        'projects.color': 'Color',
        'projects.create': 'Create',
        'projects.deleteConfirm': 'Are you sure you want to delete this project?',
        // Tutorial
        'tutorial.title': 'Getting Things Done',
        'tutorial.subtitle': 'A guide to mastering your productivity with this application.',
        'tutorial.capture': '1. Capture (Inbox)',
        'tutorial.captureText': 'The <strong>Inbox</strong> is your landing zone for everything. Don\'t worry about organizing yet—just get it out of your head.',
        'tutorial.captureList1': 'Use the "Add Task" button anywhere or go to the Inbox view.',
        'tutorial.captureList2': 'Write down tasks, ideas, or reminders quickly.',
        'tutorial.captureList3': 'Aim to empty your head completely.',
        'tutorial.clarify': '2. Clarify & Organize',
        'tutorial.clarifyText': 'Process your Inbox regularly. For each item, decide what it is and where it belongs.',
        'tutorial.actionable': 'Actionable?',
        'tutorial.notActionable': 'Not Actionable?',
        'tutorial.nextActions': 'Next Actions: Do it as soon as possible.',
        'tutorial.projects': 'Projects: Multi-step outcomes.',
        'tutorial.waitingFor': 'Waiting For: Delegated to someone else.',
        'tutorial.calendar': 'Calendar: Must be done on a specific day.',
        'tutorial.someday': 'Someday/Maybe: Ideas for the future.',
        'tutorial.reference': 'Reference: Keep for info (add to notes).',
        'tutorial.trash': 'Trash: Delete it.',
        'tutorial.reflect': '3. Reflect (Weekly Review)',
        'tutorial.reflectText': 'The <strong>Weekly Review</strong> is critical. It keeps your system trusted and current.',
        'tutorial.reflectStep1': 'Clear your mind and inbox.',
        'tutorial.reflectStep2': 'Review your calendar (past and upcoming).',
        'tutorial.reflectStep3': 'Follow up on "Waiting For" items.',
        'tutorial.reflectStep4': 'Review Project lists and "Someday/Maybe" items.',
        'tutorial.features': 'App Features',
        'tutorial.contextsTitle': 'Contexts',
        'tutorial.contextsText': 'Use @tags (e.g., @home, @work) to filter tasks by where you are or what tool you need.',
        'tutorial.projectsTitle': 'Projects',
        'tutorial.projectsText': 'Group related tasks into Projects. Give them colors to easily distinguish them.',
        'tutorial.boardTitle': 'Kanban Board',
        'tutorial.boardText': 'Visualize your workflow. Drag and drop tasks between states (Next, Waiting, Done).',

        // Review Steps
        'review.title': 'Weekly Review',
        'review.intro': 'Get clear, get current, and get creative.',
        'review.timeFor': 'Time for your Weekly Review',
        'review.timeForDesc': 'Clear your mind and get organized. This process will guide you through cleaning up your lists and planning for the week ahead.',
        'review.startReview': 'Start Review',
        'review.inboxStep': 'Process Inbox',
        'review.inboxStepDesc': 'Clarify and organize your inbox items.',
        'review.inboxZero': 'Inbox Zero Goal',
        'review.inboxZeroDesc': 'items in your Inbox. Process them by clarifying what they are and organizing them into next actions, projects, or trash.',
        'review.inboxEmpty': 'Inbox is empty! Great job.',
        'review.calendarStep': 'Review Calendar',
        'review.calendarStepDesc': 'Check past 2 weeks and upcoming 2 weeks.',
        'review.past14': 'Past 14 Days',
        'review.past14Desc': 'Review your calendar for the past two weeks. Did you miss anything? Do any completed appointments require follow-up actions?',
        'review.upcoming14': 'Upcoming 14 Days',
        'review.upcoming14Desc': 'Look at the upcoming two weeks. What do you need to prepare for? Capture any new next actions.',
        'review.waitingStep': 'Waiting For',
        'review.waitingStepDesc': 'Follow up on delegated tasks.',
        'review.waitingHint': 'Review these items. Have you received what you\'re waiting for? Do you need to send a reminder?',
        'review.waitingEmpty': 'Nothing in Waiting For.',
        'review.projectsStep': 'Review Projects',
        'review.projectsStepDesc': 'Ensure every active project has a next action.',
        'review.projectsHint': 'Review each project. Does it have at least one concrete Next Action? If not, add one now. Mark completed projects as done.',
        'review.hasNextAction': 'Has Next Action',
        'review.needsAction': 'Needs Action',
        'review.noActiveTasks': 'No active tasks',
        'review.somedayStep': 'Someday/Maybe',
        'review.somedayStepDesc': 'Review projects you might want to start.',
        'review.somedayHint': 'Review your Someday/Maybe list. Is there anything here you want to make active now? Or delete?',
        'review.listEmpty': 'List is empty.',
        'review.allDone': 'All Done!',
        'review.allDoneDesc': 'You are ready for the week ahead.',
        'review.complete': 'Review Complete!',
        'review.completeDesc': 'You\'ve clarified your inputs, updated your lists, and you\'re ready to engage with your work.',
        'review.finish': 'Finish',
        'review.step': 'Step',
        'review.of': 'of',
        'review.back': 'Back',
        'review.nextStepBtn': 'Next Step',

        // Settings
        'settings.title': 'Settings',
        'settings.subtitle': 'Customize your Focus GTD experience',
        'settings.appearance': 'Appearance',
        'settings.system': 'System',
        'settings.systemDesc': 'Follow system preference',
        'settings.light': 'Light',
        'settings.lightDesc': 'Light mode',
        'settings.dark': 'Dark',
        'settings.darkDesc': 'Dark mode',
        'settings.language': 'Language',
        'settings.about': 'About',
        'settings.version': 'Version',
        'settings.platform': 'Platform',

        // Common
        'common.tasks': 'tasks',
        'common.cancel': 'Cancel',
        'common.save': 'Save',
        'common.delete': 'Delete',
        'common.edit': 'Edit',
        'common.add': 'Add',
        'common.all': 'All',
    },
    zh: {
        // App
        'app.name': 'Focus GTD',

        // Navigation
        'nav.inbox': '收集箱',
        'nav.board': '看板',
        'nav.projects': '项目',
        'nav.contexts': '情境',
        'nav.next': '下一步行动',
        'nav.waiting': '等待中',
        'nav.someday': '将来/也许',
        'nav.calendar': '日历',
        'nav.review': '每周回顾',
        'nav.tutorial': '教程',
        'nav.settings': '设置',
        'nav.done': '已完成',
        'nav.addTask': '添加任务',

        // List Views
        'list.inbox': '收集箱',
        'list.next': '下一步行动',
        'list.someday': '将来/也许',
        'list.waiting': '等待中',
        'list.done': '已完成',

        // Board
        'board.title': '看板',
        'board.todo': '待办',
        'board.inProgress': '进行中',
        'board.done': '已完成',

        // Calendar
        'calendar.title': '日历',

        // Projects
        'projects.title': '项目',
        'projects.noProjects': '暂无项目',
        'projects.selectProject': '选择一个项目查看任务',
        'projects.addTask': '添加任务',
        'projects.addTaskPlaceholder': '添加一个任务到此项目...',
        'projects.noActiveTasks': '此项目没有活动任务',
        'projects.projectName': '项目名称',
        'projects.color': '颜色',
        'projects.create': '创建',
        'projects.deleteConfirm': '确定要删除此项目吗？',

        // Review
        'review.title': '每周回顾',
        'review.tasks': '回顾任务',
        'review.all': '全部',
        'review.noTasks': '没有需要回顾的任务',

        // Settings
        'settings.title': '设置',
        'settings.subtitle': '自定义您的 Focus GTD 体验',
        'settings.appearance': '外观',
        'settings.system': '系统',
        'settings.systemDesc': '跟随系统设置',
        'settings.light': '浅色',
        'settings.lightDesc': '浅色主题',
        'settings.dark': '深色',
        'settings.darkDesc': '深色主题',
        'settings.language': '语言',
        'settings.about': '关于',
        'settings.version': '版本',
        'settings.platform': '平台',

        // Common
        'common.tasks': '个任务',
        'common.cancel': '取消',
        'common.save': '保存',
        'common.delete': '删除',
        'common.edit': '编辑',
        'common.add': '添加',
        'common.all': '全部',
    },
};

const LANGUAGE_STORAGE_KEY = 'focus-gtd-language';

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
    const [language, setLanguageState] = useState<Language>('en');

    useEffect(() => {
        const saved = localStorage.getItem(LANGUAGE_STORAGE_KEY);
        if (saved === 'en' || saved === 'zh') {
            setLanguageState(saved);
        }
    }, []);

    const setLanguage = (lang: Language) => {
        localStorage.setItem(LANGUAGE_STORAGE_KEY, lang);
        setLanguageState(lang);
    };

    const t = (key: string): string => {
        return translations[language][key] || key;
    };

    return (
        <LanguageContext.Provider value={{ language, setLanguage, t }}>
            {children}
        </LanguageContext.Provider>
    );
}

export function useLanguage() {
    const context = useContext(LanguageContext);
    if (!context) {
        throw new Error('useLanguage must be used within a LanguageProvider');
    }
    return context;
}
