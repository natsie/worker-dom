import { WorkerDOM } from "./worker-dom/worker-dom-m.js";
import { expect } from "./lib/chai/chai.js";
import "./lib/mocha/mocha.js";

function createMochaElement() {
  const mochaElement = document.querySelector("#mocha") || document.createElement("div");
  mochaElement.parentElement !== document.body && document.body.appendChild(mochaElement);
  mochaElement.id = "mocha";
}

export default function test() {
  mocha.setup({ ui: "bdd", checkLeaks: true });

  describe("WorkerDOM", () => {
    const root = document.querySelector("main");
    const workerUrl = "data:text/javascript,console.log('Hello, world!');";
    let worker = new Worker(workerUrl);

    beforeEach(() => {
      if (worker) worker.terminate();
      worker = new Worker(workerUrl);
    });

    describe("construction", () => {
      it("should create a WorkerDOM instance when passed an object with a valid worker property", () => {
        const workerDOM = new WorkerDOM({ worker });
        expect(workerDOM).to.be.an.instanceof(WorkerDOM);
      });
    });
  });

  createMochaElement();
  mocha.run();
}
