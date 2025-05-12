var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var _WorkerDOM_instances, _WorkerDOM_id, _WorkerDOM_uuid, _WorkerDOM_initialiseConfig, _WorkerDOM_isValidAttributeName, _WorkerDOM_isAccessibleDOMObject, _WorkerDOM_referenceTo, _WorkerDOM_setRef, _WorkerDOM_setupCommunications;
import { MRpc } from "./lib/@mys-x/m-rpc/dist/main.js";
import DOMPurify from "./lib/dom-purify/purify.es.mjs";
const DOMMethods = [
    "create",
    "frag",
    "query",
    "queryAll",
    "childNodes",
    "children",
    "innerHTML",
    "innerText",
    "textContent",
    "hasAttribute",
    "getAttribute",
    "getAttributes",
    "setAttribute",
    "setAttributes",
    "removeAttribute",
    "removeAttributes",
    "getStyle",
    "setStyle",
    "append",
    "appendChild",
];
// @ts-expect-error
window.dp = DOMPurify;
class WorkerDOMSecurityError extends Error {
}
class WorkerDOM {
    static get defaultConfig() {
        return {
            allowStyling: true,
            allowUnknown: false,
            allowCustomElements: false,
            allowedElements: new Set([].concat([
                "a",
                "abbr",
                "acronym",
                "address",
                "area",
                "article",
                "aside",
                "audio",
                "b",
                "bdi",
                "bdo",
                "big",
                "blink",
                "blockquote",
                "body",
                "br",
                "button",
                "canvas",
                "caption",
                "center",
                "cite",
                "code",
                "col",
                "colgroup",
                "content",
                "data",
                "datalist",
                "dd",
                "decorator",
                "del",
                "details",
                "dfn",
                "dialog",
                "dir",
                "div",
                "dl",
                "dt",
                "element",
                "em",
                "fieldset",
                "figcaption",
                "figure",
                "font",
                "footer",
                "form",
                "h1",
                "h2",
                "h3",
                "h4",
                "h5",
                "h6",
                "head",
                "header",
                "hgroup",
                "hr",
                "html",
                "i",
                "img",
                "input",
                "ins",
                "kbd",
                "label",
                "legend",
                "li",
                "main",
                "map",
                "mark",
                "marquee",
                "menu",
                "menuitem",
                "meter",
                "nav",
                "nobr",
                "ol",
                "optgroup",
                "option",
                "output",
                "p",
                "picture",
                "pre",
                "progress",
                "q",
                "rp",
                "rt",
                "ruby",
                "s",
                "samp",
                "section",
                "select",
                "shadow",
                "small",
                "source",
                "spacer",
                "span",
                "strike",
                "strong",
                "style",
                "sub",
                "summary",
                "sup",
                "table",
                "tbody",
                "td",
                "template",
                "textarea",
                "tfoot",
                "th",
                "thead",
                "time",
                "tr",
                "track",
                "tt",
                "u",
                "ul",
                "var",
                "video",
                "wbr",
            ], [
                "svg",
                "a",
                "altglyph",
                "altglyphdef",
                "altglyphitem",
                "animatecolor",
                "animatemotion",
                "animatetransform",
                "circle",
                "clippath",
                "defs",
                "desc",
                "ellipse",
                "filter",
                "font",
                "g",
                "glyph",
                "glyphref",
                "hkern",
                "image",
                "line",
                "lineargradient",
                "marker",
                "mask",
                "metadata",
                "mpath",
                "path",
                "pattern",
                "polygon",
                "polyline",
                "radialgradient",
                "rect",
                "stop",
                "style",
                "switch",
                "symbol",
                "text",
                "textpath",
                "title",
                "tref",
                "tspan",
                "view",
                "vkern",
            ])),
            forbiddenElements: new Set(["script", "iframe", "object", "embed", "link", "meta"]),
            forbiddenAttributes: new Set(["src", "href", "action"]),
            forbiddenAttributesRgx: [/^\s*on\w+\s*$/i],
            allowInnerHTML: false,
        };
    }
    constructor({ worker, root, config = {}, }) {
        _WorkerDOM_instances.add(this);
        _WorkerDOM_id.set(this, -1);
        _WorkerDOM_uuid.set(this, crypto.randomUUID());
        this.config = WorkerDOM.defaultConfig;
        this.worker = worker;
        this.refs = new Map();
        this.irefs = new Map();
        this.commChannel = new MRpc(worker);
        const _root = (root || document.createElement("main"));
        if (!(_root instanceof Element))
            throw new Error("Failed to create root element.");
        this.root = _root;
        __classPrivateFieldGet(this, _WorkerDOM_instances, "m", _WorkerDOM_referenceTo).call(this, _root);
        __classPrivateFieldGet(this, _WorkerDOM_instances, "m", _WorkerDOM_setupCommunications).call(this);
        __classPrivateFieldGet(this, _WorkerDOM_instances, "m", _WorkerDOM_initialiseConfig).call(this, config);
    }
    create(tagName) {
        var _a;
        const elements = Array.isArray(tagName) ? tagName : [tagName || "div"];
        const result = new Array(elements.length);
        for (let i = 0; i < elements.length; i++) {
            if (typeof elements[i] !== "string") {
                throw new TypeError("`tagName` must be a string or an array of strings.");
            }
            if (!__classPrivateFieldGet(this, _WorkerDOM_instances, "m", _WorkerDOM_isAccessibleDOMObject).call(this, elements[i])) {
                throw new WorkerDOMSecurityError(`Creation of element <${elements[i].replace(/\s*\,\s*/, ", ")}> is not allowed by the WorkerDOM configuration.`);
            }
            const [name, is] = elements[i].split(",");
            const element = is ? document.createElement(name, { is }) : document.createElement(name);
            const id = __classPrivateFieldSet(this, _WorkerDOM_id, (_a = __classPrivateFieldGet(this, _WorkerDOM_id, "f"), ++_a), "f");
            __classPrivateFieldGet(this, _WorkerDOM_instances, "m", _WorkerDOM_setRef).call(this, id, element);
            result[i] = id;
        }
        return result;
    }
    frag() {
        var _a;
        const id = __classPrivateFieldSet(this, _WorkerDOM_id, (_a = __classPrivateFieldGet(this, _WorkerDOM_id, "f"), ++_a), "f");
        const frag = document.createDocumentFragment();
        __classPrivateFieldGet(this, _WorkerDOM_instances, "m", _WorkerDOM_setRef).call(this, id, frag);
        return id;
    }
    query(parentRef, selector) {
        const parent = this.refs.get(parentRef == null ? 0 : parentRef);
        if (!(parent instanceof Element || parent instanceof DocumentFragment)) {
            throw new TypeError("`parentRef` did not refer to a queryable DOM object.");
        }
        const target = parent.querySelector(selector);
        if (target === null)
            return null;
        return __classPrivateFieldGet(this, _WorkerDOM_instances, "m", _WorkerDOM_referenceTo).call(this, target);
    }
    queryAll(parentRef, selector) {
        const parent = this.refs.get(parentRef == null ? 0 : parentRef);
        if (!(parent instanceof Element || parent instanceof DocumentFragment)) {
            throw new TypeError("`parentRef` did not refer to a queryable DOM object.");
        }
        const targets = parent.querySelectorAll(selector);
        return Array.from(targets, (t) => __classPrivateFieldGet(this, _WorkerDOM_instances, "m", _WorkerDOM_referenceTo).call(this, t));
    }
    childNodes(ref) {
        const target = this.refs.get(ref);
        if (!(target instanceof Node)) {
            throw new TypeError("`ref` did not refer to a Node instance.");
        }
        return Array.from(target.childNodes, (t) => __classPrivateFieldGet(this, _WorkerDOM_instances, "m", _WorkerDOM_referenceTo).call(this, t));
    }
    children(ref) {
        const target = this.refs.get(ref);
        if (!(target instanceof Element)) {
            throw new TypeError("`ref` did not refer to an Element instance.");
        }
        return Array.from(target.children, (t) => __classPrivateFieldGet(this, _WorkerDOM_instances, "m", _WorkerDOM_referenceTo).call(this, t));
    }
    innerHTML(ref, text) {
        const target = this.refs.get(ref);
        if (!(target instanceof Element)) {
            throw new TypeError("`ref` did not refer to an Element instance.");
        }
        if (text != null) {
            if (this.config.allowInnerHTML)
                target.innerHTML = DOMPurify.sanitize(text);
            else
                throw new WorkerDOMSecurityError("Setting innerHTML is not permitted by the WorkerDOM configuration.");
        }
        return target.innerHTML;
    }
    innerText(ref, text) {
        const target = this.refs.get(ref);
        if (!(target instanceof HTMLElement)) {
            throw new TypeError("`ref` did not refer to an HTMLElement instance.");
        }
        if (text !== undefined)
            target.innerText = text;
        return target.innerText;
    }
    textContent(ref, text) {
        const target = this.refs.get(ref);
        if (!(target instanceof Node)) {
            throw new TypeError("`ref` did not refer to a Node instance.");
        }
        if (text !== undefined)
            target.textContent = text;
        return target.textContent;
    }
    hasAttribute(ref, attribute) {
        const target = this.refs.get(ref);
        if (!(target instanceof Element)) {
            throw new TypeError("`ref` did not refer to an Element instance.");
        }
        if (!__classPrivateFieldGet(this, _WorkerDOM_instances, "m", _WorkerDOM_isValidAttributeName).call(this, attribute)) {
            throw new WorkerDOMSecurityError(`Access to attribute "${attribute}" is not allowed by the WorkerDOM configuration.`);
        }
        return target.hasAttribute(attribute);
    }
    getAttribute(ref, attribute) {
        const target = this.refs.get(ref);
        if (!(target instanceof Element)) {
            throw new TypeError("`ref` did not refer to an Element instance.");
        }
        if (!__classPrivateFieldGet(this, _WorkerDOM_instances, "m", _WorkerDOM_isValidAttributeName).call(this, attribute)) {
            throw new WorkerDOMSecurityError(`Access to attribute "${attribute}" is not allowed by the WorkerDOM configuration.`);
        }
        return target.getAttribute(attribute);
    }
    getAttributes(ref) {
        const target = this.refs.get(ref);
        if (!(target instanceof Element)) {
            throw new TypeError("`ref` did not refer to an Element instance.");
        }
        const result = {};
        const attributes = Array.from(target.attributes);
        for (let i = 0; i < attributes.length; i++) {
            const attribute = attributes[i];
            const name = attribute.nodeName;
            if (!__classPrivateFieldGet(this, _WorkerDOM_instances, "m", _WorkerDOM_isValidAttributeName).call(this, name)) {
                throw new WorkerDOMSecurityError(`Access to attribute "${name}" is not allowed by the WorkerDOM configuration.`);
            }
            result[name] = attribute.nodeValue;
        }
        return result;
    }
    setAttribute(ref, attribute, value) {
        const target = this.refs.get(ref);
        if (!(target instanceof Element)) {
            throw new TypeError("`ref` did not refer to an Element instance.");
        }
        if (!__classPrivateFieldGet(this, _WorkerDOM_instances, "m", _WorkerDOM_isValidAttributeName).call(this, attribute)) {
            throw new WorkerDOMSecurityError(`Access to attribute "${attribute}" is not allowed by the WorkerDOM configuration.`);
        }
        target.setAttribute(attribute, value);
    }
    setAttributes(ref, attributes) {
        const target = this.refs.get(ref);
        if (!(target instanceof Element)) {
            throw new TypeError("`ref` did not refer to an Element instance.");
        }
        for (const attribute in attributes) {
            if (!__classPrivateFieldGet(this, _WorkerDOM_instances, "m", _WorkerDOM_isValidAttributeName).call(this, attribute)) {
                throw new WorkerDOMSecurityError(`Access to attribute "${attribute}" is not allowed by the WorkerDOM configuration.`);
            }
            const value = attributes[attribute];
            if (value === null)
                target.removeAttribute(attribute);
            else
                target.setAttribute(attribute, value);
        }
    }
    removeAttribute(ref, attribute) {
        const target = this.refs.get(ref);
        if (!(target instanceof Element)) {
            throw new TypeError("`ref` did not refer to an Element instance.");
        }
        if (!__classPrivateFieldGet(this, _WorkerDOM_instances, "m", _WorkerDOM_isValidAttributeName).call(this, attribute)) {
            throw new WorkerDOMSecurityError(`Access to attribute "${attribute}" is not allowed by the WorkerDOM configuration.`);
        }
        target.removeAttribute(attribute);
    }
    removeAttributes(ref, attributes) {
        const target = this.refs.get(ref);
        if (!(target instanceof Element)) {
            throw new TypeError("`ref` did not refer to an Element instance.");
        }
        for (let i = 0; i < attributes.length; i++) {
            const attribute = attributes[i];
            if (!__classPrivateFieldGet(this, _WorkerDOM_instances, "m", _WorkerDOM_isValidAttributeName).call(this, attribute)) {
                throw new WorkerDOMSecurityError(`Access to attribute "${attribute}" is not allowed by the WorkerDOM configuration.`);
            }
            target.removeAttribute(attribute);
        }
    }
    getStyle(ref, computed = false) {
        if (!this.config.allowStyling) {
            throw new WorkerDOMSecurityError("Access to style is not allowed by the WorkerDOM configuration.");
        }
        const target = this.refs.get(ref);
        if (!(target instanceof HTMLElement || target instanceof SVGElement)) {
            throw new TypeError("`ref` did not refer to an HTMLElement or SVGElement instance.");
        }
        const style = target.style;
        const props = [
            ...Object.getOwnPropertyNames(style),
            ...Object.getOwnPropertyNames(Object.getPrototypeOf(style)),
        ];
        const result = {};
        for (let i = 0; i < props.length; i++) {
            // @ts-expect-error
            const value = style[props[i]];
            if (typeof value === "string")
                result[props[i]] = value;
        }
        return result;
    }
    setStyle(ref, declaration) {
        if (!this.config.allowStyling) {
            throw new WorkerDOMSecurityError("Access to style is not allowed by the WorkerDOM configuration.");
        }
        const target = this.refs.get(ref);
        if (!(target instanceof HTMLElement || target instanceof SVGElement)) {
            throw new TypeError("`ref` did not refer to an HTMLElement or SVGElement instance.");
        }
        const style = target.style;
        // @ts-expect-error
        for (const prop in declaration)
            style[prop] = declaration[prop];
    }
    append(ref, ...children) {
        const target = this.refs.get(ref);
        if (!(target instanceof Element || target instanceof DocumentFragment)) {
            throw new TypeError("`ref` did not refer to an Element or DocumentFragment instance.");
        }
        for (const childRef of children) {
            if (typeof childRef === "string") {
                target.append(childRef);
                continue;
            }
            const child = this.refs.get(childRef);
            if (!(child instanceof Node)) {
                throw new TypeError("`children` must refer to Node instances.");
            }
            if (!__classPrivateFieldGet(this, _WorkerDOM_instances, "m", _WorkerDOM_isAccessibleDOMObject).call(this, child)) {
                throw new WorkerDOMSecurityError("Access denied to child DOM object.");
            }
            target.append(child);
        }
    }
    appendChild(ref, childRef) {
        const target = this.refs.get(ref);
        if (!(target instanceof Element || target instanceof DocumentFragment)) {
            throw new TypeError("`ref` did not refer to an Element or DocumentFragment instance.");
        }
        const child = this.refs.get(childRef);
        if (!(child instanceof Node)) {
            throw new TypeError("`childRef` must refer to a Node instance.");
        }
        if (!__classPrivateFieldGet(this, _WorkerDOM_instances, "m", _WorkerDOM_isAccessibleDOMObject).call(this, child)) {
            throw new WorkerDOMSecurityError("Access denied to child DOM object.");
        }
        target.appendChild(child);
    }
}
_WorkerDOM_id = new WeakMap(), _WorkerDOM_uuid = new WeakMap(), _WorkerDOM_instances = new WeakSet(), _WorkerDOM_initialiseConfig = function _WorkerDOM_initialiseConfig(config) {
    const { allowStyling, allowUnknown, allowCustomElements, allowedElements, forbiddenElements, forbiddenAttributes, forbiddenAttributesRgx, allowInnerHTML, } = config;
    if (allowStyling != null)
        this.config.allowStyling = !!allowStyling;
    if (allowUnknown != null)
        this.config.allowUnknown = !!allowUnknown;
    if (allowCustomElements != null)
        this.config.allowCustomElements = !!allowCustomElements;
    if (allowedElements != null)
        this.config.allowedElements = new Set(allowedElements);
    if (forbiddenElements != null)
        this.config.forbiddenElements = new Set(forbiddenElements);
    if (forbiddenAttributes != null)
        this.config.forbiddenAttributes = new Set(forbiddenAttributes);
    if (forbiddenAttributesRgx != null) {
        this.config.forbiddenAttributesRgx = Array.from(forbiddenAttributesRgx).filter((el) => el instanceof RegExp);
    }
    if (allowInnerHTML != null)
        this.config.allowInnerHTML = !!allowInnerHTML;
}, _WorkerDOM_isValidAttributeName = function _WorkerDOM_isValidAttributeName(name) {
    if (this.config.forbiddenAttributes.has(name))
        return false;
    if (this.config.forbiddenAttributesRgx.some((el) => el.test(name)))
        return false;
    return true;
}, _WorkerDOM_isAccessibleDOMObject = function _WorkerDOM_isAccessibleDOMObject(domObject) {
    if (typeof domObject === "string") {
        const [tagName, is] = domObject.split(",");
        const isCustomElement = /^[a-z][a-z0-9]*(?:-[a-z][a-z0-9]*)*$/i.test(tagName);
        if (is != null && !this.config.allowCustomElements)
            return false;
        if (this.config.forbiddenElements.has(tagName))
            return false;
        if (this.config.allowedElements.has(tagName))
            return true;
        if (isCustomElement && this.config.allowCustomElements)
            return true;
        return this.config.allowUnknown;
    }
    if (domObject === this.root)
        return true;
    if (domObject instanceof DocumentFragment)
        return true;
    if (domObject.nodeType === Node.TEXT_NODE)
        return true;
    if (Object.getPrototypeOf(domObject) === Node.prototype)
        return domObject.nodeName === "#text";
    const tagName = domObject.tagName.toLowerCase();
    const isCustomElement = /^[a-z][a-z0-9]*(?:-[a-z][a-z0-9]*)*$/i.test(tagName);
    if (this.config.forbiddenElements.has(tagName))
        return false;
    if (this.config.allowedElements.has(tagName))
        return true;
    if (isCustomElement && this.config.allowCustomElements)
        return true;
    return this.config.allowUnknown;
}, _WorkerDOM_referenceTo = function _WorkerDOM_referenceTo(domObject) {
    var _a;
    if (!__classPrivateFieldGet(this, _WorkerDOM_instances, "m", _WorkerDOM_isAccessibleDOMObject).call(this, domObject))
        throw new WorkerDOMSecurityError("Access denied to DOM object.");
    const ref = this.irefs.get(domObject);
    return ref === undefined ? __classPrivateFieldGet(this, _WorkerDOM_instances, "m", _WorkerDOM_setRef).call(this, __classPrivateFieldSet(this, _WorkerDOM_id, (_a = __classPrivateFieldGet(this, _WorkerDOM_id, "f"), ++_a), "f"), domObject) : ref;
}, _WorkerDOM_setRef = function _WorkerDOM_setRef(ref, domObject) {
    if (!__classPrivateFieldGet(this, _WorkerDOM_instances, "m", _WorkerDOM_isAccessibleDOMObject).call(this, domObject))
        throw new WorkerDOMSecurityError("Access denied to DOM object.");
    this.refs.set(ref, domObject);
    this.irefs.set(domObject, ref);
    return ref;
}, _WorkerDOM_setupCommunications = function _WorkerDOM_setupCommunications() {
    const noop = () => { };
    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    const obj = {
        create: noop,
        frag: noop,
        query: noop,
        queryAll: noop,
        childNodes: noop,
        children: noop,
        innerHTML: noop,
        innerText: noop,
        textContent: noop,
        hasAttribute: noop,
        getAttribute: noop,
        getAttributes: noop,
        setAttribute: noop,
        setAttributes: noop,
        removeAttribute: noop,
        removeAttributes: noop,
        getStyle: noop,
        setStyle: noop,
        append: noop,
        appendChild: noop,
    };
    for (const method of DOMMethods)
        obj[method] = this[method].bind(this);
    this.commChannel.defineLocalFns(obj);
};
export { WorkerDOM, WorkerDOM as default };
//# sourceMappingURL=worker-dom-m.js.map