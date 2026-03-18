import { router } from 'expo-router';

export function openProjectScreen(projectId: string) {
    if (!projectId) return;
    router.push({ pathname: '/projects-screen', params: { projectId } });
}

export function openContextsScreen(token: string) {
    if (!token) return;
    router.push({ pathname: '/contexts', params: { token } });
}
