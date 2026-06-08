import {EventCallback} from "../types.ts";
import { Logger } from "./logger.ts";

export class EventDispatcher {
    private listeners: Record<string, EventCallback[]> = {};

    public on(eventName: string, callback: EventCallback) {
        if (!this.listeners[eventName]) {
            this.listeners[eventName] = [];
        }
        this.listeners[eventName].push(callback);
        Logger.debug(`Event listener zaregistrován: ${eventName}`,
            { totalListeners: this.listeners[eventName].length }, 'EventDispatcher');
    }

    public off(eventName: string, callback: EventCallback) {
        if (!this.listeners[eventName]) return;
        const before = this.listeners[eventName].length;
        this.listeners[eventName] = this.listeners[eventName].filter(cb => cb !== callback);
        Logger.debug(`Event listener odregistrován: ${eventName}`,
            { removed: before - this.listeners[eventName].length }, 'EventDispatcher');
    }

    public emit(eventName: string, data: any = {}) {
        if (!this.listeners[eventName]) {
            Logger.debug(`Pokus o emitování eventu bez listenerů: ${eventName}`, null, 'EventDispatcher');
            return;
        }

        Logger.log(`Event emitován: ${eventName}`,
            { data, listenerCount: this.listeners[eventName].length }, 'EventDispatcher');
        this.listeners[eventName].forEach(callback => callback(data));
    }
}

export const dispatcher = new EventDispatcher();