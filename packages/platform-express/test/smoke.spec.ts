import { app } from "./app/app";
import * as request from "supertest";

describe("App Smoke Test", () => {
  it("should say hello", async () => {
    await request(app).get("/").expect(200);
  });
});
