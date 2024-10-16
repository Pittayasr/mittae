import React, { useState } from "react";
import { Button, Modal } from "react-bootstrap";

const ImageModal: React.FC = () => {
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  return (
    <>
      {/* ลิงก์หรือข้อความที่ผู้ใช้คลิกเพื่อดูรูป */}
      <Button variant="link" onClick={handleShow}>
        ดูรูปตัวอย่าง
      </Button>

      {/* โมดัลที่จะแสดงภาพ */}
      <Modal show={show} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>รูปตัวอย่าง</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <img
            src="/src/data/endDate.png" // URL รูปที่จะแสดง
            alt="ตัวอย่าง"
            className="img-fluid"
          />
        </Modal.Body>
      </Modal>
    </>
  );
};

export default ImageModal;
