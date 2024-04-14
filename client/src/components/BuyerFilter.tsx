import { AutoComplete, Input } from "antd";
import { SearchFilters } from "./types";
import { BuyerDto } from "../../../server/src/server/types";
import { useState, useCallback } from "react";
import { useBuyers } from "../hooks/useBuyers";

type Props = {
  filters: SearchFilters;
  onChange: (newFilters: SearchFilters) => void;
};

function BuyerFilter(props: Props) {
  const { filters, onChange } = props;

  const [buyerText, setBuyerText] = useState<string>("");

  const { buyers, loading } = useBuyers(buyerText);

  console.log(buyers);

  const onSelect = (
    buyerName: string,
    buyerOption: {
      value: string;
      label: string;
      id: string;
    }
  ) => {
    // use the onChange to update the parent component, this will then filter the records
    onChange({
      ...filters,
      buyerId: buyerOption.id,
    });
  };

  const handleChange = (data: string) => {
    setBuyerText(data);
  };

  return (
    <div>
      <AutoComplete
        style={{ width: 200 }}
        options={buyers.map((buyer: BuyerDto) => {
          return { value: buyer.name, label: buyer.name, id: buyer.id };
        })}
        value={buyerText}
        onChange={handleChange}
        onSelect={onSelect}
        onSearch={(searchText) => {
          setBuyerText(searchText);
        }}
      >
        <Input size="large" placeholder="Search buyer"></Input>
      </AutoComplete>
    </div>
  );
}

export default BuyerFilter;
