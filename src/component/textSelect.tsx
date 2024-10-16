import React from "react";
import { Form } from "react-bootstrap";

interface TextSelectProps {
  label: string;
  id: string;
  options: string[];
  onChange: (value: string | null) => void; // เปลี่ยนเป็นรับค่า string หรือ null แทน
  required?: boolean;
  isValid?: boolean;
  isInvalid?: boolean;
}

const TextSelect: React.FC<TextSelectProps> = ({
  label,
  id,
  options,
  onChange,
  required,
  isValid,
  isInvalid,
}) => {
  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value === "" ? null : e.target.value;
    onChange(value);
  };

  return (
    <Form.Group>
      <Form.Label>{label}</Form.Label>
      <Form.Select
        id={id}
        onChange={handleSelectChange}
        required={required}
        isValid={isValid}
        isInvalid={isInvalid}
      >
        <option value="">เลือก...</option>
        {options.map((option, index) => (
          <option key={index} value={option}>
            {option}
          </option>
        ))}
      </Form.Select>
      <Form.Control.Feedback type="invalid">
        กรุณาเลือกตัวเลือก
      </Form.Control.Feedback>
    </Form.Group>
  );
};

export default TextSelect;
