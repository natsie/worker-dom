import { cp, mkdir, watch } from "node:fs/promises";

async function copy() {
  await mkdir("./dist/", { recursive: true });
  await cp("./dist/", "./web/js/worker-dom/", { preserveTimestamps: true, recursive: true });
}

export async function watchCopy() {
  await copy();
  for await (const _entry of watch("./dist/", { recursive: true })) await copy();
}
