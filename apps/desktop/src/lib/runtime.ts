export function isTauriRuntime(): boolean {
    return typeof window !== 'undefined' && Boolean((window as any).__TAURI__ || (window as any).__TAURI_INTERNALS__);
}

export function isFlatpakRuntime(): boolean {
    return typeof window !== 'undefined' && Boolean((window as any).__MINDWTR_FLATPAK__);
}

const INSTALL_SOURCE_TIMEOUT_MS = 1500;

async function resolveWithTimeout<T>(promise: Promise<T>, fallback: T, timeoutMs: number): Promise<T> {
    let timeoutId: ReturnType<typeof setTimeout> | null = null;
    try {
        return await Promise.race([
            promise.catch(() => fallback),
            new Promise<T>((resolve) => {
                timeoutId = setTimeout(() => resolve(fallback), timeoutMs);
            }),
        ]);
    } finally {
        if (timeoutId) {
            clearTimeout(timeoutId);
        }
    }
}

export async function getInstallSourceOrFallback(fallback = 'unknown'): Promise<string> {
    if (!isTauriRuntime()) return fallback;
    const { invoke } = await import('@tauri-apps/api/core');
    return resolveWithTimeout(invoke<string>('get_install_source'), fallback, INSTALL_SOURCE_TIMEOUT_MS);
}
