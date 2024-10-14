import React from "react";
import { Button as BootstrapButton } from "react-bootstrap";

interface ButtonProps {
  label: string;
  type?: "button" | "submit" | "reset";
  variant?: string;
  className?: string;
}

const Button: React.FC<ButtonProps> = ({
  label,
  type = "submit",
  variant = "primary",
  className,
}) => {
  return (
    <BootstrapButton variant={variant} type={type} className={className}>
      {label}
    </BootstrapButton>
  );
};

export default Button;
