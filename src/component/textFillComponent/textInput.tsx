import React from "react";
import { Form } from "react-bootstrap";

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
  return (
    <Form.Group controlId={id}>
      <Form.Label>
        <p className="mb-0">{label}</p>
      </Form.Label>
      <Form.Control
        className={isInvalid ? "" : "custom-input"}
        type={type}
        required={required}
        value={value}
        disabled={disabled}
        placeholder={placeholder}
        onChange={onChange}
        isInvalid={isInvalid}
        inputMode={inputMode}
      />
      <Form.Control.Feedback type="invalid">{alertText}</Form.Control.Feedback>
    </Form.Group>
  );
};

export default TextInput;
