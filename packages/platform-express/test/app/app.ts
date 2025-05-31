import * as express from "express";
import { DttyExpress } from "../../src";
import { IHandler } from "packages/core/dist";

export const app: express.Express = express();
const dtty = new DttyExpress(app);

dtty.get("/dtty", { handler: () => "success" });

const genericHandler: IHandler = {
  handler: () => "success",
};
dtty
  .get("/dtty/methods", genericHandler)
  .post("/dtty/methods", genericHandler)
  .put("/dtty/methods", genericHandler)
  .delete("/dtty/methods", genericHandler);

app.get("/", (_, res) => {
  res.send("Hello World");
});

app.get("/express", (_, res) => {
  res.send("Success");
});
