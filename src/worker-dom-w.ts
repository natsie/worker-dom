import { MRpc, type WorkerGlobalScope } from "./lib/@mys-x/m-rpc/dist/main.js";
import type { ElementTagName, WorkerDOMRef } from "./worker-dom-types.js";

const commChannel = new MRpc(self as WorkerGlobalScope);
const dom = {
  getRoot: (): Promise<WorkerDOMRef> => commChannel.callRemoteFn("getRoot", []),
  create: (tagName: ElementTagName | ElementTagName[]): Promise<WorkerDOMRef[]> => {
    return commChannel.callRemoteFn("create", [tagName]);
  },
  query: (parentRef: WorkerDOMRef, selector: string): Promise<WorkerDOMRef | null> => {
    return commChannel.callRemoteFn("query", [parentRef, selector]);
  },
  queryAll: (parentRef: WorkerDOMRef, selector: string): Promise<WorkerDOMRef[]> => {
    return commChannel.callRemoteFn("queryAll", [parentRef, selector]);
  },
  childNodes: (ref: WorkerDOMRef): Promise<WorkerDOMRef[]> => {
    return commChannel.callRemoteFn("childNodes", [ref]);
  },
  children: (ref: WorkerDOMRef): Promise<WorkerDOMRef[]> => {
    return commChannel.callRemoteFn("children", [ref]);
  },
  innerHTML: (ref: WorkerDOMRef, text?: string): Promise<string> => {
    return commChannel.callRemoteFn("innerHTML", [ref, text]);
  },
  innerText: (ref: WorkerDOMRef, text?: string): Promise<string> => {
    return commChannel.callRemoteFn("innerText", [ref, text]);
  },
  textContent: (ref: WorkerDOMRef, text?: string): Promise<string> => {
    return commChannel.callRemoteFn("textContent", [ref, text]);
  },
  hasAttribute: (ref: WorkerDOMRef, attribute: string): Promise<boolean> => {
    return commChannel.callRemoteFn("hasAttribute", [ref, attribute]);
  },
  getAttribute: (ref: WorkerDOMRef, attribute: string): Promise<string | null> => {
    return commChannel.callRemoteFn("getAttribute", [ref, attribute]);
  },
  getAttributes: (
    ref: WorkerDOMRef,
    attributes: string[]
  ): Promise<Record<string, string | null>> => {
    return commChannel.callRemoteFn("getAttributes", [ref, attributes]);
  },
  setAttribute: (ref: WorkerDOMRef, attribute: string, value: string): Promise<void> => {
    return commChannel.callRemoteFn("setAttribute", [ref, attribute, value]);
  },
  setAttributes: (ref: WorkerDOMRef, attributes: Record<string, string | null>): Promise<void> => {
    return commChannel.callRemoteFn("setAttributes", [ref, attributes]);
  },
  removeAttribute: (ref: WorkerDOMRef, attribute: string): Promise<void> => {
    return commChannel.callRemoteFn("removeAttribute", [ref, attribute]);
  },
  removeAttributes: (ref: WorkerDOMRef, attributes: string[]): Promise<void> => {
    return commChannel.callRemoteFn("removeAttributes", [ref, attributes]);
  },
  getStyle: (ref: WorkerDOMRef, computed = false): Promise<Record<string, string>> => {
    return commChannel.callRemoteFn("getStyle", [ref, computed]);
  },
  setStyle: (ref: WorkerDOMRef, declaration: Record<string, string>): Promise<void> => {
    return commChannel.callRemoteFn("setStyle", [ref, declaration]);
  },
  append: (ref: WorkerDOMRef, children: WorkerDOMRef[]): Promise<void> => {
    return commChannel.callRemoteFn("append", [ref, children]);
  },
  appendChild: (ref: WorkerDOMRef, childRef: WorkerDOMRef): Promise<void> => {
    return commChannel.callRemoteFn("appendChild", [ref, childRef]);
  },
};

export default dom;
