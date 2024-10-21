import React from "react";
import { Form } from "react-bootstrap";

interface TextInputProps {
  label: string;
  id: string;
  type?: string;
  placeholder?: string;
  required?: boolean;
  value?: string; // เพิ่ม props สำหรับ value
  disabled?: boolean; // เพิ่ม props สำหรับ disabled
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void; // เพิ่ม props สำหรับ onChange
}

const TextInput: React.FC<TextInputProps> = ({
  label,
  id,
  type = "text",
  placeholder = "text",
  required,
  disabled = false,
  value, // รับค่า value
  onChange, // รับฟังก์ชัน onChange
}) => {
  return (
    <Form.Group controlId={id}>
      <Form.Label>{label}</Form.Label>
      <Form.Control
        type={type}
        required={required}
        value={value} // กำหนดค่า value ให้กับ input
        disabled={disabled} // เพิ่มการจัดการ disabled'
        placeholder={placeholder} // ข้อความก่อนกรอกข้อมูล
        onChange={onChange} // กำหนดฟังก์ชัน onChange ให้กับ input
      />
      <Form.Control.Feedback type="invalid">
        กรุณากรอกข้อมูล
      </Form.Control.Feedback>
    </Form.Group>
  );
};

export default TextInput;
