import React from "react";
import { Form } from "react-bootstrap";

interface TextGroupProps {
  label: string;
  id: string;
  type?: string;
  placeholder?: string;
  required?: boolean;
}

const TextGroup: React.FC<TextGroupProps> = ({
  label,
  id,
  type = "text",
  placeholder,
  required,
}) => {
  return (
    <Form.Group controlId={id}>
      <Form.Label>{label}</Form.Label>
      <Form.Control type={type} placeholder={placeholder} required={required} />
      <Form.Control.Feedback type="invalid">
        Please enter a valid {label.toLowerCase()}.
      </Form.Control.Feedback>
    </Form.Group>
  );
};

export default TextGroup;
