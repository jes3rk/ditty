import * as request from "supertest";
import { app } from "./app/app";

describe("Compatibility", () => {
  it("should respond 200 for a request to express", () => {
    return request(app).get("/express").expect(200);
  });
  it("should respond 200 for a request to dtty", () => {
    return request(app).get("/dtty").expect(200);
  });
  it.each(["get", "post", "put", "delete"])(
    "should respond 200 for a %s request to dtty",
    (method: string) => {
      return request(app)[method]("/dtty/methods").expect(200);
    },
  );
});
