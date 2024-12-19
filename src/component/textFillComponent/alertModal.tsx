import React, { ReactNode } from "react";
import { Modal, Button } from "react-bootstrap";

interface AlertModalProps {
  show: boolean;
  onSuccess: () => void;
  onConfirm: () => void;
  onBack: () => void;
  message: ReactNode;
  success: boolean;
  isError?: boolean;
}

const AlertModal: React.FC<AlertModalProps> = ({
  show,
  onSuccess,
  onBack,
  onConfirm,
  message,
  success,
  isError,
}) => {
  return (
    <Modal
      show={show}
      onHide={success ? onSuccess : undefined} // ปิดได้เมื่อสำเร็จเท่านั้น
      centered
      backdrop={success || isError ? true : "static"} // ป้องกันการคลิกปิดด้านนอกเมื่อยังไม่สำเร็จ
      keyboard={success} // ปิดการกดปุ่ม Esc เมื่อยังไม่สำเร็จ
    >
      <Modal.Header closeButton={success}>
        <Modal.Title className="d-flex align-items-center">
          {success ? (
            <h5 className="m-0">ส่งสำเร็จ</h5>
          ) : isError ? (
            <h5 className="m-0">ส่งข้อมูลไม่สำเร็จ</h5>
          ) : (
            <h5 className="m-0">ยืนยันการส่งข้อมูล</h5>
          )}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="text-center">{message}</div>
      </Modal.Body>

      <Modal.Footer>
        {success ? (
          <Button
            variant="success"
            onClick={onSuccess}
            style={{ minWidth: "70px" }}
          >
            ตกลง
          </Button>
        ) : isError ? (
          <Button
            variant="outline-success"
            onClick={onBack} // ใช้ฟังก์ชัน onBack
            style={{ minWidth: "70px" }}
          >
            ตกลง
          </Button>
        ) : (
          <>
            <Button
              variant="outline-success"
              onClick={onBack}
              style={{ minWidth: "70px" }}
            >
              ยกเลิก
            </Button>
            <Button
              variant="success"
              onClick={onConfirm}
              style={{ minWidth: "70px" }}
            >
              ส่ง
            </Button>
          </>
        )}
      </Modal.Footer>
    </Modal>
  );
};

export default AlertModal;
