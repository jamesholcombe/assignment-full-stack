import { Modal } from "antd";
import React from "react";
import { ProcurementRecordDto } from "../../server/src/server/types";

type Props = {
  record?: ProcurementRecordDto;
  onClose: () => void;
};

function ProcurementRecordPreviewModal(props: Props) {
  const { record, onClose } = props;
  if (!record) return null;
  return (
    <Modal
      title={record.title}
      visible={!!record}
      onOk={onClose}
      onCancel={onClose}
      cancelButtonProps={{ style: { display: "none" } }}
      maskClosable
      width="30vw"
    >
      <p>
        <strong>{record.buyer.name}</strong>
      </p>
      <pre style={{ whiteSpace: "pre-wrap", fontFamily: "inherit" }}>
        {record.description}
      </pre>
    </Modal>
  );
}

export default ProcurementRecordPreviewModal;
