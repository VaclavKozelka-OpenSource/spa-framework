import { Component } from "./component.ts";

export abstract class Layout<TState = any> extends Component<TState> {
    constructor() {
        super();
        this._componentType = 'Layout';
    }
}