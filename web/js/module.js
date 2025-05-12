import { WorkerDOM } from "./worker-dom/worker-dom-m.js";
import test from "./test.js";

const /** @type {typeof console.log} */ log = console.log.bind(console);

const worker = new Worker(import.meta.resolve("./worker.js"), { type: "module" });
const dom = new WorkerDOM({
  worker,
  root: document.querySelector("main"),
  config: { allowInnerHTML: true },
});

log(dom);
test();
