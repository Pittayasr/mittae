//selelctAdminFormModal.tsx
import React from "react";
import { Modal, Button, Col, Row } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import useAuth from "../useAuth";

interface SelectAdminFormModalProps {
  isVisible: boolean;
  onClose: () => void;
  onNavigateToFormAdmin: () => void;
  onNavigateToPrintAdmin: () => void;
  onNavigateToDeliveryAdmin: () => void;
  onNavigateToInsuranceAdmin: () => void;
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

  const handleNavigateToDeliveryAdmin = () => {
    navigate("/delivery_admin_2[sru)x3X[SD");
    onClose();
  };

  const handleNavigateToInsuranceAdmin = () => {
    navigate("/insurance_admin_yKLwO~{WoOL(");
    onClose();
  };

  const { logout } = useAuth();

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
        <Modal.Title>
          <h3>บริการสำหรับผู้ดูแลระบบ</h3>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className="text-center">
        <Row>
          <Col className="mb-2" xs={12}>
            <Button
              variant="success"
              className="mt-3 mb-3 w-75"
              onClick={handleNavigateToFormAdmin}
            >
              แดชบอร์ดแอดมินพรบ. ต่อภาษีรถ
            </Button>
          </Col>

          <Col className="mb-2" xs={12}>
            <Button
              variant="success"
              className="mb-3 w-75"
              onClick={handleNavigateToPrintAdmin}
            >
              แดชบอร์ดแอดมินปริ้นเอกสาร
            </Button>
          </Col>
          <Col className="mb-2" xs={12}>
            <Button
              variant="success"
              className="mb-3 w-75"
              onClick={handleNavigateToDeliveryAdmin}
            >
              แดชบอร์ดแอดมินส่งรถส่งของกลับบ้าน แฟลชและไปรษณีย์
            </Button>
          </Col>
          <Col className="mb-2" xs={12}>
            <Button
              variant="success"
              className="mb-3 w-75"
              onClick={handleNavigateToInsuranceAdmin}
            >
              แดชบอร์ดแอดมินประกันภัย ป1 ป2 ป3 ป4 ป5
            </Button>
          </Col>
        </Row>
      </Modal.Body>
      <Button
        variant="outline-danger"
        className="mx-auto w-50 mt-0"
        onClick={() => {
          if (window.confirm("คุณต้องการออกจากระบบหรือไม่?")) {
            logout();
          }
        }}
      >
        ออกจากระบบ
      </Button>
      ;
    </Modal>
  );
};

export default SelectAdminFormModal;
