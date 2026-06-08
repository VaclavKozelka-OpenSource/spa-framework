import {LogLevel} from "../types.ts";

export class Logger {
    private static styles = {
        Framework: 'background: #38bdf8; color: #000; font-weight: bold; padding: 1px 5px; border-radius: 3px;',
        App: 'background: #34d399; color: #000; font-weight: bold; padding: 1px 5px; border-radius: 3px;',
        Auth: 'background: #f43f5e; color: #fff; font-weight: bold; padding: 1px 5px; border-radius: 3px;',
        Router: 'background: #a855f7; color: #fff; font-weight: bold; padding: 1px 5px; border-radius: 3px;',
        Page: 'background: #f59e0b; color: #000; font-weight: bold; padding: 1px 5px; border-radius: 3px;',
        Layout: 'background: #ec4899; color: #fff; font-weight: bold; padding: 1px 5px; border-radius: 3px;',
        Component: 'background: #64748b; color: #fff; font-weight: bold; padding: 1px 5px; border-radius: 3px;',
        textMuted: 'color: #64748b; font-size: 0.9em;',
        textNormal: 'color: #f1f5f9;',
        warningText: 'color: #fbbf24; font-weight: bold;',
        errorText: 'color: #f87171; font-weight: bold;'
    };

    /**
     * Interní univerzální metoda pro tisk do konzole
     */
    private static print(level: LogLevel, message: string, context: any = null, module: string = 'Framework') {
        if (import.meta.env.PROD && level !== 'error') {
            return;
        }

        const moduleStyle = (this.styles as any)[module] || 'background: #475569; color: #fff; font-weight: bold; padding: 1px 5px; border-radius: 3px;';

        let messageStyle = this.styles.textNormal;
        let consoleMethod: 'log' | 'info' | 'warn' | 'error' = 'log';

        if (level === 'debug') {
            messageStyle = this.styles.textMuted;
        } else if (level === 'warning') {
            messageStyle = this.styles.warningText;
            consoleMethod = 'warn';
        } else if (level === 'error') {
            messageStyle = this.styles.errorText;
            consoleMethod = 'error';
        }

        const logString = `%c[${module}]%c ${message}`;

        if (context) {
            console[consoleMethod](logString, moduleStyle, messageStyle, context);
        } else {
            console[consoleMethod](logString, moduleStyle, messageStyle);
        }
    }

    public static debug(message: string, context: any = null, module: string = 'Framework') {
        this.print('debug', message, context, module);
    }

    public static log(message: string, context: any = null, module: string = 'Framework') {
        this.print('log', message, context, module);
    }

    public static warning(message: string, context: any = null, module: string = 'Framework') {
        this.print('warning', message, context, module);
    }

    public static error(message: string, context: any = null, module: string = 'Framework') {
        this.print('error', message, context, module);
    }
}