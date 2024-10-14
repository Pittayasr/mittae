import React from "react";
import { Form } from "react-bootstrap";

interface TextInputProps {
  label: string;
  id: string;
  type?: string;
  required?: boolean;
  validated?: boolean; // เพิ่ม prop สำหรับ validated
}

const TextInput: React.FC<TextInputProps> = ({
  label,
  id,
  type = "text",
  required = false,
  validated = false, // กำหนดค่าเริ่มต้น
}) => {
  return (
    <Form.Group controlId={id}>
      <Form.Label>{label}</Form.Label>
      <Form.Control type={type} required={required} isInvalid={validated} />
      <Form.Control.Feedback type="invalid">
        {validated ? "กรุณากรอกข้อมูล" : `กรุณากรอกข้อมูล`}
      </Form.Control.Feedback>
    </Form.Group>
  );
};

export default TextInput;
