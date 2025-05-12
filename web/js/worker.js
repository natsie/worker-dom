import dom from "./worker-dom/worker-dom-w.js";

const now = () => performance.now();
/**
 * Returns a promise that resolves after a specified amount of time.
 * @param {number} delay Time in milliseconds to wait before resolving the Promise.
 * @returns {Promise<DOMHighResTimeStamp>} Promise that resolves with the return value of `performance.now()`
 */
const wait = (delay = 1000) => new Promise((r) => setTimeout(() => r(now()), delay));

// await dom.innerHTML(0, "<h1><em>This was dynamically inserted by a Web Worker.</em></h1>");
// await dom.setStyle(0, { color: "deeppink", border: "1px solid black", filter: "blur(.5px)" });
// console.log(await dom.create("style"));
