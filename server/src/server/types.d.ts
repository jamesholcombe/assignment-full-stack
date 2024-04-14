// TODO create DTOs using generics, where we use Omit to exclude data from fe

export type RecordSearchRequest = RecordSearchFilters & {
  offset: number;
  limit: number;
};

export type BuyerDto = {
  id: string;
  name: string;
};

export type ProcurementRecordDto = {
  id: string;
  title: string;
  description: string;
  buyer: BuyerDto;
  publishDate: string;
  stage: "TENDER" | "CONTRACT";
  closeDate: string | null;
  awardDate: string | null;
  value: number | null;
  currency: string | null;
};

export type RecordSearchResponse = {
  records: ProcurementRecordDto[];
  endOfResults: boolean; // this is true when there are no more results to search
};

export type RecordSearchFilters = {
  textSearch?: string;
  buyerId?: string;
};
