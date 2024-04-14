import { AutoComplete, Input } from "antd";
import { SearchFilters } from "./types";
import { BuyerDto } from "../../../server/src/server/types";
import { useState } from "react";
import { useBuyers } from "../hooks/useBuyers";

type Props = {
  filters: SearchFilters;
  onChange: (newFilters: SearchFilters) => void;
};

function BuyerFilter(props: Props) {
  const { filters, onChange } = props;

  const [buyerText, setBuyerText] = useState<string>("");

  const { buyers, loading } = useBuyers(buyerText);

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
        options={buyers.map((buyer: BuyerDto) => {
          return { value: buyer.name, label: buyer.name, id: buyer.id };
        })}
        allowClear={true}
        value={buyerText}
        onChange={handleChange}
        onSelect={onSelect}
        onClear={() => {
          onChange({ ...filters, buyerId: "" });
        }}
        onSearch={(searchText) => {
          setBuyerText(searchText);
        }}
      >
        <Input
          style={{ height: "50px", width: "500px" }}
          size="large"
          placeholder="Search for a buyer..."
        ></Input>
      </AutoComplete>
    </div>
  );
}

export default BuyerFilter;
