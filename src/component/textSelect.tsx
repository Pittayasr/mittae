import React from "react";
import Select, { SingleValue } from "react-select"; // เพิ่มชนิดข้อมูลสำหรับ react-select
import { Form } from "react-bootstrap"; // นำเข้า react-bootstrap สำหรับ label และ layout

interface TextSelectProps {
  label: string;
  id: string;
  options: string[];
  onChange: (value: string | null) => void;
  required?: boolean;
  isInvalid?: boolean;
}

const TextSelect: React.FC<TextSelectProps> = ({
  label,
  id,
  options,
  onChange,
  isInvalid,
}) => {
  // แปลง options ให้กลายเป็นรูปแบบที่ใช้งานกับ react-select
  const selectOptions = options.map((option) => ({
    label: option, // ข้อความที่แสดงใน dropdown
    value: option, // ค่า value ที่ส่งออก
  }));

  // กำหนดชนิดข้อมูลของ selectedOption
  const handleSelectChange = (
    selectedOption: SingleValue<{ label: string; value: string }>
  ) => {
    const value = selectedOption ? selectedOption.value : null;
    onChange(value);
  };

  // ปรับแต่งสไตล์เพื่อนำลูกศรออก
  const customStyles = {
    indicatorSeparator: () => ({ display: "none" }), // ซ่อนเส้นแบ่งระหว่างลูกศรและช่อง
    dropdownIndicator: () => ({ display: "none" }), // ซ่อนลูกศรลง
  };

  return (
    <Form.Group controlId={id}>
      <Form.Label>{label}</Form.Label>
      <Select
        options={selectOptions} // ใช้ตัวเลือกจาก options
        onChange={handleSelectChange}
        classNamePrefix="react-select"
        isClearable //กากบาท
        placeholder="ค้นหา..." // ข้อความตัวอย่างในช่อง
        isSearchable // เพิ่มฟังก์ชันค้นหา
        styles={customStyles} // ใช้ customStyles เพื่อนำลูกศรลงออก
      />
      {/* แสดงข้อความเมื่อมีข้อผิดพลาด */}
      {isInvalid && (
        <Form.Control.Feedback type="invalid">
          กรุณาเลือกตัวเลือก
        </Form.Control.Feedback>
      )}
    </Form.Group>
  );
};

export default TextSelect;
