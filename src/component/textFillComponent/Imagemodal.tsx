import React, { useState } from "react";
import { Button, Modal } from "react-bootstrap";

interface ImageModalProps {
  imageUrl: string; // Prop สำหรับ URL รูปภาพ
  buttonText?: string; // Prop สำหรับข้อความในปุ่ม
}

const ImageModal: React.FC<ImageModalProps> = ({
  imageUrl,
  buttonText = "ดูรูปตัวอย่าง", // ค่าเริ่มต้นสำหรับข้อความในปุ่ม
}) => {
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  return (
    <>
      {/* ลิงก์หรือข้อความที่ผู้ใช้คลิกเพื่อดูรูป */}
      <Button
        variant="button"
        onClick={handleShow}
        aria-label={buttonText}
        style={{
          padding: "0px",
          paddingBottom: "0px",
          color: "green",
          textDecoration: "underline",
        }}
      >
        {buttonText}
      </Button>

      {/* โมดัลที่จะแสดงภาพ */}
      <Modal show={show} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>รูปตัวอย่าง</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <img
            src={imageUrl} // ใช้ prop imageUrl
            alt="ตัวอย่าง"
            className="img-fluid"
          />
        </Modal.Body>
      </Modal>
    </>
  );
};

export default ImageModal;
