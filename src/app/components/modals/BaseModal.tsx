import { Button, Modal } from "antd";
import type { ReactNode } from "react";

interface BaseModalProps {
  title: string;
  open: boolean;
  onCancel: () => void;
  onSubmit?: () => void; // nếu có thì hiển thị nút Lưu
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
  cancelText = "Đóng",
  children,
  width = 600,
  loading = false,
}: BaseModalProps) => {
  // Chỉ tạo footer nếu onSubmit tồn tại, còn không chỉ hiển thị nút Đóng
  const footer = onSubmit
    ? [
        <Button key="cancel" onClick={onCancel}>
          {cancelText}
        </Button>,
        <Button key="submit" type="primary" loading={loading} onClick={onSubmit}>
          {okText}
        </Button>,
      ]
    : [
        <Button key="cancel" onClick={onCancel}>
          {cancelText}
        </Button>,
      ];

  return (
    <Modal
      title={<h2 className="font-semibold text-lg">{title}</h2>}
      open={open}
      onCancel={onCancel}
      footer={footer}
      width={width}
      centered
      destroyOnHidden
    >
      {children}
    </Modal>
  );
};

export default BaseModal;
