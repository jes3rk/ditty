import * as express from "express";
import { DttyExpress } from "../../src";

export const app = express();
const dtty = new DttyExpress(app);

dtty.get("/dtty", () => "Success");

const router = express.Router();
router.get("/", (_, res) => {
  res.send("Hello World");
});
router.get("/express", (_, res) => {
  res.send("Success");
});
app.use(router);
