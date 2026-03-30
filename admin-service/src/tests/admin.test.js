import test from "node:test";
import assert from "node:assert/strict";
import request from "supertest";
import app from "../app.js";

test("GET /api/admin/articles", async () => {
  const res = await request(app).get("/api/admin/articles");
  assert.strictEqual(res.status, 200);
});