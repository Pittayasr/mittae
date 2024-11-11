import React from "react";
import { Modal, Button } from "react-bootstrap";
import { FaCheckCircle, FaExclamationTriangle } from "react-icons/fa";

interface AlertModalProps {
  show: boolean;
  onSuccess: () => void; 
  onConfirm: () => void;
  onBack: () => void;
  message: string;
  success: boolean;
}

const AlertModal: React.FC<AlertModalProps> = ({
  show,
  onSuccess,
  onBack,
  onConfirm,
  message,
  success,
}) => {
  return (
    <Modal
      show={show}
      onHide={success ? onSuccess : undefined} // ปิดได้เมื่อสำเร็จเท่านั้น
      centered
      backdrop={success ? true : "static"} // ป้องกันการคลิกปิดด้านนอกเมื่อยังไม่สำเร็จ
      keyboard={success} // ปิดการกดปุ่ม Esc เมื่อยังไม่สำเร็จ
    >
      <Modal.Header closeButton={success}>
        <Modal.Title className="d-flex align-items-center">
          {success ? (
            <>  
              <FaCheckCircle className="text-success me-2" />
              ส่งสำเร็จ
            </>
          ) : (
            <>
              <FaExclamationTriangle className="text-warning me-2" />
              ยืนยันการส่งข้อมูล 
            </>
          )}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p className="text-center">{message}</p>
      </Modal.Body>
      <Modal.Footer>
        {success ? (
          <Button variant="success" onClick={onSuccess}>
            ตกลง
          </Button>
        ) : (
          <>
            <Button variant="outline-success" onClick={onBack}>
              ยกเลิก
            </Button>
            <Button variant="success" onClick={onConfirm}>
              ยืนยัน
            </Button>
          </>
        )}
      </Modal.Footer>
    </Modal>
  );
};

export default AlertModal;
