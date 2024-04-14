import type {
  RecordSearchRequest,
  RecordSearchResponse,
} from "../../../server/src/server/types";

class Api {
  async searchRecords(
    request: RecordSearchRequest
  ): Promise<RecordSearchResponse> {
    const response = await fetch("/api/records", {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify(request),
    });
    return await response.json();
  }
}

export default Api;
