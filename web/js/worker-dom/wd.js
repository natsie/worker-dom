const mainThread = async () => (await import("./worker-dom-m.js")).WorkerDOM;
const workerThread = async () => (await import("./worker-dom-w.js")).default;

export { mainThread, workerThread };
