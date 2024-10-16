import React from "react";
import { Form } from "react-bootstrap";

interface RadioButtonProps {
  options: string[];
  name: string;
  label: string;
  selectedValue?: string | null;
  onChange: (value: string) => void;
  isValid?: boolean; // เพิ่ม prop สำหรับการจัดการสถานะ validation
}

const RadioButton: React.FC<RadioButtonProps> = ({
  options,
  name,
  label,
  selectedValue,
  onChange,
  isValid = true, // ถ้าไม่มีการระบุ isValid ให้เป็น true ค่าเริ่มต้น
}) => {
  return (
    <Form.Group>
      <Form.Label>{label}</Form.Label>
      <div>
        {" "}
        {/* ใช้ Flexbox เพื่อให้ radio buttons อยู่ในบรรทัดเดียวกัน */}
        {options.map((option, index) => (
          <Form.Check
            key={index}
            type="radio"
            label={option}
            name={name}
            value={option}
            checked={selectedValue === option}
            onChange={() => onChange(option)} // ฟังก์ชันจัดการเมื่อมีการเลือก
            className="me-4" // เพิ่ม margin-right สำหรับ spacing
          />
        ))}
      </div>
      {!isValid && (
        <Form.Text className="text-danger">
          กรุณาเลือก {label.toLowerCase()}
        </Form.Text>
      )}
    </Form.Group>
  );
};

export default RadioButton;
