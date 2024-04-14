import { useEffect, useState } from "react";
import { BuyerDto } from "../../../server/src/server/types";

export function useBuyers(searchText: string) {
  const [buyers, setBuyers] = useState<BuyerDto[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchBuyers() {
      const response = await fetch(
        `/api/buyers?` + new URLSearchParams({ searchText })
      );
      const data = await response.json();

      setBuyers(data);
      setLoading(false);
    }

    fetchBuyers();
  }, [searchText]);

  return { buyers, loading };
}
