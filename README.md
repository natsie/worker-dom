# WorkerDOM

**WorkerDOM** is a library that enables safe, structured, and efficient manipulation of the DOM from Web Workers. It provides a secure RPC-based API for creating, querying, and updating DOM elements from a worker context, while enforcing configurable security policies on the main thread.

## Description

WorkerDOM bridges the gap between the main UI thread and Web Workers, allowing workers to interact with the DOM without direct access. All DOM operations are validated and executed on the main thread, preventing unsafe or unauthorized modifications. This approach enables offloading UI logic to workers, improving responsiveness and security.

## Use Cases

- **Offloading UI logic:** Move expensive or complex UI logic to a worker, keeping the main thread responsive.
- **Sandboxed rendering:** Safely render untrusted or user-generated content in a controlled DOM environment.
- **Collaborative editing:** Synchronize DOM changes from multiple workers or remote sources.
- **Security hardening:** Enforce strict policies on allowed elements, attributes, and styles.

## API Overview

The WorkerDOM API is exposed to workers as a set of asynchronous functions:

- `getRoot(): Promise<number>`
- `create(tagName: string | string[]): Promise<number[]>`
- `frag(): Promise<number>`
- `query(parentRef: number, selector: string): Promise<number | null>`
- `queryAll(parentRef: number, selector: string): Promise<number[]>`
- `childNodes(ref: number): Promise<number[]>`
- `children(ref: number): Promise<number[]>`
- `innerHTML(ref: number, text?: string): Promise<string>`
- `innerText(ref: number, text?: string): Promise<string>`
- `textContent(ref: number, text?: string): Promise<string | null>`
- `hasAttribute(ref: number, attribute: string): Promise<boolean>`
- `getAttribute(ref: number, attribute: string): Promise<string | null>`
- `getAttributes(ref: number): Promise<Record<string, string | null>>`
- `setAttribute(ref: number, attribute: string, value: string): Promise<void>`
- `setAttributes(ref: number, attributes: Record<string, string | null>): Promise<void>`
- `removeAttribute(ref: number, attribute: string): Promise<void>`
- `removeAttributes(ref: number, attributes: string[]): Promise<void>`
- `getStyle(ref: number, computed?: boolean): Promise<Record<string, string>>`
- `setStyle(ref: number, declaration: Record<string, string>): Promise<void>`
- `append(ref: number, ...children: number[]): Promise<void>`
- `appendChild(ref: number, childRef: number): Promise<void>`

All references (`ref`) are numeric handles to DOM nodes managed by WorkerDOM.

## Usage Example

**Main thread:**

```typescript
import { WorkerDOM } from "./worker-dom/worker-dom-m.js";

const worker = new Worker(new URL("./worker.js", import.meta.url), { type: "module" });
const workerDOM = new WorkerDOM({
  worker,
  root: document.querySelector("main"),
  config: {
    allowInnerHTML: true,
    forbiddenAttributes: new Set(["onclick"]),
    // ...other security options
  },
});
```

**Worker thread (`worker.js`):**

```typescript
import dom from "./worker-dom/worker-dom-w.js";

async function run() {
  const rootRef = await dom.getRoot()
  const [divRef] = await dom.create("div");
  await dom.setAttribute(divRef, "class", "greeting");
  await dom.textContent(divRef, "Hello from Worker!");
  await dom.appendChild(rootRef, divRef);
}

run();
```

## Considerations

- **Security:** All DOM operations are subject to the main thread's security policy. Forbidden elements, attributes, or styles will throw errors.
- **Performance:** Communication between worker and main thread is asynchronous and may introduce latency for frequent or complex DOM operations.
- **References:** DOM nodes are referenced by numeric IDs. These are only valid within the context of the current WorkerDOM instance.
- **No direct DOM access:** Workers cannot access the DOM directly; all operations must go through the WorkerDOM API.

## License

MIT License © 2025 Oghenevwegba Obire
