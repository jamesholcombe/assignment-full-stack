import { BuyerDto } from "../types";
import { Request, Response } from "express";
import { sequelize } from "../db/sequelize";
import { Buyer } from "../db/Buyer";

export async function handleGetBuyers(req: Request, res: Response) {
  const searchText = req.query.searchText as string;

  // if searchText is undefined, set it to an empty string
  const buyers = await getBuyers(searchText || "");

  res.json(buyers).status(200);
}

export async function getBuyers(searchText: string): Promise<BuyerDto[]> {
  const limit = 10;
  // TODO remove hardcoded limit

  // if searchText is empty, return all buyers
  return await sequelize.query(
    "SELECT * FROM buyers WHERE name LIKE :searchText LIMIT :limit",
    {
      model: Buyer,
      replacements: {
        searchText: `%${searchText}%`,
        limit: limit,
      },
    }
  );
}
