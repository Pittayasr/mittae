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

  return (
    <Form.Group controlId={id} className="position-relative">
      <Form.Label>
        <p className="mb-0">{label}</p>
      </Form.Label>
      <Form.Control
        ref={inputRef}
        className={isInvalid ? "" : "custom-input"}
        type={type}
        required={required}
        value={value}
        disabled={disabled}
        placeholder={placeholder}
        onChange={onChange}
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
        <Popover id={`${id}-popover`} >
          <Popover.Body className="responsive-label" style={{ padding: "10px" }}>{placeholder}</Popover.Body>
        </Popover>
      </Overlay>
      <Form.Control.Feedback type="invalid">{alertText}</Form.Control.Feedback>
    </Form.Group>
  );
};

export default TextInput;
