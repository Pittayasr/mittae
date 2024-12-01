import React, { useState } from "react";
import { Form } from "react-bootstrap";

interface FileInputProps {
  onFileSelect: (file: File) => void;
  isInvalid?: boolean;
  alertText?: string;
}

const FileInput: React.FC<FileInputProps> = ({
  onFileSelect,
  isInvalid,
  alertText,
}) => {
  const [, setErrorMessage] = useState<string>("");
  // const [selectedFileName, setSelectedFileName] = useState<string>("");

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const validTypes = ["application/pdf", "image/png", "image/jpeg"];

      if (validTypes.includes(file.type)) {
        setErrorMessage(""); // ล้างข้อความผิดพลาด
        // setSelectedFileName(file.name); // ตั้งชื่อไฟล์ที่เลือก
        onFileSelect(file); // ส่งไฟล์ไปยังฟังก์ชันจัดการ
      } else {
        setErrorMessage("กรุณาอัปโหลดเฉพาะไฟล์ PDF, PNG หรือ JPG");
        // setSelectedFileName(""); // รีเซ็ตชื่อไฟล์
      }
    }
  };

  return (
    <Form.Group>
      <Form.Label>อัปโหลดไฟล์ (รองรับ .pdf, .png, .jpg)</Form.Label>
      <div className="d-flex flex-column align-items-start">
        {/* แสดง input file ที่ผู้ใช้สามารถคลิกได้โดยตรง */}
        <Form.Control
          type="file"
          accept=".pdf, .png, .jpg"
          onChange={handleFileChange}
          isInvalid={isInvalid} // แสดงข้อความผิดพลาดหากเกิดข้อผิดพลาด
        />
        <Form.Control.Feedback type="invalid">
          {alertText}
        </Form.Control.Feedback>
      </div>
    </Form.Group>
  );
};

export default FileInput;
