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
}) => {
  return (
    <Form.Group>
      <Form.Label>{label}</Form.Label>
      <div className="radioButton">
        {/* ใช้ Flexbox เพื่อให้ radio buttons อยู่ในบรรทัดเดียวกัน */}
        {options.map((option, index) => {
          const id = `${name}-${index}`; // สร้าง id ที่ไม่ซ้ำกัน
          return (
            <Form.Check
              key={index}
              type="radio"
              id={id} // เพิ่ม id
              label={option}
              name={name}
              value={option}
              checked={selectedValue === option}
              onChange={() => onChange(option)} // ฟังก์ชันจัดการเมื่อมีการเลือก
              style={{
                width: "100%", // ปรับขนาดความกว้างของ input
                padding: "10px", // เพิ่มช่องว่างภายใน
              }}
            />
          );
        })}
      </div>
    </Form.Group>
  );
};

export default RadioButton;
