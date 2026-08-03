import test from "node:test";
import assert from "node:assert/strict";
import { validateRegistry } from "../src/registry.mjs";

test("shipped external skill registry is valid and empty by default", async () => {
  assert.deepEqual(await validateRegistry(), []);
});
