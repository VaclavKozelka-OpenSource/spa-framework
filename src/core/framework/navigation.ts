import { Route } from "./../types.ts";
import { Logger } from "./logger.ts";

let routes: Route[] = [];

export function setRoutes(r: Route[]): void {
    routes = r;
    Logger.debug(`Routes nastaveny pro navigation`, { count: routes.length }, 'Navigation');
}

export function path(routeName: string, params: Record<string, string | number> = {}): string {
    const route = routes.find(r => r.name === routeName);

    if (!route) {
        Logger.error(`Routa s názvem "${routeName}" nebyla nalezena.`, null, 'Navigation');
        return "#";
    }

    let url = route.path;

    const hasParams = Object.keys(params).length > 0;
    Object.entries(params).forEach(([key, value]) => {
        url = url.replace(`:${key}`, String(value));
    });

    Logger.debug(`URL cesta vygenerována: ${url}${hasParams ? ` s parametry` : ''}`,
        { routeName, params: hasParams ? params : null }, 'Navigation');

    return url;
}