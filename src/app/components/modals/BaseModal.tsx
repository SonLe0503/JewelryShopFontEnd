import { Button, Modal } from "antd";
import type { ReactNode } from "react";

interface BaseModalProps {
  title: string;
  open: boolean;
  onCancel: () => void;
  onSubmit?: () => void;
  okText?: string;
  cancelText?: string;
  children: ReactNode;
  width?: number;
  loading?: boolean;
}

const BaseModal = ({
  title,
  open,
  onCancel,
  onSubmit,
  okText = "Lưu",
  cancelText = "Hủy",
  children,
  width = 600,
  loading = false,
}: BaseModalProps) => {
  return (
    <Modal
      title={<h2 className="font-semibold text-lg">{title}</h2>}
      open={open}
      onCancel={onCancel}
      footer={[
        <Button key="cancel" onClick={onCancel}>
          {cancelText}
        </Button>,
        <Button
          key="submit"
          type="primary"
          loading={loading}
          onClick={onSubmit}
        >
          {okText}
        </Button>,
      ]}
      width={width}
      centered
      destroyOnHidden
    >
      {children}
    </Modal>
  );
};
export default BaseModal;