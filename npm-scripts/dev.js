import { join } from "node:path";
import { spawn } from "node:child_process";
import { watchCopy } from "./support/watch-copy.js";

const tsc = spawn("npx", ["tsc", "--watch"], { shell: true, stdio: "inherit" });
const liveserver = spawn("npx", ["live-server", "--port=8080", "--no-browser"], {
  shell: true,
  stdio: "inherit",
  cwd: join(process.cwd(), "./web/"),
});

console.log(`Successfully started TypeScript compiler, pid ${tsc.pid}`);
console.log(`Successfully started live-server, pid ${liveserver.pid}`);
watchCopy();
