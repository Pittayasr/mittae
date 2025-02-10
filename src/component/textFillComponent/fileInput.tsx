import React, { useState, useEffect, useRef } from "react";
import { Form, Modal, Button, Image } from "react-bootstrap";
import { Viewer } from "@react-pdf-viewer/core";
import "@react-pdf-viewer/core/lib/styles/index.css";

interface FileInputProps {
  label: string;
  accept: string;
  onFileSelect: (file: File | null) => void;
  isInvalid?: boolean;
  alertText?: string;
  initialFile?: File | null;
  reset?: boolean;
  required?: boolean;
}

const FileInput: React.FC<FileInputProps> = ({
  label,
  accept,
  onFileSelect,
  isInvalid,
  alertText,
  initialFile,
  reset,
  required,
}) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [fileName, setFileName] = useState<string>("ยังไม่ได้เลือกไฟล์");
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [fileType, setFileType] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  useEffect(() => {
    if (initialFile) {
      setFileName(initialFile.name);
      setPreviewUrl(URL.createObjectURL(initialFile));
      setFileType(initialFile.type);
    }
    if (reset) {
      resetFileState();
    }
  }, [initialFile, reset]);

  // ล้างค่าไฟล์
  const resetFileState = () => {
    setFileName("ยังไม่ได้เลือกไฟล์");
    setPreviewUrl(null);
    setFileType(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
    onFileSelect(null);
  };

  // Handle file selection
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const maxSizeMB = 5; // กำหนดขนาดไฟล์สูงสุด 5 MB
      const sizeInMB = file.size / (1024 * 1024);
      if (sizeInMB > maxSizeMB) {
        alert(`ขนาดไฟล์ต้องไม่เกิน ${maxSizeMB} MB`);
        return;
      }

      setFileName(file.name);
      setPreviewUrl(URL.createObjectURL(file));
      setFileType(file.type);
      onFileSelect(file);
    } else {
      setFileName("ยังไม่ได้เลือกไฟล์");
      setPreviewUrl(null);
      setFileType(null);
      onFileSelect(null);
    }
  };

  const handleClick = () => {
    if (previewUrl) {
      resetFileState();
    } else {
      fileInputRef.current?.click();
    }
  };

  const handleOpenModal = () => setIsModalOpen(true);

  return (
    <>
      <Form.Group>
        {/* Label */}
        <div className="responsive-label d-flex justify-content-between align-items-center">
          <Form.Label>
            {label}{" "}
            {required && (
              <span
                style={{ color: "red", cursor: "help" }}
                title="จำเป็นต้องกรอกข้อมูล"
              >
                *
              </span>
            )}
          </Form.Label>
          {previewUrl && (
            <Button
              variant="link"
              className="responsive-label text-success px-0 py-0 mb-2"
              onClick={handleOpenModal}
            >
              ดูไฟล์ที่เลือก
            </Button>
          )}
        </div>
        {/* Custom File Input */}
        <div
          className={`custom-file-input responsive-label ${
            isInvalid ? "is-invalid" : ""
          }`}
          style={{
            display: "flex",
            alignItems: "center",
            // cursor: "pointer",
            border: "1px solid #ced4da",
            borderRadius: "5px",
            padding: "5px",
          }}
        >
          <Button
            variant="outline-success"
            className="me-2"
            size="sm"
            onClick={handleClick}
          >
            {previewUrl ? "แก้ไข" : "เลือกไฟล์"}
          </Button>
          <span className="custom-file-name">{fileName}</span>
        </div>

        {/* Hidden File Input */}
        <input
          className="responsive-label"
          type="file"
          accept={accept}
          ref={fileInputRef}
          onChange={handleFileChange}
          style={{ display: "none" }}
        />

        {/* Feedback for validation */}
        {isInvalid && alertText && (
          <div style={{ color: "red", fontSize: "14px", marginTop: "5px" }}>
            {alertText}
          </div>
        )}
      </Form.Group>

      {/* Modal for File Preview */}
      <Modal show={isModalOpen} onHide={() => setIsModalOpen(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>ตัวอย่างไฟล์ที่เลือก</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {fileType === "application/pdf" ? (
            <div style={{ height: "500px" }}>
              <Viewer fileUrl={previewUrl || ""} />
            </div>
          ) : fileType?.startsWith("image/") ? (
            <Image src={previewUrl || ""} alt="Preview" fluid />
          ) : (
            <p>ไม่สามารถแสดงตัวอย่างไฟล์ได้</p>
          )}
        </Modal.Body>
      </Modal>
    </>
  );
};

export default FileInput;
