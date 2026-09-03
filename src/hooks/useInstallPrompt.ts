import { useCallback, useEffect, useState } from 'react';

// Not in TS's standard DOM lib yet.
type BeforeInstallPromptEvent = Event & {
    prompt: () => Promise<void>;
    userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
};

const isStandalone = (): boolean =>
    window.matchMedia('(display-mode: standalone)').matches;

// Android/Chrome only - iOS Safari never fires beforeinstallprompt.
export const useInstallPrompt = () => {
    const [deferredPrompt, setDeferredPrompt] =
        useState<BeforeInstallPromptEvent | null>(null);
    const [isInstalled, setIsInstalled] = useState<boolean>(isStandalone);

    useEffect(() => {
        const onBeforeInstallPrompt = (event: Event) => {
            event.preventDefault();
            setDeferredPrompt(event as BeforeInstallPromptEvent);
        };
        const onAppInstalled = () => {
            setDeferredPrompt(null);
            setIsInstalled(true);
        };
        window.addEventListener('beforeinstallprompt', onBeforeInstallPrompt);
        window.addEventListener('appinstalled', onAppInstalled);
        return () => {
            window.removeEventListener(
                'beforeinstallprompt',
                onBeforeInstallPrompt
            );
            window.removeEventListener('appinstalled', onAppInstalled);
        };
    }, []);

    const promptInstall = useCallback(async (): Promise<void> => {
        if (!deferredPrompt) return;
        await deferredPrompt.prompt();
        await deferredPrompt.userChoice;
        setDeferredPrompt(null);
    }, [deferredPrompt]);

    return {
        canInstall: Boolean(deferredPrompt) && !isInstalled,
        isInstalled,
        promptInstall,
    };
};
