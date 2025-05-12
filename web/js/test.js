import { WorkerDOM } from "./worker-dom/worker-dom-m.js";

export default function test() {
  const worker = new Worker(new URL("./worker2.js", import.meta.url), { type: "module" });
  const workerDOM = new WorkerDOM({
    worker,
    root: document.querySelector("main"),
    config: {
      allowInnerHTML: true,
      forbiddenAttributes: new Set(["onclick"]),
    },
  });

  console.log(workerDOM);
}
