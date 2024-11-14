import React, { useState } from "react";
import { Form, Button } from "react-bootstrap";

interface FileInputProps {
  onFileSelect: (file: File) => void;
}

const FileInput: React.FC<FileInputProps> = ({ onFileSelect }) => {
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [selectedFileName, setSelectedFileName] = useState<string>("");

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.type === "application/pdf") {
        setErrorMessage("");
        setSelectedFileName(file.name); // แสดงชื่อไฟล์ที่เลือก
        onFileSelect(file); // ส่งไฟล์ PDF ไปยัง Print.tsx
      } else {
        setErrorMessage("กรุณาอัปโหลดเฉพาะไฟล์ PDF");
        setSelectedFileName("ยังไม่ได้เลือกไฟล์"); // รีเซ็ตชื่อไฟล์
      }
    }
  };

  return (
    <Form.Group>
      <Form.Label>อัปโหลดไฟล์ (เป็นไฟล์ .pdf เท่านั้น)</Form.Label>

      {/* ปุ่มและข้อความแสดงชื่อไฟล์ */}
      <div className="d-flex align-items-center">
        <Form.Control
          type="file"
          accept=".pdf"
          onChange={handleFileChange}
          style={{ display: "none" }} // ซ่อน input file
          id="hiddenFileInput"
        />
        {/* แสดงชื่อไฟล์ในกรอบ Form.Control */}
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
        />
      </div>

      {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
    </Form.Group>
  );
};

export default FileInput;
