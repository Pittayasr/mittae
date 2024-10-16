import React, { useState } from "react";
import { DatePicker } from "antd";
import dayjs, { Dayjs } from "dayjs";
import "dayjs/locale/th";
import locale from "antd/es/date-picker/locale/th_TH";
import "antd/dist/reset.css";

const DateInput: React.FC<{
  onDateChange: (date: Dayjs | null) => void;
  labelText: string; // เพิ่ม props สำหรับ labelText
}> = ({ onDateChange, labelText }) => {
  const [selectedDate, setSelectedDate] = useState<Dayjs | null>(
    dayjs().year(2567)
  ); // เริ่มต้นที่ปี 2567

  const handleDateChange = (date: Dayjs | null) => {
    setSelectedDate(date);
    onDateChange(date);
  };

  return (
    <div style={{ flexDirection: "column" }}>
      <label
        htmlFor="date-picker"
        style={{
          
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
        inputReadOnly
        style={{
          width: "100%", // ปรับขนาดความกว้างของ input
          padding: "10px", // เพิ่มช่องว่างภายใน
          height: "45px",
        }}
        allowClear
      />
    </div>
  );
};

export default DateInput;
