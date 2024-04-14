import { AutoComplete, Input } from "antd";
import React from "react";
import { SearchFilters } from "./types";
import BuyerFilter from "./BuyerFilter";

type Props = {
  filters: SearchFilters;
  onChange: (newFilters: SearchFilters) => void;
};

function RecordSearchFilters(props: Props) {
  const { filters, onChange } = props;

  const handleQueryChange = React.useCallback(
    (e: React.FormEvent<HTMLInputElement>) => {
      onChange({
        ...filters,
        query: e.currentTarget.value,
      });
    },
    [onChange, filters]
  );

  return (
    <div>
      <Input
        placeholder="Search text..."
        value={filters.query}
        onChange={handleQueryChange}
      />
      <BuyerFilter filters={filters} onChange={onChange} />
    </div>
  );
}

export default RecordSearchFilters;
