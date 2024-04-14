import express from "express";

import { handleRecordSearch } from "./controllers/recordSearch";
import { handleGetBuyers } from "./controllers/getBuyers";

/**
 * This file has little structure and doesn't represent production quality code.
 * Feel free to refactor it or add comments on what could be improved.
 *
 * We specifically avoided any use of sequelize ORM features for simplicity and used plain SQL queries.
 * Sequelize's data mapping is used to get nice JavaScript objects from the database rows.
 *
 * You can switch to using the ORM features or continue using SQL.
 */

// TODO: use zod to validate request payloads

const app = express();

app.set("port", process.env.PORT || 3000);
app.set("views", "./views");
app.set("view engine", "ejs");

app.locals["assets_url"] = process.env.VITE_URL || "http://localhost:3001";

app.get("/", (_req, res) => {
  res.render("index.html.ejs");
});

app.use(express.json());

app.post("/api/records", handleRecordSearch);
app.get("/api/buyers", handleGetBuyers);

app.listen(app.get("port"), () => {
  console.log("  App is running at http://localhost:%d", app.get("port"));
  console.log("  Press CTRL-C to stop\n");
});
