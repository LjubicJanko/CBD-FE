type EventName = 'token-expired';
type EventCallback = (data: any) => void;
type EventListeners = Record<EventName, EventCallback[]>;

export default {
  listeners: {} as EventListeners,
  on<T = any>(event: EventName, callback: (data: T) => void): void {
    if (!this.listeners[event]) {
      this.listeners[event] = [];
    }
    this.listeners[event].push(callback);
  },
  off<T = any>(event: EventName, callback: (data: T) => void): void {
    this.listeners[event] =
      this.listeners[event] ?? [].filter((cb) => cb !== callback);
  },
  emit<T = any>(event: EventName, data?: T): void {
    this.listeners[event].forEach((cb) => cb(data));
  },
};
