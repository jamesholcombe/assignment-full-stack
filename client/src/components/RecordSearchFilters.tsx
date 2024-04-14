import { Input } from "antd";
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
    // TODO move these inputs into a generic filter component, including styling
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-around",
        padding: "1rem",
        marginBottom: "1rem",
      }}
    >
      <Input
        style={{ height: "50px", width: "500px" }}
        allowClear={true}
        size="large"
        placeholder="Search text..."
        value={filters.query}
        onChange={handleQueryChange}
      />
      <BuyerFilter filters={filters} onChange={onChange} />
    </div>
  );
}

export default RecordSearchFilters;
