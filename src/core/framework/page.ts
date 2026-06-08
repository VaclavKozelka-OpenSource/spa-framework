import { Component } from "./component.ts";

export abstract class Page<TParam = any, TState = any> extends Component<TState> {
    private _params?: Partial<TParam>;

    constructor() {
        super();
        this._componentType = 'Page';
    }

    public setParams(params: TParam) {
        this._params = params;
    }
    protected get params(): TParam {
        return (this._params || {}) as TParam;
    }
}