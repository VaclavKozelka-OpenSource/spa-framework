import { Route } from "../types.ts";
import { Logger } from "./logger.ts";

export class Router {
    private routes: Route[] = [];
    private appElement: HTMLElement;
    public onNavigateRequested?: (path: string) => void;

    constructor(routes: Route[]) {
        this.routes = routes;
        this.appElement = document.getElementById('app') as HTMLElement;

        Logger.log(`Router inicializován s ${routes.length} routami`,
            { routes: routes.map(r => r.name) }, 'Router');

        window.addEventListener('popstate', () => {
            Logger.debug('Zpětné tlačítko prohlížeče - popstate event', null, 'Router');
            if (this.onNavigateRequested) this.onNavigateRequested(window.location.pathname);
        });

        document.addEventListener('click', (e) => {
            const target = e.target as HTMLElement;
            const link = target.closest('a');

            if (link && link.matches('[href^="/"]')) {
                const href = link.getAttribute('href')!;
                Logger.debug(`Klik na interní odkaz: ${href}`, null, 'Router');
                e.preventDefault();
                history.pushState(null, '', href);
                if (this.onNavigateRequested) this.onNavigateRequested(href);
            }
        });
    }

    private compilePath(routePath: string) {
        const paramNames: string[] = [];
        const regexPath = routePath.replace(/:([a-zA-Z0-9_]+)/g, (_, paramName) => {
            paramNames.push(paramName);
            return '([^/]+)';
        });

        return {
            regex: new RegExp(`^${regexPath}$`),
            paramNames
        };
    }

    private matchRoute(currentPath: string) {
        for (const route of this.routes) {
            const { regex, paramNames } = this.compilePath(route.path);
            const match = currentPath.match(regex);

            if (match) {
                const params: Record<string, string> = {};
                paramNames.forEach((name, index) => {
                    params[name] = match[index + 1];
                });

                Logger.log(`Ruta nalezena: ${route.name} (${route.path})`,
                    { params: Object.keys(params).length > 0 ? params : null }, 'Router');
                return { route, params };
            }
        }
        Logger.debug(`Žádná ruta pro cestu "${currentPath}" - fallback na první rutu`, null, 'Router');
        return { route: this.routes[0], params: {} };
    }

    public routeToPath(currentPath: string) {
        const { route, params } = this.matchRoute(currentPath);

        Logger.log(`Renderování view: ${route.view}${route.layout ? ` s layoutem: ${route.layout}` : ''}`,
            { path: currentPath }, 'Router');

        if (this.appElement) {
            this.appElement.innerHTML = '';

            const pageElement = document.createElement(route.view) as any;
            pageElement.data = params;

            if (route.layout) {
                Logger.debug(`Layout ${route.layout} se připravuje`, null, 'Router');
                const layoutElement = document.createElement(route.layout);
                this.appElement.appendChild(layoutElement);
                const slot = layoutElement.querySelector('slot');
                if (slot) {
                    slot.replaceWith(pageElement);
                } else {
                    layoutElement.appendChild(pageElement);
                }
            } else {
                this.appElement.appendChild(pageElement);
            }

            Logger.debug(`Stránka ${route.view} byla připojena do DOM`, null, 'Router');
        }

        document.querySelectorAll('.nav-link').forEach(link => {
            if (link.getAttribute('href') === currentPath) {
                link.setAttribute('data-active', '');
            } else {
                link.removeAttribute('data-active');
            }
        });
        Logger.debug('Aktivní navigační odkaz aktualizován', null, 'Router');
    }
}