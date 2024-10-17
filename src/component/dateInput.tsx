import React, { useState, useEffect } from "react";
import { DatePicker } from "antd";
import dayjs, { Dayjs } from "dayjs";
import "dayjs/locale/th";
import locale from "antd/es/date-picker/locale/th_TH";
import "antd/dist/reset.css";

interface DateInputProps {
  onDateChange: (date: Dayjs | null) => void;
  labelText: string; // เพิ่ม props สำหรับ labelText
  initialDate?: Dayjs; // เพิ่ม prop สำหรับวันที่เริ่มต้น
}

const DateInput: React.FC<DateInputProps> = ({
  onDateChange,
  labelText,
  initialDate,
}) => {
  const [selectedDate, setSelectedDate] = useState<Dayjs | null>(
    initialDate || dayjs().year(2567)
  ); // ใช้ initialDate หากมี ไม่เช่นนั้นใช้ปี 2567

  useEffect(() => {
    // เมื่อ initialDate เปลี่ยนแปลง ให้ปรับ selectedDate
    if (initialDate) {
      setSelectedDate(initialDate);
    }
  }, [initialDate]);

  const handleDateChange = (date: Dayjs | null) => {
    setSelectedDate(date);
    onDateChange(date);
  };

  return (
    <div style={{ flexDirection: "column" }}>
      <label
        htmlFor="date-picker"
        style={{
          marginBottom: "8px",
          fontSize: "16px", // ปรับขนาดของข้อความ
        }}
      >
        {labelText} {/* ใช้ labelText ที่ส่งผ่าน props */}
      </label>
      <DatePicker
        id="date-picker"
        locale={locale}
        onChange={handleDateChange}
        format="DD/MM/YYYY" // ตั้งค่าการแสดงผลเป็นแบบไทย
        placeholder="วัน/เดือน/ปี พ.ศ."
        value={selectedDate ? dayjs(selectedDate) : null}
        inputReadOnly={true}
        showToday = {false}
        style={{
          width: "100%", // ปรับขนาดความกว้างของ input
          padding: "10px", // เพิ่มช่องว่างภายใน
          height: "45px",
        }}
        allowClear={false}
      />
      {/* ปุ่ม "วันนี้" */}
    </div>
  );
};

export default DateInput;
