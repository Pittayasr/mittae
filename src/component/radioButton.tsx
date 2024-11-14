import React from "react";
import { Form } from "react-bootstrap";

interface RadioButtonProps {
  options: string[];
  name: string;
  label: string;
  selectedValue?: string | null;
  onChange: (value: string) => void;
  isInvalid?: boolean; // เพิ่ม prop สำหรับจัดการสถานะ validation
  alertText?: string; // เพิ่มข้อความแจ้งเตือน
}

const RadioButton: React.FC<RadioButtonProps> = ({
  options,
  name,
  label,
  selectedValue,
  onChange,
  isInvalid = false, // ค่าเริ่มต้นของ isInvalid
  alertText = "กรุณาเลือกตัวเลือก", // ข้อความเตือนเริ่มต้น
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
                margin: "0px 0px 0px 10px",
                width: "110%", // ปรับขนาดความกว้างของ input
                padding: "10px 0px 10px 0px", // เพิ่มช่องว่างภายใน
              }}
              isInvalid={isInvalid && !selectedValue}
            />
          );
        })}
        {!selectedValue && (
          <Form.Control.Feedback type="invalid">
            {alertText}
          </Form.Control.Feedback>
        )}
      </div>
    </Form.Group>
  );
};

export default RadioButton;
