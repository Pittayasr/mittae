import React, { useState } from "react";
import { DatePicker } from "antd";
import { Dayjs } from "dayjs";
import "dayjs/locale/th";
import locale from "antd/es/date-picker/locale/th_TH";
import "antd/dist/reset.css";

const DateInput: React.FC<{ onDateChange: (date: Dayjs | null) => void }> = ({
  onDateChange,
}) => {
  const [selectedDate, setSelectedDate] = useState<Dayjs | null>(null);

  const handleDateChange = (date: Dayjs | null) => {
    setSelectedDate(date);
    onDateChange(date);
  };

  // ฟังก์ชันสำหรับการแสดงวันที่ในรูปแบบ พ.ศ.
  const formatDateToThai = (date: Dayjs | null) => {
    if (!date) return "";
    const year = date.year() + 543; // คำนวณปี พ.ศ.
    return `${date.date()}/${date.month() + 1}/${year}`; // วันที่/เดือน/ปี
  };

  return (
    <DatePicker
      locale={locale}
      value={selectedDate}
      onChange={handleDateChange}
      format="DD/MM/YYYY" // ตั้งค่า format เป็นแบบไทย
      placeholder="เลือกวันที่"
      // แสดงวันที่ในรูปแบบ พ.ศ. แทนวันที่ปกติ
      renderExtraFooter={() => (
        <div>
          <span>ปี พ.ศ. {selectedDate ? selectedDate.year() + 543 : ""}</span>
        </div>
      )}
      // กำหนดการแสดงวันที่ใน input
      inputReadOnly
      style={{ width: "100%" }}
      allowClear
      // ใช้ formatter เพื่อให้แสดงวันที่ในรูปแบบที่ต้องการ
      formTarget={formatDateToThai(selectedDate)} // ปรับเปลี่ยนการแสดงผลใน input
    />
  );
};

export default DateInput;
