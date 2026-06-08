import { Binder } from "./binder.ts";

export class Form {
    private element: HTMLElement;
    private state: any;

    constructor(element: HTMLElement, state: any) {
        this.element = element;
        this.state = state;
        this.init();
    }

    private init() {
        this.element.querySelectorAll('[bind\\:value]').forEach(el => {
            const input = el as HTMLInputElement;
            const key = input.getAttribute('bind:value')!;

            input.addEventListener('input', () => {
                this.onUpdate(key, input.value);
            });
        });
    }

    public onUpdate: (key: string, value: any) => void = () => {};

    public sync() {
        Binder.sync(this.element, this.state);
    }
}