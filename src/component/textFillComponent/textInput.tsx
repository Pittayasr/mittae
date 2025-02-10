import React, { useState, useRef } from "react";
import { Form, Overlay, Popover } from "react-bootstrap";

interface TextInputProps {
  label: string;
  id: string;
  type?: string;
  placeholder?: string;
  alertText?: string;
  required?: boolean;
  value?: string;
  disabled?: boolean;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  isInvalid?: boolean;
  inputMode?:
    | "search"
    | "text"
    | "none"
    | "tel"
    | "url"
    | "email"
    | "numeric"
    | "decimal";
  isNumericWithComma?: boolean;
  isPhoneNumber?: boolean;
}

const TextInput: React.FC<TextInputProps> = ({
  label,
  id,
  type = "text",
  placeholder = "text",
  alertText,
  required,
  disabled = false,
  value,
  onChange,
  isInvalid,
  inputMode,
  isNumericWithComma = false,
  isPhoneNumber = false,
}) => {
  const [showPopover, setShowPopover] = useState(false);
  const [target, setTarget] = useState<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFocus = (event: React.FocusEvent<HTMLInputElement>) => {
    setTarget(event.target as HTMLDivElement);
    setShowPopover(true);
  };

  const handleBlur = () => {
    setShowPopover(false);
  };

  const formatNumberWithCommas = (value: string) => {
    const numericValue = value.replace(/[^\d]/g, "");
    if (!numericValue) return "";
    return new Intl.NumberFormat("en-US").format(Number(numericValue));
  };

  const formatPhoneNumber = (value: string) => {
    const numericValue = value.replace(/[^\d]/g, "");
    if (numericValue.length <= 3) return numericValue;
    if (numericValue.length <= 6)
      return `${numericValue.slice(0, 3)}-${numericValue.slice(3)}`;
    return `${numericValue.slice(0, 3)}-${numericValue.slice(
      3,
      6
    )}-${numericValue.slice(6, 20)}`;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let formattedValue = e.target.value;
    if (isNumericWithComma) {
      const rawValue = formattedValue.replace(/[^\d]/g, "");
      formattedValue = formatNumberWithCommas(rawValue);
      onChange?.({ ...e, target: { ...e.target, value: rawValue } });
    } else if (isPhoneNumber) {
      const rawValue = formattedValue.replace(/[^\d]/g, "");
      formattedValue = formatPhoneNumber(rawValue);
      onChange?.({ ...e, target: { ...e.target, value: formattedValue } });
    } else {
      onChange?.(e);
    }
    if (inputRef.current) {
      inputRef.current.value = formattedValue;
    }
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
      <Form.Control
        ref={inputRef}
        className={isInvalid ? "" : "custom-input"}
        type={type}
        required={required}
        value={
          isNumericWithComma
            ? formatNumberWithCommas(value || "")
            : isPhoneNumber
            ? formatPhoneNumber(value || "")
            : value
        }
        disabled={disabled}
        placeholder={placeholder}
        onChange={handleInputChange}
        isInvalid={isInvalid}
        inputMode={inputMode}
        onFocus={handleFocus}
        onBlur={handleBlur}
      />
      <Overlay
        show={showPopover}
        target={target}
        placement="top-end"
        containerPadding={10}
      >
        <Popover id={`${id}-popover`}>
          <Popover.Body
            className="responsive-label"
            style={{ padding: "10px" }}
          >
            {placeholder}
          </Popover.Body>
        </Popover>
      </Overlay>
      <Form.Control.Feedback type="invalid">{alertText}</Form.Control.Feedback>
    </Form.Group>
  );
};

export default TextInput;
