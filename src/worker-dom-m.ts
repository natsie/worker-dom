import { MRpc } from "./lib/@mys-x/m-rpc/dist/main.js";
import DOMPurify from "./lib/dom-purify/purify.es.mjs";
import type {
  ElementTagName,
  WorkerDOMMethod,
  WorkerDOMObject,
  WorkerDOMRef,
  WorkerDOMDefaultConfig,
} from "./worker-dom-types.js";

const DOMMethods: WorkerDOMMethod[] = [
  "getRoot",
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

class WorkerDOMSecurityError extends Error {}
class WorkerDOM {
  static get defaultConfig(): WorkerDOMDefaultConfig {
    return {
      allowStyling: true,
      allowUnknown: false,
      allowCustomElements: false,
      allowedElements: new Set(
        ([] as string[]).concat(
          [
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
          ],
          [
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
          ]
        )
      ),
      forbiddenElements: new Set(["script", "iframe", "object", "embed", "link", "meta"]),
      forbiddenAttributes: new Set(["src", "href", "action"]),
      forbiddenAttributesRgx: [/^\s*on\w+\s*$/i],
      allowInnerHTML: false,
    };
  }

  #id = -1;
  root: Element;
  worker: Worker;
  commChannel: MRpc;
  #uuid: string = crypto.randomUUID();
  config: typeof WorkerDOM.defaultConfig;
  refs: Map<WorkerDOMRef, WorkerDOMObject>;
  irefs: Map<WorkerDOMObject, WorkerDOMRef>;
  constructor({
    worker,
    root,
    config = {},
  }: {
    worker: Worker;
    root?: Element;
    config?: Partial<WorkerDOMDefaultConfig>;
  }) {
    this.#validateInitialisers(worker, root, config);

    this.config = WorkerDOM.defaultConfig;
    this.worker = worker;
    this.refs = new Map();
    this.irefs = new Map();
    this.commChannel = new MRpc(worker);

    const _root = (root || document.createElement("main")) as Element;
    if (!(_root instanceof Element)) throw new Error("Failed to create root element.");

    this.root = _root;
    this.#referenceTo(_root);
    this.#setupCommunications();
    this.#initialiseConfig(config);
  }

  #validateInitialisers(worker: Worker, root?: Element, config?: Partial<WorkerDOMDefaultConfig>) {
    if (!(worker instanceof Worker)) throw new TypeError("`worker` must be a Worker instance.");
    if (root != null && !(root instanceof Element))
      throw new TypeError("`root` must be an Element instance.");
    if (config != null && typeof config !== "object")
      throw new TypeError("`config` must be an object.");
  }

  #initialiseConfig(config: Partial<WorkerDOMDefaultConfig>) {
    const {
      allowStyling,
      allowUnknown,
      allowCustomElements,
      allowedElements,
      forbiddenElements,
      forbiddenAttributes,
      forbiddenAttributesRgx,
      allowInnerHTML,
    } = config;
    if (allowStyling != null) this.config.allowStyling = !!allowStyling;
    if (allowUnknown != null) this.config.allowUnknown = !!allowUnknown;
    if (allowCustomElements != null) this.config.allowCustomElements = !!allowCustomElements;
    if (allowedElements != null) this.config.allowedElements = new Set(allowedElements);
    if (forbiddenElements != null) this.config.forbiddenElements = new Set(forbiddenElements);
    if (forbiddenAttributes != null) this.config.forbiddenAttributes = new Set(forbiddenAttributes);
    if (forbiddenAttributesRgx != null) {
      this.config.forbiddenAttributesRgx = Array.from(forbiddenAttributesRgx).filter(
        (el) => el instanceof RegExp
      );
    }
    if (allowInnerHTML != null) this.config.allowInnerHTML = !!allowInnerHTML;
  }

  #isValidAttributeName(name: string) {
    if (this.config.forbiddenAttributes.has(name)) return false;
    if (this.config.forbiddenAttributesRgx.some((el) => el.test(name))) return false;
    return true;
  }

  #isAccessibleDOMObject(domObject: WorkerDOMObject | string) {
    if (typeof domObject === "string") {
      const [tagName, is] = domObject.split(",");
      const isCustomElement = /^[a-z][a-z0-9]*(?:-[a-z][a-z0-9]*)*$/i.test(tagName);
      if (is != null && !this.config.allowCustomElements) return false;
      if (this.config.forbiddenElements.has(tagName)) return false;
      if (this.config.allowedElements.has(tagName)) return true;
      if (isCustomElement && this.config.allowCustomElements) return true;

      return this.config.allowUnknown;
    }

    if (domObject === this.root) return true;

    if (domObject instanceof DocumentFragment) return true;
    if (domObject.nodeType === Node.TEXT_NODE) return true;
    if (Object.getPrototypeOf(domObject) === Node.prototype) return domObject.nodeName === "#text";

    const tagName = (domObject as Element).tagName.toLowerCase();
    const isCustomElement = /^[a-z][a-z0-9]*(?:-[a-z][a-z0-9]*)*$/i.test(tagName);
    if (this.config.forbiddenElements.has(tagName)) return false;
    if (this.config.allowedElements.has(tagName)) return true;
    if (isCustomElement && this.config.allowCustomElements) return true;

    return this.config.allowUnknown;
  }

  #referenceTo(domObject: WorkerDOMObject) {
    if (!this.#isAccessibleDOMObject(domObject))
      throw new WorkerDOMSecurityError("Access denied to DOM object.");
    const ref = this.irefs.get(domObject);
    return ref === undefined ? this.#setRef(++this.#id, domObject) : ref;
  }

  #setRef(ref: WorkerDOMRef, domObject: WorkerDOMObject) {
    if (!this.#isAccessibleDOMObject(domObject))
      throw new WorkerDOMSecurityError("Access denied to DOM object.");
    this.refs.set(ref, domObject);
    this.irefs.set(domObject, ref);
    return ref;
  }

  #setupCommunications() {
    const noop = () => {};
    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    const obj: { [m in WorkerDOMMethod]: (...args: any[]) => any } = {
      getRoot: noop,
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

    for (const method of DOMMethods) obj[method] = this[method as WorkerDOMMethod].bind(this);
    this.commChannel.defineLocalFns(obj);
  }

  getRoot(): WorkerDOMRef {
    return this.#referenceTo(this.root);
  }

  create(tagName: ElementTagName | ElementTagName[]): WorkerDOMRef[] {
    const elements = Array.isArray(tagName) ? tagName : [tagName || "div"];
    const result: WorkerDOMRef[] = new Array(elements.length);

    for (let i = 0; i < elements.length; i++) {
      if (typeof elements[i] !== "string") {
        throw new TypeError("`tagName` must be a string or an array of strings.");
      }
      if (!this.#isAccessibleDOMObject(elements[i])) {
        throw new WorkerDOMSecurityError(
          `Creation of element <${elements[i].replace(
            /\s*\,\s*/,
            ", "
          )}> is not allowed by the WorkerDOM configuration.`
        );
      }
      const [name, is] = elements[i].split(",");
      const element = is ? document.createElement(name, { is }) : document.createElement(name);
      const id = ++this.#id;

      this.#setRef(id, element);
      result[i] = id;
    }

    return result;
  }

  frag(): WorkerDOMRef {
    const id = ++this.#id;
    const frag = document.createDocumentFragment();

    this.#setRef(id, frag);
    return id;
  }

  query(parentRef: WorkerDOMRef, selector: string): WorkerDOMRef | null {
    const parent = this.refs.get(parentRef == null ? 0 : parentRef) as Element | DocumentFragment;
    if (!(parent instanceof Element || parent instanceof DocumentFragment)) {
      throw new TypeError("`parentRef` did not refer to a queryable DOM object.");
    }

    const target = parent.querySelector(selector);
    if (target === null) return null;
    return this.#referenceTo(target);
  }

  queryAll(parentRef: WorkerDOMRef, selector: string): WorkerDOMRef[] {
    const parent = this.refs.get(parentRef == null ? 0 : parentRef) as Element | DocumentFragment;
    if (!(parent instanceof Element || parent instanceof DocumentFragment)) {
      throw new TypeError("`parentRef` did not refer to a queryable DOM object.");
    }

    const targets = parent.querySelectorAll(selector);
    return Array.from(targets, (t) => this.#referenceTo(t));
  }

  childNodes(ref: WorkerDOMRef): WorkerDOMRef[] {
    const target = this.refs.get(ref);
    if (!(target instanceof Node)) {
      throw new TypeError("`ref` did not refer to a Node instance.");
    }

    return Array.from(target.childNodes, (t) => this.#referenceTo(t));
  }

  children(ref: WorkerDOMRef): WorkerDOMRef[] {
    const target = this.refs.get(ref);
    if (!(target instanceof Element)) {
      throw new TypeError("`ref` did not refer to an Element instance.");
    }

    return Array.from(target.children, (t) => this.#referenceTo(t));
  }

  innerHTML(ref: WorkerDOMRef, text?: string): string {
    const target = this.refs.get(ref);
    if (!(target instanceof Element)) {
      throw new TypeError("`ref` did not refer to an Element instance.");
    }

    if (text != null) {
      if (this.config.allowInnerHTML) target.innerHTML = DOMPurify.sanitize(text);
      else
        throw new WorkerDOMSecurityError(
          "Setting innerHTML is not permitted by the WorkerDOM configuration."
        );
    }
    return target.innerHTML;
  }

  innerText(ref: WorkerDOMRef, text?: string): string {
    const target = this.refs.get(ref) as HTMLElement;
    if (!(target instanceof HTMLElement)) {
      throw new TypeError("`ref` did not refer to an HTMLElement instance.");
    }

    if (text !== undefined) target.innerText = text;
    return target.innerText;
  }

  textContent(ref: WorkerDOMRef, text?: string): string | null {
    const target = this.refs.get(ref) as Node;
    if (!(target instanceof Node)) {
      throw new TypeError("`ref` did not refer to a Node instance.");
    }

    if (text !== undefined) target.textContent = text;
    return target.textContent;
  }

  hasAttribute(ref: WorkerDOMRef, attribute: string): boolean {
    const target = this.refs.get(ref) as Element;
    if (!(target instanceof Element)) {
      throw new TypeError("`ref` did not refer to an Element instance.");
    }

    if (!this.#isValidAttributeName(attribute)) {
      throw new WorkerDOMSecurityError(
        `Access to attribute "${attribute}" is not allowed by the WorkerDOM configuration.`
      );
    }

    return target.hasAttribute(attribute);
  }

  getAttribute(ref: WorkerDOMRef, attribute: string): string | null {
    const target = this.refs.get(ref) as Element;
    if (!(target instanceof Element)) {
      throw new TypeError("`ref` did not refer to an Element instance.");
    }

    if (!this.#isValidAttributeName(attribute)) {
      throw new WorkerDOMSecurityError(
        `Access to attribute "${attribute}" is not allowed by the WorkerDOM configuration.`
      );
    }

    return target.getAttribute(attribute);
  }

  getAttributes(ref: WorkerDOMRef): Record<string, string | null> {
    const target = this.refs.get(ref) as Element;
    if (!(target instanceof Element)) {
      throw new TypeError("`ref` did not refer to an Element instance.");
    }

    const result: { [index: string]: string | null } = {};
    const attributes = Array.from(target.attributes);

    for (let i = 0; i < attributes.length; i++) {
      const attribute = attributes[i];
      const name = attribute.nodeName;

      if (!this.#isValidAttributeName(name)) {
        throw new WorkerDOMSecurityError(
          `Access to attribute "${name}" is not allowed by the WorkerDOM configuration.`
        );
      }

      result[name] = attribute.nodeValue;
    }
    return result;
  }

  setAttribute(ref: WorkerDOMRef, attribute: string, value: string): void {
    const target = this.refs.get(ref) as Element;
    if (!(target instanceof Element)) {
      throw new TypeError("`ref` did not refer to an Element instance.");
    }

    if (!this.#isValidAttributeName(attribute)) {
      throw new WorkerDOMSecurityError(
        `Access to attribute "${attribute}" is not allowed by the WorkerDOM configuration.`
      );
    }

    target.setAttribute(attribute, value);
  }

  setAttributes(ref: WorkerDOMRef, attributes: Record<string, string | null>): void {
    const target = this.refs.get(ref) as Element;
    if (!(target instanceof Element)) {
      throw new TypeError("`ref` did not refer to an Element instance.");
    }

    for (const attribute in attributes) {
      if (!this.#isValidAttributeName(attribute)) {
        throw new WorkerDOMSecurityError(
          `Access to attribute "${attribute}" is not allowed by the WorkerDOM configuration.`
        );
      }

      const value = attributes[attribute];
      if (value === null) target.removeAttribute(attribute);
      else target.setAttribute(attribute, value);
    }
  }

  removeAttribute(ref: WorkerDOMRef, attribute: string): void {
    const target = this.refs.get(ref) as Element;
    if (!(target instanceof Element)) {
      throw new TypeError("`ref` did not refer to an Element instance.");
    }

    if (!this.#isValidAttributeName(attribute)) {
      throw new WorkerDOMSecurityError(
        `Access to attribute "${attribute}" is not allowed by the WorkerDOM configuration.`
      );
    }

    target.removeAttribute(attribute);
  }

  removeAttributes(ref: WorkerDOMRef, attributes: string[]): void {
    const target = this.refs.get(ref) as Element;
    if (!(target instanceof Element)) {
      throw new TypeError("`ref` did not refer to an Element instance.");
    }

    for (let i = 0; i < attributes.length; i++) {
      const attribute = attributes[i];

      if (!this.#isValidAttributeName(attribute)) {
        throw new WorkerDOMSecurityError(
          `Access to attribute "${attribute}" is not allowed by the WorkerDOM configuration.`
        );
      }

      target.removeAttribute(attribute);
    }
  }

  getStyle(ref: WorkerDOMRef, computed = false): Record<string, string> {
    if (!this.config.allowStyling) {
      throw new WorkerDOMSecurityError(
        "Access to style is not allowed by the WorkerDOM configuration."
      );
    }

    const target = this.refs.get(ref) as HTMLElement | SVGElement;
    if (!(target instanceof HTMLElement || target instanceof SVGElement)) {
      throw new TypeError("`ref` did not refer to an HTMLElement or SVGElement instance.");
    }

    const style = target.style;
    const props = [
      ...Object.getOwnPropertyNames(style),
      ...Object.getOwnPropertyNames(Object.getPrototypeOf(style)),
    ];
    const result: { [index: string]: string } = {};

    for (let i = 0; i < props.length; i++) {
      // @ts-expect-error
      const value: string = style[props[i]];
      if (typeof value === "string") result[props[i]] = value;
    }

    return result;
  }

  setStyle(ref: WorkerDOMRef, declaration: Record<string, string>): void {
    if (!this.config.allowStyling) {
      throw new WorkerDOMSecurityError(
        "Access to style is not allowed by the WorkerDOM configuration."
      );
    }

    const target = this.refs.get(ref) as HTMLElement | SVGElement;
    if (!(target instanceof HTMLElement || target instanceof SVGElement)) {
      throw new TypeError("`ref` did not refer to an HTMLElement or SVGElement instance.");
    }

    const style = target.style;
    // @ts-expect-error
    for (const prop in declaration) style[prop] = declaration[prop];
  }

  append(ref: WorkerDOMRef, children: (WorkerDOMRef | string)[]): void {
    const target = this.refs.get(ref) as Element | DocumentFragment;
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
      if (!this.#isAccessibleDOMObject(child)) {
        throw new WorkerDOMSecurityError("Access denied to child DOM object.");
      }
      target.append(child);
    }
  }

  appendChild(ref: WorkerDOMRef, childRef: WorkerDOMRef): void {
    const target = this.refs.get(ref) as Element | DocumentFragment;
    if (!(target instanceof Element || target instanceof DocumentFragment)) {
      throw new TypeError("`ref` did not refer to an Element or DocumentFragment instance.");
    }
    const child = this.refs.get(childRef);
    if (!(child instanceof Node)) {
      throw new TypeError("`childRef` must refer to a Node instance.");
    }
    if (!this.#isAccessibleDOMObject(child)) {
      throw new WorkerDOMSecurityError("Access denied to child DOM object.");
    }
    target.appendChild(child);
  }
}

export { WorkerDOM, WorkerDOM as default };
