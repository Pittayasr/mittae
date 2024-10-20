// textSelect.tsx
import React from "react";
import Select, { SingleValue } from "react-select"; // เพิ่มชนิดข้อมูลสำหรับ react-select
import { Form } from "react-bootstrap"; // นำเข้า react-bootstrap สำหรับ label และ layout

interface TextSelectProps {
  label: string;
  id: string;
  options: string[];
  value: string | null;
  onChange: (value: string | null) => void;
  required?: boolean;
  isInvalid?: boolean;
}

const TextSelect: React.FC<TextSelectProps> = ({
  label,
  id,
  options,
  value,
  onChange,
  isInvalid,
}) => {
  // แปลง options ให้กลายเป็นรูปแบบที่ใช้งานกับ react-select
  const selectOptions = options.map((option) => ({
    label: option,
    value: option,
  }));

  const handleSelectChange = (
    selectedOption: SingleValue<{ label: string; value: string }>
  ) => {
    const selectedValue = selectedOption ? selectedOption.value : null;
    onChange(selectedValue);
  };

  const customStyles = {
    indicatorSeparator: () => ({ display: "none" }),
    dropdownIndicator: (provided: any) => ({
      ...provided,
      padding: "2px 2px 2px 0px",
    }),
    singleValue: (provided: any) => ({
      ...provided,
      padding: "0 0px", // ปรับ padding ของข้อความที่เลือก
      margin: "0 0px", // ปรับ margin ของข้อความที่เลือก
    }),
  };

  return (
    <Form.Group controlId={id}>
      <Form.Label>{label}</Form.Label>
      <Select
        options={selectOptions}
        onChange={handleSelectChange}
        classNamePrefix="react-select"
        placeholder="ค้นหา..."
        isSearchable
        styles={customStyles}
        value={selectOptions.find((option) => option.value === value) || null}
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
