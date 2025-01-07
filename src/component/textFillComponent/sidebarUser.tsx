import React, { useState } from "react";
import { Card, Col, Row, CloseButton } from "react-bootstrap";
import { FaBars } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const SidebarUser: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const handleToggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const handleNavigate = (path: string) => {
    navigate(path);
    setIsOpen(false); // ปิด Sidebar เมื่อเปลี่ยนหน้า
  };

  return (
    <div>
      
      {/* Sidebar */}
      <div className={`sidebar-container ${isOpen ? "open" : ""}`}>
        <div className="sidebar-header  mb-0 ">
          {isOpen ? (
            <div className="d-flex justify-content-between align-items-center">
              <p className="text-success mb-0" style={{ fontSize: "24px" }}>
                เมนู
              </p>
              <CloseButton
                onClick={() => setIsOpen(false)}
                className="d-flex align-item-center"
                style={{ cursor: "pointer", margin: "5px 0px 0px 0px" }}
              ></CloseButton>
            </div>
          ) : (
            <div
              className=" d-flex justify-content-end px-3 "
              onClick={handleToggleSidebar}
              style={{ cursor: "pointer" }}
            >
              <FaBars
                className="menu-icon-container d-flex justify-content-end "
                size={40}
              />
            </div>
          )}
        </div>
        <hr />
        <Row className="g-3 ">
          {/* Drop Off Flash + SPX + ไปรษณีย์ไทย */}
          <Col  sm={12}>
            <Card
              className=" text-center compact-card-menu"
              onClick={() => handleNavigate("/delivery")}
              style={{ cursor: "pointer" }}
            >
              <Card.Img
                variant="top"
                src="/data/menu/flash&ไปรษณีย์ไทย.png"
                alt="Delivery"
                className="menu-image"
              />
              {isOpen && (
                <Card.Body className=" px-0">
                  <Card.Title className="responsive-label-menu text-center">
                    <p className="px-1 m-0 sidebar-text">
                      Drop off
                      <br />
                      Flash + SPX
                      <br />
                      ไปรษณีย์ไทย
                    </p>
                  </Card.Title>
                </Card.Body>
              )}
            </Card>
          </Col>

          {/* พรบ. ต่อภาษีรถ */}
          <Col  sm={12}>
            <Card
              className="text-center compact-card-menu"
              onClick={() => handleNavigate("/form")}
              style={{ cursor: "pointer" }}
            >
              <Card.Img
                variant="top"
                src="/data/menu/prb.png"
                alt="Insurance"
                className="menu-image"
              />
              {isOpen && (
                <Card.Body className=" px-0">
                  <Card.Title className="responsive-label-menu  px-1 m-0">
                    พรบ. ต่อภาษีรถ
                  </Card.Title>
                </Card.Body>
              )}
            </Card>
          </Col>

          {/* ส่งของกลับบ้าน */}
          <Col  sm={12}>
            <Card
              className="text-center compact-card-menu"
              onClick={() => handleNavigate("/transport")}
              style={{ cursor: "pointer" }}
            >
              <Card.Img
                variant="top"
                src="/data/menu/delivery.png"
                alt="Transport"
                className="menu-image"
              />
              {isOpen && (
              <Card.Body className=" px-0">
                <Card.Title className="responsive-label-menu text-center">
                  <p className="px-1 m-0 ">
                    ส่งรถ ส่งของกลับบ้าน <br /> หมา แมว ฯลฯ
                  </p>
                </Card.Title>
              </Card.Body>
              )}
            </Card>
          </Col>

          {/* พิกัดร้าน */}
          <Col  sm={12}>
            <Card
              className="text-center compact-card-menu"
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
                className="menu-image"
              />
              {isOpen && (
              <Card.Body className=" px-1 m-0">
                <Card.Title className="responsive-label-menu">
                  พิกัดร้าน
                </Card.Title>
              </Card.Body>
              )}
            </Card>
          </Col>

          {/* ติดต่อแอดมิน */}
          <Col  sm={12}>
            <Card
              className="text-center compact-card-menu"
              onClick={() => handleNavigate("/print")}
              style={{ cursor: "pointer" }}
            >
              <Card.Img
                variant="top"
                src="/data/menu/live-chat.png"
                alt="Contact Admin"
                className="menu-image"
              />
              {isOpen && (
              <Card.Body className=" px-1 m-0">
                <Card.Title className="responsive-label-menu">
                  ติดต่อแอดมิน
                </Card.Title>
              </Card.Body>
              )}
            </Card>
          </Col>

          {/* ประกันภัย */}
          <Col  sm={12}>
            <Card
              className="text-center compact-card-menu"
              onClick={() => handleNavigate("/insurance")}
              style={{ cursor: "pointer" }}
            >
              <Card.Img
                variant="top"
                src="/data/menu/insurance.png"
                alt="Insurance"
                className="menu-image"
              />
              {isOpen && (
              <Card.Body className=" px-0">
                <Card.Title className="responsive-label-menu">
                  <p className="responsive-label-menu text-center px-1 m-0">
                    ประกันภัย
                    <br />
                    ป1 ถึง ป5
                  </p>
                </Card.Title>
              </Card.Body>
              )}
            </Card>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default SidebarUser;
