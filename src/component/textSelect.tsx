import React from "react";
import Select from "react-select"; // นำเข้า react-select
import { Form } from "react-bootstrap"; // นำเข้า react-bootstrap สำหรับ label และ layout

interface TextSelectProps {
  label: string;
  id: string;
  options: string[];
  onChange: (value: string | null) => void;
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
  const selectOptions = options.map((option) => ({
    label: option, // ข้อความที่แสดงใน dropdown
    value: option, // ค่า value ที่ส่งออก
  }));

  const handleSelectChange = (selectedOption: any) => {
    const value = selectedOption ? selectedOption.value : null;
    onChange(value);
  };

  return (
    <Form.Group>
      <Form.Label>{label}</Form.Label>
      <Select
        id={id}
        options={selectOptions} // ใช้ตัวเลือกจาก options
        onChange={handleSelectChange}
        isClearable // เพิ่มปุ่มกากบาทเพื่อยกเลิกการเลือก
        classNamePrefix="react-select"
        placeholder="ค้นหา..." // ข้อความตัวอย่างในช่อง
        isSearchable // เพิ่มฟังก์ชันค้นหา
      />
      {isInvalid && (
        <Form.Control.Feedback type="invalid">
          กรุณาเลือกตัวเลือก
        </Form.Control.Feedback>
      )}
    </Form.Group>
  );
};

export default TextSelect;
