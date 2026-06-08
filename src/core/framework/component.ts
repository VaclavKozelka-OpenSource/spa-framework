import { dispatcher } from "./eventDispatcher.ts";
import { Logger } from "./logger.ts";
import { Form } from "./reactivity/form.ts";
import { PluginManager } from "./modularity/pluginManager.ts";
import { Binder } from "./reactivity/binder.ts";

export abstract class Component<TState = any, TProps = any> extends HTMLElement {
    private _state: TState = {} as TState;
    private _eventsInitialized = false;
    protected _componentType = 'Component';
    private _isFirstRender = true;

    private _registeredLocalEvents: { eventName: string; callback: (e: any) => void }[] = [];
    private _registeredGlobalEvents: { eventName: string; callback: (data: any) => void }[] = [];

    protected props: TProps = {} as TProps;
    protected form: Form | null = null;

    public data?: Partial<TState>;

    get $plugin() {
        const t = this._componentType;
        return new Proxy(PluginManager.getAll(), {
            get(target, prop: string) {
                if (prop in target) {
                    return target[prop];
                }

                Logger.warning(`Plugin "${prop}" není zaregistrován!`, null, t)
                return new Proxy({}, {
                    get: () => () => Logger.error(`Plugin "${prop}" není zaregistrován!`, null, t)
                });
            }
        });
    }

    constructor() {
        super();
        Logger.debug(`Komponenta vytvořena: ${this.constructor.name}`, null, this._componentType);
    }

    attributeChangedCallback(name: string, oldValue: string, newValue: string) {
        if (oldValue !== newValue) {
            (this.props as any)[name] = newValue;
            if (this.isConnected) {
                this.update();
            }
        }
    }

    connectedCallback() {
        const componentName = this.constructor.name;
        Logger.log(`Komponenta se připojuje do DOM: ${componentName}`, null, this._componentType);

        const observed = (this.constructor as any).observedAttributes || [];
        observed.forEach((attr: string) => {
            if (this.hasAttribute(attr)) {
                (this.props as any)[attr] = this.getAttribute(attr);
            }
        });

        if (this.data !== undefined) {
            Logger.debug(`Inicializace stavu z data v ${componentName}`, null, this._componentType);
            this.setState(this.data);
        } else if (typeof (this as any).initState === "function") {
            Logger.debug(`Volání initState v ${componentName}`, null, 'Component');
            (this as any).initState();
        }

        if (!this._eventsInitialized && typeof (this as any).initEvents === "function") {
            Logger.debug(`Inicializace eventů v ${componentName}`, null, this._componentType);
            (this as any).initEvents();
            this._eventsInitialized = true;
        }

        Logger.debug(`Komponenta je připravena: ${componentName}`, null, this._componentType);
        this.update();
    }

    disconnectedCallback() {
        const componentName = this.constructor.name;
        Logger.log(`Komponenta se odpojuje z DOM: ${componentName}`, {
            localEvents: this._registeredLocalEvents.length,
            globalEvents: this._registeredGlobalEvents.length
        }, this._componentType);

        this._registeredLocalEvents.forEach(({ eventName, callback }) => {
            this.removeEventListener(eventName, callback);
        });

        this._registeredGlobalEvents.forEach(({ eventName, callback }) => {
            dispatcher.off(eventName, callback);
        });

        this._registeredLocalEvents = [];
        this._registeredGlobalEvents = [];
        Logger.debug(`Komponenta ${componentName} byla úplně zničena`, null, this._componentType);
    }

    /** Lokální eventy (click, input, atd.) na úrovni komponenty */
    protected on(eventName: string, callback: (e: any) => void) {
        this.addEventListener(eventName, callback);
        this._registeredLocalEvents.push({ eventName, callback });
        Logger.debug(`Lokální event zaregistrován: ${eventName}`,
            { component: this.constructor.name }, this._componentType);
    }

    /** Ruční odhlášení lokálního eventu */
    protected off(eventName: string, callback: (e: any) => void) {
        this.removeEventListener(eventName, callback);
        this._registeredLocalEvents = this._registeredLocalEvents.filter(e => e.callback !== callback);
        Logger.debug(`Lokální event odregistrován: ${eventName}`,
            { component: this.constructor.name }, this._componentType);
    }

    /** Vyvolání globální události (Symfony style) bez window */
    protected emit(eventName: string, data: any = {}) {
        dispatcher.emit(eventName, data);
    }

    /** Naslouchání na globální událost (Symfony style) bez window */
    protected listen(eventName: string, callback: (data: any) => void) {
        dispatcher.on(eventName, callback);
        this._registeredGlobalEvents.push({ eventName, callback });
        Logger.debug(`Globální event listener registrován: ${eventName}`,
            { component: this.constructor.name }, this._componentType);
    }

    protected get state(): TState {
        return this._state;
    }

    protected setState(newState: Partial<TState>) {
        Logger.debug('Stav se mění',
            { component: this.constructor.name, newValues: newState }, this._componentType);
        this._state = { ...this._state, ...newState };
        this.update();
    }

    public update() {
        if (this._isFirstRender) {
            this.innerHTML = this.render();
            this._isFirstRender = false;
        }

        if (this.form) this.form.sync();
        Binder.sync(this, this.state);
    }

    protected registerForm(formId: string) {
        const el = this.querySelector(`#${formId}`) as HTMLElement;
        if (el) {
            this.form = new Form(el, this.state);
            this.form.onUpdate = (key, value) => {
                this.setState({ [key]: value } as any);
            };
        }
    }

    abstract render(): string;
}