export class Binder {
    static sync(element: HTMLElement, state: any) {
        // 1. Value binding (formuláře)
        element.querySelectorAll('[bind\\:value]').forEach(el => {
            const input = el as HTMLInputElement;
            const key = input.getAttribute('bind:value')!;
            if (state[key] !== undefined && input.value !== String(state[key])) {
                input.value = state[key];
            }
        });

        // 2. Text binding (textContent)
        this.syncText(element, state, '[bind\\:text]', (val) => String(val ?? ''));
        this.syncText(element, state, '[bind\\:int]', (val) => String(parseInt(val) || 0));
        this.syncText(element, state, '[bind\\:date]', (val) => val ? new Date(val).toLocaleDateString('cs-CZ') : '');

        // 3. Show/Hide binding (zobrazení elementu)
        element.querySelectorAll('[bind\\:show]').forEach(el => {
            const key = el.getAttribute('bind:show')!;
            (el as HTMLElement).style.display = state[key] ? '' : 'none';
        });

        element.querySelectorAll('[bind\\:hide]').forEach(el => {
            const key = el.getAttribute('bind:hide')!;
            (el as HTMLElement).style.display = state[key] ? 'none' : '';
        });
    }

    private static syncText(root: HTMLElement, state: any, selector: string, formatter: (val: any) => string) {
        root.querySelectorAll(selector).forEach(el => {
            const key = el.getAttribute(selector.replace('[', '').replace(']', '').replace('\\:', ':'))!;
            const formatted = formatter(state[key]);
            if (el.textContent !== formatted) el.textContent = formatted;
        });
    }
}