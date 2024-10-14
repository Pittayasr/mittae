import React from "react";
import Select from "react-select";

interface TextSelectProps {
  label: string;
  id: string;
  options: string[];
  required?: boolean;
}

const TextSelect: React.FC<TextSelectProps> = ({
  label,
  id,
  options,
  required,
}) => {
  // แปลง array ของ options ให้เป็นรูปแบบที่ react-select
  const selectOptions = options.map((option) => ({
    value: option,
    label: option,
  }));

  return (
    <div className="mb-3">
      <label htmlFor={id} className="form-label">
        {label}
      </label>
      <Select
        id={id}
        options={selectOptions}
        isSearchable
        placeholder="เลือก..."
        isClearable
        required={required}
      />
    </div>
  );
};

export default TextSelect;
