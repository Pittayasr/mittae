//selelctAdminFormModal.tsx
import React from "react";
import { Modal, Button, Col, Row, Card } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import useAuth from "../useAuth";

interface SelectAdminFormModalProps {
  isVisible: boolean;
  onClose: () => void;
  onNavigateToFormAdmin: () => void;
  onNavigateToTransportAdmin: () => void;
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

  const handleNavigateToTransportAdmin = () => {
    navigate("/transport_admin_XTc}KPf]=Z@J");
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
          <h3 className="text-success">บริการสำหรับผู้ดูแลระบบ</h3>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body
        className="text-center"
        style={{ maxHeight: "85vh", overflowY: "auto" }}
      >
        <Row className="g-3">
          

          {/* แดชบอร์ดส่งไปรษณีย์ */}
          <Col xs={6} sm={4} md={4} lg={4}>
            <Card
              className="text-center compact-card-menu-form"
              onClick={() => handleNavigateToDeliveryAdmin()}
              style={{ cursor: "pointer" }}
            >
              <Card.Img
                variant="top"
                src="/data/menu/flash&ไปรษณีย์ไทย.png"
                alt="Print Admin"
                className="menu-image-form"
              />
              <Card.Body className="pb-0 px-0">
                <Card.Title className="compact-card-menu-form">
                  <p className="responsive-label-menu-form m-0">
                    แดชบอร์ดแอดมิน
                    <br />
                    ไปรษณีย์ไทย
                  </p>
                </Card.Title>
              </Card.Body>
            </Card>
          </Col>

          {/* แดชบอร์ดแอดมินพรบ. ต่อภาษีรถ */}
          <Col xs={6} sm={4} md={4} lg={4}>
            <Card
              className="text-center compact-card-menu-form"
              onClick={() => handleNavigateToFormAdmin()}
              style={{ cursor: "pointer" }}
            >
              <Card.Img
                variant="top"
                src="/data/menu/prb.png" 
                className="menu-image-form"
              />
              <Card.Body className="pb-0 px-0">
                <Card.Title className="compact-card-menu-form">
                  <p className="responsive-label-menu-form m-0">
                    แดชบอร์ดแอดมิน
                    <br />
                    พรบ. ต่อภาษีรถ
                  </p>
                </Card.Title>
              </Card.Body>
            </Card>
          </Col>

          {/* แดชบอร์ดแอดมินส่งรถส่งของกลับบ้าน */}
          <Col xs={6} sm={4} md={4} lg={4}>
            <Card
              className="text-center compact-card-menu-form"
              onClick={() => handleNavigateToTransportAdmin()}
              style={{ cursor: "pointer" }}
            >
              <Card.Img
                variant="top"
                src="/data/menu/delivery.png" 
                alt="Delivery Admin"
                className="menu-image-form"
              />
              <Card.Body className="pb-0 px-0">
                <Card.Title className="compact-card-menu-form">
                  <p className="responsive-label-menu-form m-0">
                    แดชบอร์ดแอดมิน
                    <br />
                    ส่งรถส่งของกลับบ้าน
                  </p>
                </Card.Title>
              </Card.Body>
            </Card>
          </Col>

          {/* แดชบอร์ดแอดมินประกันภัย */}
          <Col xs={6} sm={4} md={4} lg={4}>
            <Card
              className="text-center compact-card-menu-form"
              onClick={() => handleNavigateToInsuranceAdmin()}
              style={{ cursor: "pointer" }}
            >
              <Card.Img
                variant="top"
                src="/data/menu/insurance.png" // รูปไอคอนสำหรับประกันภัย
                alt="Insurance Admin"
                className="menu-image-form"
              />
              <Card.Body className="pb-0 px-0">
                <Card.Title className="compact-card-menu-form">
                  <p className="responsive-label-menu-form m-0">
                    แดชบอร์ดแอดมิน
                    <br />
                    ประกันภัย ป1-ป5
                  </p>
                </Card.Title>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Modal.Body>
      <Modal.Footer>
        <Row className="w-100 text-center">
          <Col xs={12}>
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
          </Col>
        </Row>
      </Modal.Footer>
    </Modal>
  );
};

export default SelectAdminFormModal;
