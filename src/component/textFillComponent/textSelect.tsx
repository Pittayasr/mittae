import React from "react";
import Select, { SingleValue, StylesConfig } from "react-select"; // นำเข้า StylesConfig สำหรับ react-select
import { Form } from "react-bootstrap";
import classNames from "classnames";

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
  control: (provided, state) => ({
    ...provided,
    padding: "0px 0px 0px 0px",

    borderRadius: "6px",
    borderColor: state.isFocused
      ? "#28a745"
      : state.selectProps.classNamePrefix?.includes("is-invalid")
      ? "#dc3545"
      : provided.borderColor,
    boxShadow: state.isFocused ? "0 0 0 0.2rem rgba(40, 167, 69, 0.25)" : "", // เงาเมื่อ Focus
  }),
  singleValue: (provided) => ({
    ...provided,
    padding: "0 2px",
    margin: "0 0px",
  }),
  option: (provided, state) => ({
    ...provided,
    backgroundColor: state.isSelected
      ? "#008000 !important" // สีเขียวเข้มเมื่อเลือก
      : state.isFocused
      ? "#d0f8ce !important" // สีเขียวอ่อนเมื่อ hover
      : "white",
    color: state.isSelected ? "white" : "black", // สีข้อความ
    padding: "10px",
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
      <Form.Label>
        <p className="mb-0">{label}</p>
      </Form.Label>
      <Select
        options={options}
        onChange={handleSelectChange}
        classNamePrefix="react-select"
        className={classNames("react-select-container responsive-label", {
          "is-invalid": isInvalid, // เพิ่ม class is-invalid เมื่อมี error
        })}
        placeholder={placeholder}
        isDisabled={isDisabled}
        isSearchable
        styles={customStyles}
        value={options.find((option) => String(option.value) === value) || null}
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
