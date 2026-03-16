import { test} from "node:test";
import assert from "node:assert";
import request from "supertest";
import app from "../src/server.js";

test("GET /api/admin/articles", async () => {
  const res = await request(app).get("/api/admin/articles");
  assert.strictEqual(res.status, 200);
});

test("GET /api/categories/", async () => {
  const res = await request(app).get("/api/categories/");
  assert.strictEqual(res.status, 200);
});