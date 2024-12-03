import React from "react";
import { Modal, Button, Col, Row } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

interface SelectAdminFormModalProps {
  isVisible: boolean;
  onClose: () => void;
  onNavigateToFormAdmin: () => void;
  onNavigateToPrintAdmin: () => void;
}

const SelectAdminFormModal: React.FC<SelectAdminFormModalProps> = ({
  isVisible,
  onClose,
}) => {
  const navigate = useNavigate();

  const handleNavigateToFormAdmin = () => {
    navigate("/form_admin_hc{SlU(.'rhA");
    onClose();
  };

  const handleNavigateToPrintAdmin = () => {
    navigate("/print_admin_XTc}KPf]=Z@J");
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
        <Modal.Title>บริการสำหรับผู้ดูแลระบบ</Modal.Title>
      </Modal.Header>
      <Modal.Body className="text-center">
        <Row>
          <Col className="mb-2" xs={12}>
            <Button
              variant="success"
              className="mb-3 w-75"
              onClick={handleNavigateToFormAdmin}
            >
              ไปยังหน้าแดชบอร์ดแอดมินสำหรับฟอร์มพรบ.ต่อภาษีรถ
            </Button>
          </Col>

          <Col className="mb-2" xs={12}>
            <Button
              variant="success"
              className="w-75"
              onClick={handleNavigateToPrintAdmin}
            >
              ไปยังหน้าแดชบอร์ดแอดมินสำหรับปริ้นเอกสาร
            </Button>
          </Col>
        </Row>
      </Modal.Body>
    </Modal>
  );
};

export default SelectAdminFormModal;
