import React, { useState, useRef } from "react";
import Select, { SingleValue, StylesConfig } from "react-select";
import { Form, Overlay, Popover } from "react-bootstrap";
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

const customStyles: StylesConfig<OptionType, false> = {
  dropdownIndicator: (provided) => ({
    ...provided,
    padding: "2px 2px 2px 0px",
    zIndex: 3,
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
    boxShadow: state.isFocused ? "0 0 0 0.2rem rgba(40, 167, 69, 0.25)" : "",
  }),
  singleValue: (provided) => ({
    ...provided,
    padding: "0 2px",
    margin: "0 0px",
  }),
  option: (provided, state) => ({
    ...provided,
    backgroundColor: state.isSelected
      ? "#008000 !important"
      : state.isFocused
      ? "#d0f8ce !important"
      : "white",
    color: state.isSelected ? "white" : "black",
    padding: "10px",
    zIndex: "5",
  }),
  menuPortal: (provided) => ({
    ...provided,
    zIndex: 9999,
  }),
  menu: (provided) => ({
    ...provided,
    zIndex: 9999,
  }),
};

const TextSelect: React.FC<TextSelectProps> = ({
  label,
  id,
  options,
  value,
  required,
  onChange,
  placeholder = "Select an option",
  isInvalid,
  alertText,
  isDisabled = false,
}) => {
  const [showPopover, setShowPopover] = useState(false);
  const [target, setTarget] = useState<HTMLDivElement | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleFocus = () => {
    if (containerRef.current) {
      setTarget(containerRef.current);
      setShowPopover(true);
    }
  };

  const handleBlur = () => {
    setShowPopover(false);
  };

  const handleSelectChange = (
    selectedOption: SingleValue<{ label: string; value: string | number }>
  ) => {
    const selectedValue = selectedOption ? String(selectedOption.value) : null;
    onChange(selectedValue);
  };

  return (
    <Form.Group controlId={id} className="position-relative">
      <Form.Label>
        <p className="mb-0">
          {label}{" "}
          {required && (
            <span
              style={{ color: "red", cursor: "help" }}
              title="จำเป็นต้องกรอกข้อมูล"
            >
              *
            </span>
          )}
        </p>
      </Form.Label>
      <div
        onFocus={handleFocus}
        onBlur={handleBlur}
        ref={containerRef}
        className="position-relative"
      >
        <Select
          options={options}
          onChange={handleSelectChange}
          classNamePrefix="react-select"
          className={classNames("react-select-container responsive-label", {
            "is-invalid": isInvalid,
          })}
          placeholder={placeholder}
          isDisabled={isDisabled}
          // isSearchable
          styles={customStyles}
          value={
            options.find((option) => String(option.value) === value) || null
          }
          menuPortalTarget={document.body}
          noOptionsMessage={() => "ไม่มีตัวเลือกที่ตรงกับการค้นหา"}
        />
        <Overlay
          show={showPopover}
          target={target}
          placement="top-end"
          container={containerRef.current}
        >
          <Popover id={`${id}-popover`}>
            <Popover.Body
              className="responsive-label"
              style={{ padding: "10px" }}
            >
              พิมพ์เพื่อค้นหา
            </Popover.Body>
          </Popover>
        </Overlay>
      </div>
      {isInvalid && alertText && (
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
