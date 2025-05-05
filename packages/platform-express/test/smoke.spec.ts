import { app as server } from "./app/app";
import * as request from "supertest";

describe("App Smoke Test", () => {
  it("should say hello", async () => {
    await request(server).get("/").expect(200);
  });
});
