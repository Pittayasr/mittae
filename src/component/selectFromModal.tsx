import React from "react";
import { Modal, Card, Col, Row } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import liff from "@line/liff";

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
    if (liff.isInClient()) {
      console.log(`🔹 เปิดภายในแอป LINE: ${path}`);
      liff.openWindow({
        url: `https://liff.line.me/2006837252-d37PQvNy${path}`,
        external: false,
      });
    } else {
      console.log(`เปิดใน Web Browser: ${path}`);
      navigate(path);
    }
    onClose();
  };

  const LINE_LIFF_ID = import.meta.env.VITE_LINE_LIFF_ID;

  const handleChatClick = async () => {
    try {
      if (!LINE_LIFF_ID) {
        console.error("ไม่มีค่า LINE_LIFF_ID, กรุณาตรวจสอบ .env");
        return;
      }

      // เริ่มต้น LIFF app (ควรเรียก init เสมอก่อนใช้งาน API)
      await liff.init({ liffId: LINE_LIFF_ID });

      // ตรวจสอบว่าผู้ใช้ล็อกอินแล้วหรือไม่
      if (!liff.isLoggedIn()) {
        liff.login();
        return; // หลังจาก login ให้รันใหม่อีกครั้ง
      }

      let friendStatus;
      try {
        // ลองเรียกใช้งาน getFriendship
        friendStatus = await liff.getFriendship();
      } catch (err) {
        console.warn(
          "ไม่สามารถตรวจสอบสถานะเพื่อนได้ เนื่องจากยังไม่มีการลิงค์ login bot หรือเกิดปัญหาอื่น ๆ",
          err
        );
        // กำหนด friendStatus ให้เป็น false ในกรณี error เพื่อให้ไปที่เงื่อนไข 'ยังไม่ได้เป็นเพื่อน'
        friendStatus = { friendFlag: false };
      }

      if (friendStatus.friendFlag) {
        console.log("✅ ผู้ใช้เป็นเพื่อนแล้ว, เปิดแชท...");
        await liff.sendMessages([
          { type: "text", text: "ต้องการสอบถามข้อมูลเพิ่มเติม" },
        ]);
        liff.openWindow({
          url: "https://line.me/R/ti/p/%40057pqgjw",
          external: false,
        });
      } else if (!liff.isInClient()) {
        alert("โปรดเปิดลิงก์นี้ในแอป LINE เพื่อใช้งานฟีเจอร์นี้");
        window.open("https://lin.ee/fvuORcS", "_blank");
        return;
      } else {
        console.log("ผู้ใช้ยังไม่ได้เป็นเพื่อน, เปิดลิงก์เพิ่มเพื่อน...");
        liff.openWindow({
          url: "https://lin.ee/fvuORcS",
          external: true,
        });
      }
    } catch (error) {
      console.error("Error handling chat:", error);
    }
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
      <Modal.Body
        className="text-center"
        style={{ maxHeight: "85vh", overflowY: "auto" }}
      >
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
              onClick={handleChatClick}
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
