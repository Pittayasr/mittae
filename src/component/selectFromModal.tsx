import React from "react";
import { Modal, Card, Col, Row } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

interface SelectFormModalProps {
  isVisible: boolean;
  onClose: () => void;
}

const SelectFormModal: React.FC<SelectFormModalProps> = ({
  isVisible,
  onClose,
}) => {
  const navigate = useNavigate();

  const handleNavigate = (path: string) => {
    navigate(path);
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
        <Modal.Title>
          <h3 className="text-success">บริการของร้าน</h3>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className="text-center" style={{maxHeight: "85vh", overflowY: "auto"}}>
        <Row className="g-3">
          {/* ส่งไปรษณีย์ */}
          <Col xs={6} sm={4} md={4} lg={4}>
            <Card
              className="text-center compact-card-menu-form"
              onClick={() => handleNavigate("/delivery")}
              style={{ cursor: "pointer" }}
            >
              <Card.Img
                variant="top"
                src="/data/menu/flash&ไปรษณีย์ไทย.png"
                alt="Delivery"
                className="menu-image-form"
              />
              <Card.Body className="pb-0 px-0">
                <Card.Title className="compact-card-menu-form ">
                  <p className="responsive-label-menu-form m-0">
                    Drop off
                    <br />
                    Flash + SPX
                    <br />
                    ไปรษณีย์ไทย
                  </p>
                </Card.Title>
              </Card.Body>
            </Card>
          </Col>

          {/* พรบ. */}
          <Col xs={6} sm={4} md={4} lg={4}>
            <Card
              className="text-center compact-card-menu-form"
              onClick={() => handleNavigate("/form")}
              style={{ cursor: "pointer" }}
            >
              <Card.Img
                variant="top"
                src="/data/menu/prb.png" // Path รูปภาพใน public folder
                alt="Insurance"
                className="menu-image-form"
              />
              <Card.Body className="compact-card-menu-form pb-0 px-0">
                <Card.Title className=" responsive-label-menu-form">
                  พรบ. ต่อภาษีรถ
                </Card.Title>
              </Card.Body>
            </Card>
          </Col>

          {/* ส่งของกลับบ้าน */}
          <Col xs={6} sm={4} md={4} lg={4}>
            <Card
              className="text-center compact-card-menu-form"
              onClick={() => handleNavigate("/transport")}
              style={{ cursor: "pointer" }}
            >
              <Card.Img
                variant="top"
                src="/data/menu/delivery.png"
                alt="Print"
                className="menu-image-form"
              />
              <Card.Body className="pb-0 px-0">
                <Card.Title className="compact-card-menu-form ">
                  <p className="responsive-label-menu-form m-0">
                    ส่งรถส่งของกลับบ้าน
                    <br />
                    หมา แมว กระต่าย
                    <br />
                    ฯลฯ
                  </p>
                </Card.Title>
              </Card.Body>
            </Card>
          </Col>

          {/* พิกัดร้าน */}
          <Col xs={6} sm={4} md={4} lg={4}>
            <Card
              className="text-center compact-card-menu-form"
              onClick={() =>
                window.open(
                  "https://maps.app.goo.gl/RHAD9GLECXDasCfK6",
                  "_blank"
                )
              }
              style={{ cursor: "pointer" }}
            >
              <Card.Img
                variant="top"
                src="/data/menu/map.png"
                alt="Map"
                className="menu-image-form"
              />
              <Card.Body className="compact-card-menu-form pb-0 px-0">
                <Card.Title className=" responsive-label-menu-form">
                  พิกัดร้าน
                </Card.Title>
              </Card.Body>
            </Card>
          </Col>

          {/* ติดต่อแอดมิน */}
          <Col xs={6} sm={4} md={4} lg={4}>
            <Card
              className="text-center compact-card-menu-form"
              onClick={() => handleNavigate("/print")}
              style={{ cursor: "pointer" }}
            >
              <Card.Img
                variant="top"
                src="/data/menu/live-chat.png"
                alt="Print"
                className="menu-image-form"
              />
              <Card.Body className="compact-card-menu-form pb-0 px-0">
                <Card.Title className="responsive-label-menu-form">
                  ติดต่อแอดมิน
                </Card.Title>
              </Card.Body>
            </Card>
          </Col>

          {/* ประกัน */}
          <Col xs={6} sm={4} md={4} lg={4}>
            <Card
              className="text-center compact-card-menu-form"
              onClick={() => handleNavigate("/insurance")}
              style={{ cursor: "pointer" }}
            >
              <Card.Img
                variant="top"
                src="/data/menu/insurance.png"
                alt="Map"
                className="menu-image-form"
              />
              <Card.Body className="pb-0 px-0">
                <Card.Title className="compact-card-menu-form ">
                  <p className="responsive-label-menu-form m-0">
                    ประกันภัย
                    <br />
                    ป1 ป2 ป3 ป4 ป5
                  </p>
                </Card.Title>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Modal.Body>
    </Modal>
  );
};

export default SelectFormModal;
