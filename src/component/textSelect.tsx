import React from "react";
import Select, { SingleValue, StylesConfig } from "react-select"; // นำเข้า StylesConfig สำหรับ react-select
import { Form } from "react-bootstrap"; // นำเข้า react-bootstrap สำหรับ label และ layout

interface TextSelectProps {
  label: string;
  id: string;
  placeholder?: string;
  options: string[];
  value: string | null;
  onChange: (value: string | null) => void;
  required?: boolean;
  isInvalid?: boolean;
}

// กำหนดชนิดข้อมูลที่ถูกต้องให้กับ customStyles
const customStyles: StylesConfig<{ label: string; value: string }, false> = {
  indicatorSeparator: () => ({ display: "none" }),
  dropdownIndicator: (provided) => ({
    ...provided,
    padding: "2px 2px 2px 0px",
  }),
  singleValue: (provided) => ({
    ...provided,
    padding: "0 0px", // ปรับ padding ของข้อความที่เลือก
    margin: "0 0px", // ปรับ margin ของข้อความที่เลือก
  }),
};

const TextSelect: React.FC<TextSelectProps> = ({
  label,
  id,
  options,
  value,
  onChange,
  placeholder = "text",
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

  return (
    <Form.Group controlId={id}>
      <Form.Label>{label}</Form.Label>
      <Select
        options={selectOptions}
        onChange={handleSelectChange}
        classNamePrefix="react-select"
        placeholder={placeholder} // ข้อความก่อนกรอกข้อมูล
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
