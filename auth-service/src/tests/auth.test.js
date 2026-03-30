import test from "node:test";
import assert from "node:assert/strict";
import request from "supertest";
import app from "../app.js";

test("GET /health should return auth-service status", async () => {
  const res = await request(app).get("/health");

  assert.equal(res.status, 200);
  assert.deepEqual(res.body, {
    service: "auth-service",
    status: "ok"
  });
});

test("unknown route should return 404", async () => {
  const res = await request(app).get("/unknown-route");

  assert.equal(res.status, 404);
});

test("POST /api/auth with invalid body should not crash server", async () => {
  const res = await request(app)
    .post("/api/auth/login")
    .send({});

  assert.notEqual(res.status, 500);
});