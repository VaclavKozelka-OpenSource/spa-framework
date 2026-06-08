import { Plugin } from "./plugin.ts";

export class PluginManager {
    private static plugins: Map<string, any> = new Map();

    static register(plugin: Plugin) {
        this.plugins.set(plugin.name, plugin);
    }

    static get(name: string) {
        return this.plugins.get(name);
    }

    static getAll() {
        return Object.fromEntries(this.plugins);
    }
}