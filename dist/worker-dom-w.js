import { MRpc } from "./lib/@mys-x/m-rpc/dist/main.js";
const commChannel = new MRpc(self);
const dom = {
    getRoot: () => commChannel.callRemoteFn("getRoot", []),
    create: (tagName) => {
        return commChannel.callRemoteFn("create", [tagName]);
    },
    query: (parentRef, selector) => {
        return commChannel.callRemoteFn("query", [parentRef, selector]);
    },
    queryAll: (parentRef, selector) => {
        return commChannel.callRemoteFn("queryAll", [parentRef, selector]);
    },
    childNodes: (ref) => {
        return commChannel.callRemoteFn("childNodes", [ref]);
    },
    children: (ref) => {
        return commChannel.callRemoteFn("children", [ref]);
    },
    innerHTML: (ref, text) => {
        return commChannel.callRemoteFn("innerHTML", [ref, text]);
    },
    innerText: (ref, text) => {
        return commChannel.callRemoteFn("innerText", [ref, text]);
    },
    textContent: (ref, text) => {
        return commChannel.callRemoteFn("textContent", [ref, text]);
    },
    hasAttribute: (ref, attribute) => {
        return commChannel.callRemoteFn("hasAttribute", [ref, attribute]);
    },
    getAttribute: (ref, attribute) => {
        return commChannel.callRemoteFn("getAttribute", [ref, attribute]);
    },
    getAttributes: (ref, attributes) => {
        return commChannel.callRemoteFn("getAttributes", [ref, attributes]);
    },
    setAttribute: (ref, attribute, value) => {
        return commChannel.callRemoteFn("setAttribute", [ref, attribute, value]);
    },
    setAttributes: (ref, attributes) => {
        return commChannel.callRemoteFn("setAttributes", [ref, attributes]);
    },
    removeAttribute: (ref, attribute) => {
        return commChannel.callRemoteFn("removeAttribute", [ref, attribute]);
    },
    removeAttributes: (ref, attributes) => {
        return commChannel.callRemoteFn("removeAttributes", [ref, attributes]);
    },
    getStyle: (ref, computed = false) => {
        return commChannel.callRemoteFn("getStyle", [ref, computed]);
    },
    setStyle: (ref, declaration) => {
        return commChannel.callRemoteFn("setStyle", [ref, declaration]);
    },
    append: (ref, children) => {
        return commChannel.callRemoteFn("append", [ref, children]);
    },
    appendChild: (ref, childRef) => {
        return commChannel.callRemoteFn("appendChild", [ref, childRef]);
    },
};
export default dom;
//# sourceMappingURL=worker-dom-w.js.map