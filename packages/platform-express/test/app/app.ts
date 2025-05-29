import * as express from "express";
import { DttyExpress } from "../../src";

export const app = express();
const dtty = new DttyExpress(app);

dtty.get("/dtty", () => "Success");

app.get("/", (_, res) => {
  res.send("Hello World");
});
app.get("/express", (_, res) => {
  res.send("Success");
});
