export abstract class Plugin {
    abstract name: string;
    init?(app: any): void;
}