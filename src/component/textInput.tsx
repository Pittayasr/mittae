import React from "react";
import { Form } from "react-bootstrap";

interface TextInputProps {
  label: string;
  id: string;
  type?: string;
  placeholder?: string;
  alertText?: string;
  required?: boolean;
  value?: string ;
  disabled?: boolean;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  isInvalid?: boolean; // เพิ่ม props สำหรับ isInvalid
}

const TextInput: React.FC<TextInputProps> = ({
  label,
  id,
  type = "text",
  placeholder = "text",
  alertText,
  required,
  disabled = false,
  value,
  onChange,
  isInvalid, // รับค่า isInvalid
}) => {
  return (
    <Form.Group controlId={id}>
      <Form.Label>{label}</Form.Label>
      <Form.Control
        type={type}
        required={required}
        value={value }
        disabled={disabled}
        placeholder={placeholder}
        onChange={onChange}
        isInvalid={isInvalid} // กำหนด isInvalid ให้กับ input
      />
      <Form.Control.Feedback type="invalid">
        {alertText}
      </Form.Control.Feedback>
    </Form.Group>
  );
};

export default TextInput;
