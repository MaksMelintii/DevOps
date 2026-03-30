import test from "node:test";
import assert from "node:assert/strict";
import request from "supertest";
import app from "../src/app.js";

test("GET /api/categories/ should return 200", async () => {
  const res = await request(app).get("/api/categories/");
  assert.strictEqual(res.status, 200);
});