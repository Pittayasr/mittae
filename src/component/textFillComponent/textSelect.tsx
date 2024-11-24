import React from "react";
import Select, { SingleValue, StylesConfig } from "react-select"; // นำเข้า StylesConfig สำหรับ react-select
import { Form } from "react-bootstrap";

interface OptionType {
  value: string | number;
  label: string;
}

interface TextSelectProps {
  label: string;
  id: string;
  placeholder?: string;
  options: OptionType[];
  value: string | null;
  onChange: (value: string | null) => void;
  required?: boolean;
  isInvalid?: boolean;
  alertText?: string;
  isDisabled?: boolean;
}

// กำหนดชนิดข้อมูลที่ถูกต้องให้กับ customStyles
const customStyles: StylesConfig<OptionType, false> = {
  indicatorSeparator: () => ({ display: "none" }),
  dropdownIndicator: (provided) => ({
    ...provided,
    padding: "2px 2px 2px 0px",
  }),
  singleValue: (provided) => ({
    ...provided,
    padding: "0 0px",
    margin: "0 0px",
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
  const handleSelectChange = (
    selectedOption: SingleValue<{ label: string; value: string | number }>
  ) => {
    const selectedValue = selectedOption ? String(selectedOption.value) : null; // แปลงเป็น string
    onChange(selectedValue);
  };

  return (
    <Form.Group controlId={id}>
      <Form.Label>{label}</Form.Label>
      <Select
        options={options}
        onChange={handleSelectChange}
        classNamePrefix="react-select"
        placeholder={placeholder}
        isDisabled={isDisabled}
        isSearchable
        styles={customStyles}
        value={
          options.find(
            (option) => String(option.value) === value // แปลง option.value เป็น string
          ) || null
        }
        className={isInvalid ? "select-is-invalid" : "select-is-valid"}
      />
      {isInvalid &&
        alertText && ( // แสดง alertText ถ้า isInvalid เป็น true
          <div
            style={{
              color: "#dc3545",
              fontSize: "0.875em",
              marginTop: "0.25rem",
            }}
          >
            {alertText}
          </div>
        )}
    </Form.Group>
  );
};

export default TextSelect;
