import { Component } from "../framework/component.ts";
import { path } from "../framework/navigation.ts";

export class AppLink extends Component {
    private linkText: string = "";

    connectedCallback() {
        this.linkText = this.innerText || this.textContent || "";
        super.connectedCallback();
    }

    render() {
        const to = this.getAttribute("to") || "home";
        let url = to;
        let target = '_blank';
        if (!to.startsWith('http')) {
            url = path(to);
            target = '_self';
        }


        return `<a href="${url}" target="${target}" class="contents">${this.linkText}</a>`;
    }
}