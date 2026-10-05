export type SnackbarSeverity = 'success' | 'info' | 'warning' | 'error';

export type SnackbarPayload = {
    message: string;
    severity?: SnackbarSeverity;
};

type EventName = 'token-expired' | 'snackbar';
type EventCallback = (data: unknown) => void;
type EventListeners = Record<EventName, EventCallback[]>;

export default {
    listeners: {} as EventListeners,
    on<T = unknown>(event: EventName, callback: (data: T) => void): void {
        if (!this.listeners[event]) {
            this.listeners[event] = [];
        }
        this.listeners[event].push(callback as EventCallback);
    },
    off<T = unknown>(event: EventName, callback: (data: T) => void): void {
        if (!this.listeners[event]) return;
        this.listeners[event] = this.listeners[event].filter(
            (cb) => cb !== (callback as EventCallback)
        );
    },
    emit<T = unknown>(event: EventName, data?: T): void {
        (this.listeners[event] ?? []).forEach((cb) => cb(data));
    },
};
