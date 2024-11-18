import React from "react";
import Select, { SingleValue, StylesConfig } from "react-select"; // นำเข้า StylesConfig สำหรับ react-select
import { Form } from "react-bootstrap";

interface TextSelectProps {
  label: string;
  id: string;
  placeholder?: string;
  options: string[];
  value: string | null;
  onChange: (value: string | null) => void;
  required?: boolean;
  isInvalid?: boolean;
  alertText?: string;
  isDisabled?: boolean;
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
  alertText,
  isDisabled = false,
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
        placeholder={placeholder}
        isDisabled={isDisabled}
        isSearchable
        styles={customStyles}
        value={selectOptions.find((option) => option.value === value) || null}
        className={isInvalid ? "select-is-invalid" : "select-is-valid"}
      />
      {isInvalid && alertText && ( // แสดง alertText ถ้า isInvalid เป็น true
        <div style={{ color: "#dc3545", fontSize: "0.875em", marginTop: "0.25rem" }}>
        {alertText}
      </div>
      )}
    </Form.Group>
  );
};

export default TextSelect;
