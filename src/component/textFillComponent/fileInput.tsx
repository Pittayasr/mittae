import React, { useState } from "react";
import { Form, Modal, Button, Image } from "react-bootstrap";
import { Viewer } from "@react-pdf-viewer/core";
import "@react-pdf-viewer/core/lib/styles/index.css";

interface FileInputProps {
  label: string;
  accept: string;
  onFileSelect: (file: File | null) => void;
  isInvalid?: boolean;
  alertText?: string;
}

const FileInput: React.FC<FileInputProps> = ({
  label,
  accept,
  onFileSelect,
  isInvalid,
  alertText,
}) => {
  const [, setErrorMessage] = useState<string>("");
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [fileType, setFileType] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const validTypes = ["application/pdf", "image/png", "image/jpeg"];

      if (validTypes.includes(file.type)) {
        setPreviewUrl(URL.createObjectURL(file)); // สร้าง URL ตัวอย่าง
        setFileType(file.type); // บันทึกประเภทไฟล์
        onFileSelect(file); // ส่งไฟล์ไปยังฟังก์ชันจัดการ
        setErrorMessage(""); // ล้างข้อความผิดพลาด
      } else {
        setPreviewUrl(null); // รีเซ็ต URL หากไฟล์ไม่ถูกต้อง
        setFileType(null); // รีเซ็ตประเภทไฟล์
        onFileSelect(null);
        setErrorMessage("กรุณาอัปโหลดเฉพาะไฟล์ที่ระบบรองรับเท่านั้น");
      }
    }
  };

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);

  return (
    <>
      <Form.Group>
        <div className="d-flex justify-content-between align-items-center">
          <Form.Label>{label}</Form.Label>
          {previewUrl && (
            <Button
              variant="link"
              className="text-success px-0 py-0 mb-2"
              onClick={handleOpenModal}
            >
              ดูไฟล์ที่เลือก{" "}
            </Button>
          )}
        </div>
        <div className="d-flex flex-column align-items-start">
          {/* แสดง input file */}
          <Form.Control
            type="file"
            accept={accept}
            onChange={handleFileChange}
            isInvalid={isInvalid}
          />
          <Form.Control.Feedback type="invalid">
            {alertText}
          </Form.Control.Feedback>
        </div>
      </Form.Group>

      {/* Modal สำหรับแสดงตัวอย่างรูป */}
      <Modal  show={isModalOpen} onHide={handleCloseModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>ตัวอย่างไฟล์ที่เลือก</Modal.Title>
        </Modal.Header>
        <Modal.Body style={{  padding: "10px" }}>
          {fileType === "application/pdf" ? (
            <div style={{ height: "500px" , padding: "0px" }}>
              <Viewer fileUrl={previewUrl || ""} />
            </div>
          ) : fileType?.startsWith("image/") ? (
            <Image src={previewUrl || ""} alt="Preview" fluid />
          ) : (
            <p>ไม่สามารถแสดงตัวอย่างไฟล์ได้</p>
          )}
        </Modal.Body>
        {/* <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            ปิด
          </Button>
        </Modal.Footer> */}
      </Modal>
    </>
  );
};

export default FileInput;
