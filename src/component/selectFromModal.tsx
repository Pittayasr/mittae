// selectFormModal.tsx
import React from "react";
import { Modal, Button, Col, Row } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

interface SelectFormModalProps {
  isVisible: boolean;
  onClose: () => void;
  onNavigateToReadMe: () => void;
  onNavigateToPrint: () => void;
  onNavigateToDelivery: () => void;
  onNavigateToInsurance: () => void;
}

const SelectFormModal: React.FC<SelectFormModalProps> = ({
  isVisible,
  onClose,
}) => {
  const navigate = useNavigate();

  const handleNavigateToForm = () => {
    navigate("/form");
    onClose();
  };

  const handleNavigateToPrint = () => {
    navigate("/print");
    onClose();
  };

  const handleNavigateToDelivery = () => {
    navigate("/delivery");
    onClose();
  };

  const onNavigateToInsurance = () => {
    navigate("/insurance");
    onClose();
  };

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
        <Modal.Title>บริการของร้าน</Modal.Title>
      </Modal.Header>
      <Modal.Body className="text-center">
        <Row>
          <Col className="mb-2" xs={12}>
            <Button
              variant="success"
              className="mb-3 w-75"
              onClick={handleNavigateToForm}
            >
              พรบ. ต่อภาษีรถ
            </Button>
          </Col>

          <Col className="mb-2" xs={12}>
            <Button
              variant="success"
              className="mb-3 w-75"
              onClick={handleNavigateToPrint}
            >
              ปริ้นเอกสาร
            </Button>
          </Col>
          <Col className="mb-2" xs={12}>
            <Button
              variant="success"
              className="mb-3 w-75"
              onClick={onNavigateToInsurance}
            >
              ประกันภัย ป1 ป2 ป3 ป4 ป5
            </Button>
          </Col>

          <Col className="mb-2" xs={12}>
            <Button
              variant="success"
              className="w-75"
              onClick={handleNavigateToDelivery}
            >
              ส่งรถส่งของกลับบ้าน แฟลชและไปรษณีย์
            </Button>
          </Col>
        </Row>
      </Modal.Body>
    </Modal>
  );
};

export default SelectFormModal;
