// button.tsx
import React from "react";
import { Button as BootstrapButton } from "react-bootstrap";

interface ButtonProps {
  label: string;
  type?: "button" | "submit" | "reset";
  variant?: string;
  className?: string;
  disabled?: boolean; // เพิ่ม property disabled
}

const Button: React.FC<ButtonProps> = ({
  label,
  type = "submit",
  variant = "primary",
  className,
  disabled = false, // กำหนดค่าเริ่มต้นให้ disabled
}) => {
  return (
    <BootstrapButton
      variant={variant}
      type={type}
      className={className}
      disabled={disabled} // ส่งค่า disabled ไปยัง BootstrapButton
    >
      {label}
    </BootstrapButton>
  );
};

export default Button;
