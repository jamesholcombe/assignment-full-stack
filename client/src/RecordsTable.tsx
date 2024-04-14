import { Table } from "antd";
import { ColumnType } from "antd/lib/table";
import React from "react";
import type { ProcurementRecordDto } from "../../server/src/server/types";
import ProcurementRecordPreviewModal from "./ProcurementRecordPreview";

type Props = {
  records: ProcurementRecordDto[];
};

function RecordsTable(props: Props) {
  const { records } = props;
  const [previewedRecord, setPreviewedRecord] = React.useState<
    ProcurementRecordDto | undefined
  >();

  const columns = React.useMemo<ColumnType<ProcurementRecordDto>[]>(() => {
    return [
      {
        title: "Published",
        render: (record: ProcurementRecordDto) =>
          new Date(record.publishDate).toLocaleDateString(),
      },
      {
        title: "Title",
        render: (record: ProcurementRecordDto) => {
          const handleClick = (e: React.MouseEvent) => {
            e.preventDefault();
            setPreviewedRecord(record);
          };
          return (
            <a href="#" onClick={handleClick}>
              {record.title}
            </a>
          );
        },
      },
      {
        title: "Buyer name",
        render: (record: ProcurementRecordDto) => record.buyer.name,
      },
      {
        title: "Stage",
        render: (record: ProcurementRecordDto) => {
          if (record.stage === "TENDER") {
            const closeDate = new Date(record.closeDate!);
            return closeDate > new Date()
              ? `Open until ${record.closeDate}`
              : "Closed";
          } else {
            return `Awarded on ${record.awardDate}`;
          }
        },
      },
      {
        title: "Value",
        render: (record: ProcurementRecordDto) =>
          record.value ? `${record.value} ${record.currency}` : "",
      },
    ];
  }, []);
  return (
    <>
      <Table columns={columns} dataSource={records} pagination={false} />
      <ProcurementRecordPreviewModal
        record={previewedRecord}
        onClose={() => setPreviewedRecord(undefined)}
      />
    </>
  );
}

export default RecordsTable;
