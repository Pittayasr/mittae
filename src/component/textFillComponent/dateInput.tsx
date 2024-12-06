// dateInput.tsx
import React, { useState, useEffect } from "react";
import { DatePicker } from "antd";
import dayjs, { Dayjs } from "dayjs";
import "dayjs/locale/th";
import locale from "antd/es/date-picker/locale/th_TH";
import "antd/dist/reset.css";

interface DateInputProps {
  onDateChange: (date: Dayjs | null) => void;
  labelText: string;
  initialDate?: Dayjs;
  value?: Dayjs | null;
  isInvalid?: boolean;
  alertText?: string;
}

const DateInput: React.FC<DateInputProps> = ({
  onDateChange,
  labelText,
  value,
  isInvalid = false, // ตั้งค่าเริ่มต้นเป็น false
  alertText, // ข้อความแจ้งเตือนเริ่มต้น
}) => {
  // ฟังก์ชันแปลงเป็นปี พ.ศ.
  const convertToBuddhistYear = (date: Dayjs | null): Dayjs | null => {
    return date ? date.add(543, "year") : null; // เพิ่ม 543 ปี
  };

  // ฟังก์ชันแปลงเป็นปี ค.ศ.
  const convertToGregorianYear = (date: Dayjs | null): Dayjs | null => {
    return date ? date.subtract(543, "year") : null; // ลด 543 ปี
  };

  const [selectedDate, setSelectedDate] = useState<Dayjs | null>(null);

  useEffect(() => {
    // Update selectedDate when value prop changes
    if (value) {
      setSelectedDate(convertToBuddhistYear(value));
    } else {
      setSelectedDate(null); // Reset selectedDate when value is null
    }
  }, [value]);

  const handleDateChange = (date: Dayjs | null) => {
    const gregorianDate = convertToGregorianYear(date);
    setSelectedDate(date);
    onDateChange(gregorianDate);
  };

  return (
    <div style={{ flexDirection: "column" }}>
      <label
        htmlFor="date-picker"
        style={{
          marginBottom: "5px",
          fontSize: "16px",
        }}
      >
        {labelText}
      </label>
      <DatePicker
        id="date-picker"
        locale={locale}
        onChange={handleDateChange}
        format="D MMMM YYYY"
        placeholder="วัน เดือน ปี พ.ศ."
        value={selectedDate} // Use selectedDate for controlled input
        inputReadOnly={true}
        showToday={false}
        style={{
          width: "100%",
          padding: "10px",
          height: "45px",
          borderColor: isInvalid ? "red" : undefined,
        }}
        allowClear={false}
        defaultPickerValue={dayjs().add(543, "year")} // ค่าเริ่มต้นเป็นปี พ.ศ.
      />
      {isInvalid && (
        <p style={{ color: "red", fontSize: "14px", marginTop: "5px" }}>
          {alertText}
        </p>
      )}
    </div>
  );
};

export default DateInput;
