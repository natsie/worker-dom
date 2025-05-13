const mainThread = async () => (await import("./dist/worker-dom-m.js")).WorkerDOM;
const workerThread = async () => (await import("./dist/worker-dom-w.js")).default;

export { mainThread, workerThread };
