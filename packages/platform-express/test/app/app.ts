import * as express from "express";

export const app = express();

const router = express.Router();
router.get("/", (_, res) => {
  res.send("Hello World");
});
app.use(router);
