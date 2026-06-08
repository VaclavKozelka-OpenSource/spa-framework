export type Route = {
    name: string,
    path: string,
    view: string,
    layout?: string
};

export type MiddlewareContext = {
    path: string;
    next: () => void;
    redirect: (url: string) => void;
};

export type LogLevel = 'debug' | 'log' | 'warning' | 'error';
export type Middleware = (context: MiddlewareContext) => void;
export type EventCallback = (data: any) => void;