import { Sequelize } from "sequelize-typescript";
import { Buyer } from "./Buyer";
import { ProcurementRecord } from "./ProcurementRecord";

export const sequelize = new Sequelize({
  dialect: "sqlite",
  storage: process.env["SQLITE_DB"] || "./db.sqlite3",
});

sequelize.addModels([Buyer, ProcurementRecord]);
