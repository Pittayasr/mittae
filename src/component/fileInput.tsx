import React, { useState } from "react";
import { Form, Button } from "react-bootstrap";

interface FileInputProps {
  onFileSelect: (file: File) => void;
  alertText?: string;
}

const FileInput: React.FC<FileInputProps> = ({ onFileSelect }) => {
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [selectedFileName, setSelectedFileName] = useState<string>("");

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const validTypes = [
        "application/pdf",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "image/png",
        "image/jpeg",
      ];

      if (validTypes.includes(file.type)) {
        setErrorMessage(""); // เคลียร์ข้อความผิดพลาด
        setSelectedFileName(file.name); // ตั้งชื่อไฟล์ที่เลือก
        onFileSelect(file); // ส่งไฟล์ไปยังฟังก์ชันจัดการ
      } else {
        setErrorMessage("กรุณาอัปโหลดเฉพาะไฟล์ PDF, Word, PNG หรือ JPG");
        setSelectedFileName(""); // รีเซ็ตชื่อไฟล์
      }
    }
  };

  return (
    <Form.Group>
      <Form.Label>
        อัปโหลดไฟล์ (รองรับ .pdf, .doc, .docx, .png, .jpg)
      </Form.Label>

      {/* ปุ่มและข้อความแสดงชื่อไฟล์ */}
      <div className="d-flex align-items-center">
        <Form.Control
          type="file"
          accept=".pdf, .doc, .docx, .png, .jpg"
          onChange={handleFileChange}
          style={{ display: "none" }} // ซ่อน input file
          id="hiddenFileInput"
          isInvalid={!!errorMessage || !selectedFileName} // ตรวจสอบว่ามี error หรือไม่
        />
        <Button
          variant="outline-success"
          onClick={() => document.getElementById("hiddenFileInput")?.click()}
          style={{ minWidth: "85px" }}
        >
          เลือกไฟล์
        </Button>
        <Form.Control
          type="text"
          value={selectedFileName}
          readOnly
          placeholder="ยังไม่ได้เลือกไฟล์..."
          plaintext
          className="mx-2"
          isInvalid={!!errorMessage || !selectedFileName} // แสดงผลการผิดพลาด
        />
      </div>

      {/* แสดงข้อความผิดพลาด */}
      {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
    </Form.Group>
  );
};

export default FileInput;
