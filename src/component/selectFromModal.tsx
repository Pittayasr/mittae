import React from "react";
import { Modal, Button } from "react-bootstrap";
import { Col, Row } from "react-bootstrap";

interface SelectFormModalProps {
  isVisible: boolean;
  onClose: () => void;
  onNavigateToReadMe: () => void;
  onNavigateToPrint: () => void;
}

const SelectFormModal: React.FC<SelectFormModalProps> = ({
  isVisible,
  onClose,
  onNavigateToReadMe,
  onNavigateToPrint,
}) => {
  return (
    <Modal
      show={isVisible}
      backdrop="static"
      keyboard={false}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      onHide={onClose}
      centered
    >
      <Modal.Header>
        <Modal.Title>เลือกฟอร์ม</Modal.Title>
      </Modal.Header>
      <Modal.Body className="text-center">
        <Row>
          <Col className="mb-2" xs={12}>
            <Button
              variant="primary"
              className="mb-3 w-75"
              onClick={onNavigateToReadMe}
            >
              ไปยังหน้ากรอกฟอร์ม
            </Button>
          </Col>

          <Col className="mb-2" xs={12}>
            <Button
              variant="primary"
              className="w-75"
              onClick={onNavigateToPrint}
            >
              ไปยังหน้าระบบปริ้นเอกสาร
            </Button>
          </Col>
        </Row>
      </Modal.Body>
    </Modal>
  );
};

export default SelectFormModal;
