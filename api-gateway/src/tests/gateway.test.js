import test from "node:test";
import assert from "node:assert/strict";
import request from "supertest";
import app from "../app.js";

test("GET /health should return gateway status", async () => {
  const res = await request(app).get("/health");

  assert.equal(res.status, 200);
  assert.deepEqual(res.body, {
    service: "api-gateway",
    status: "ok"
  });
});

test("unknown route should return 404", async () => {
  const res = await request(app).get("/some-random-route");

  assert.equal(res.status, 404);
});