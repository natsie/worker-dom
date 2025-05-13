import { MRpc } from "./lib/@mys-x/m-rpc/dist/main.js";
import type { ElementTagName, WorkerDOMObject, WorkerDOMRef, WorkerDOMDefaultConfig } from "./worker-dom-types.js";
declare class WorkerDOM {
    #private;
    static get defaultConfig(): WorkerDOMDefaultConfig;
    root: Element;
    worker: Worker;
    commChannel: MRpc;
    config: typeof WorkerDOM.defaultConfig;
    refs: Map<WorkerDOMRef, WorkerDOMObject>;
    irefs: Map<WorkerDOMObject, WorkerDOMRef>;
    constructor({ worker, root, config, }: {
        worker: Worker;
        root?: Element;
        config?: Partial<WorkerDOMDefaultConfig>;
    });
    getRoot(): WorkerDOMRef;
    create(tagName: ElementTagName | ElementTagName[]): WorkerDOMRef[];
    frag(): WorkerDOMRef;
    query(parentRef: WorkerDOMRef, selector: string): WorkerDOMRef | null;
    queryAll(parentRef: WorkerDOMRef, selector: string): WorkerDOMRef[];
    childNodes(ref: WorkerDOMRef): WorkerDOMRef[];
    children(ref: WorkerDOMRef): WorkerDOMRef[];
    innerHTML(ref: WorkerDOMRef, text?: string): string;
    innerText(ref: WorkerDOMRef, text?: string): string;
    textContent(ref: WorkerDOMRef, text?: string): string | null;
    hasAttribute(ref: WorkerDOMRef, attribute: string): boolean;
    getAttribute(ref: WorkerDOMRef, attribute: string): string | null;
    getAttributes(ref: WorkerDOMRef): Record<string, string | null>;
    setAttribute(ref: WorkerDOMRef, attribute: string, value: string): void;
    setAttributes(ref: WorkerDOMRef, attributes: Record<string, string | null>): void;
    removeAttribute(ref: WorkerDOMRef, attribute: string): void;
    removeAttributes(ref: WorkerDOMRef, attributes: string[]): void;
    getStyle(ref: WorkerDOMRef, computed?: boolean): Record<string, string>;
    setStyle(ref: WorkerDOMRef, declaration: Record<string, string>): void;
    append(ref: WorkerDOMRef, children: (WorkerDOMRef | string)[]): void;
    appendChild(ref: WorkerDOMRef, childRef: WorkerDOMRef): void;
}
export { WorkerDOM, WorkerDOM as default };
