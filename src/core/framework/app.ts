import { Router } from "./router.ts";
import {Middleware} from "../types.ts";
import { Logger } from "./logger.ts";
import { PluginManager } from "./modularity/pluginManager.ts";
import { Plugin } from "./modularity/plugin.ts";
import {AppLink} from "../components/linkComponent.ts";

export class App {
    private router: Router;
    private middlewares: Middleware[] = [];

    constructor(router: Router) {
        this.router = router;
        router.onNavigateRequested = (path) => this.navigate(path);

        this.registerComponents();
        // register core components
        Logger.debug('App instance vytvořena', { router }, 'App');
    }

    private registerComponents() {
        customElements.define("app-link", AppLink);
        Logger.debug('Web komponenta registrována: AppLink', { AppLink }, 'App');
    }

    public use(middleware: Middleware) {
        this.middlewares.push(middleware);
        Logger.debug(`Middleware zaregistrován (${this.middlewares.length} celkem)`, null, 'App');
    }

    public plugin(plugin: Plugin) {
        PluginManager.register(plugin);
    }

    public navigate(path: string) {
        Logger.log(`Navigace vyžádána na cestu: ${path}`, null, 'App');
        this.runMiddlewares(path, () => {
            Logger.log(`Všechny middlewares schválily navigaci na: ${path}`, null, 'App');
            this.router.routeToPath(path);
        });
    }

    private runMiddlewares(path: string, callback: () => void) {
        let index = 0;

        const redirect = (url: string) => {
            Logger.warning(`Přesměrování z ${path} na ${url}`, null, 'App');
            this.navigate(url);
        };

        const next = () => {
            if (index < this.middlewares.length) {
                const middleware = this.middlewares[index];
                Logger.debug(`Spuštění middleware #${index + 1}/${this.middlewares.length}`, null, 'App');
                index++;
                middleware({ path, next, redirect });
            } else {
                Logger.debug('Všechny middlewares byly vykonány', null, 'App');
                callback();
            }
        };

        next();
    }

    public boot() {
        const currentPath = window.location.pathname;
        Logger.log(`Aplikace bootuje z cesty: ${currentPath}`, null, 'App');
        this.navigate(currentPath);
    }
}