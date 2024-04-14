import { Request, Response } from "express";
import {
  ProcurementRecordDto,
  RecordSearchFilters,
  RecordSearchRequest,
  RecordSearchResponse,
} from "../types";
import { sequelize } from "../db/sequelize";
import { Buyer } from "../db/Buyer";
import { ProcurementRecord } from "../db/ProcurementRecord";

export const handleRecordSearch = async (req: Request, res: Response) => {
  // TODO: proper parsing of request payload
  const requestPayload = req.body as RecordSearchRequest;

  const { limit, offset } = requestPayload;

  if (limit === 0 || limit > 100) {
    res.status(400).json({ error: "Limit must be between 1 and 100." });
    return;
  }

  // We fetch one more record than requested.
  // If number of returned records is larger than
  // the requested limit it means there is more data than requested
  // and the client can fetch the next page.
  const records = await searchRecords(
    {
      textSearch: requestPayload.textSearch,
      buyerId: requestPayload.buyerId,
    },
    offset,
    limit + 1
  );

  const response: RecordSearchResponse = {
    records: await serializeProcurementRecords(
      records.slice(0, limit) // only return the number of records requested
    ),
    endOfResults: records.length <= limit, // in this case we've reached the end of results
  };

  res.json(response);
};

/**
 * Queries the database for procurement records according to the search filters.
 */
async function searchRecords(
  { textSearch, buyerId }: RecordSearchFilters,
  offset: number,
  limit: number
): Promise<ProcurementRecord[]> {
  // using conditional operator to check if textSearch or buyerId is present
  // if present, add WHERE clause to the query
  // if both are present, add AND clause to the query
  console.log("textSearch", textSearch);
  console.log("buyerId", buyerId);
  return await sequelize.query(
    `SELECT * 
      FROM procurement_records
      ${textSearch || buyerId ? "WHERE" : ""}
      ${
        textSearch
          ? "(title LIKE :textSearch OR description LIKE :textSearch)"
          : ""
      }
      ${textSearch && buyerId ? "AND" : ""}
      ${buyerId ? "(buyer_id = :buyerId)" : ""}  
      LIMIT :limit 
      OFFSET :offset`,
    {
      model: ProcurementRecord, // by setting this sequelize will return a list of ProcurementRecord objects
      replacements: {
        textSearch: `%${textSearch}%`,
        buyerId: buyerId,
        offset: offset,
        limit: limit,
      },
    }
  );
}

/**
 * Converts a DB-style ProcurementRecord object to an API type.
 * Assumes that all related objects (buyers) are prefetched upfront and passed in the `buyersById` map
 */
function serializeProcurementRecord(
  record: ProcurementRecord,
  buyersById: Map<string, Buyer>
): ProcurementRecordDto {
  const buyer = buyersById.get(record.buyer_id);
  if (!buyer) {
    throw new Error(
      `Buyer ${record.buyer_id} was not pre-fetched when loading record ${record.id}.`
    );
  }

  return {
    id: record.id,
    title: record.title,
    description: record.description,
    publishDate: record.publish_date,
    buyer: {
      id: buyer.id,
      name: buyer.name,
    },
    stage: record.stage,
    closeDate: record.close_date,
    awardDate: record.award_date,
    value: record.value,
    currency: record.currency,
  };
}

function unique<T>(items: Iterable<T>): T[] {
  return Array.from(new Set(items));
}

/**
 * Converts an array of DB-style procurement record object into API types.
 * Prefetches all the required relations.
 */
async function serializeProcurementRecords(
  records: ProcurementRecord[]
): Promise<ProcurementRecordDto[]> {
  // Get unique buyer ids for the selected records
  const buyerIds = unique(records.map((pr) => pr.buyer_id));

  // Fetch the buyer data in one query
  const buyers = await sequelize.query(
    "SELECT * FROM buyers WHERE id IN (:buyerIds)",
    {
      model: Buyer,
      replacements: {
        buyerIds,
      },
    }
  );

  const buyersById = new Map(buyers.map((b) => [b.id, b]));
  return records.map((r) => serializeProcurementRecord(r, buyersById));
}
