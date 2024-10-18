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
  const convertToBuddhistYear = (date: Dayjs | null) => {
    return date ? dayjs(date).year(date.year() + 543) : null; // แปลงปีให้เป็นพุทธศักราช
  };

  const convertToGregorianYear = (date: Dayjs | null) => {
    return date ? dayjs(date).year(date.year() - 543) : null; // แปลงกลับเป็นคริสต์ศักราช
  };

  // คำนวณปีหน้าเป็นปีพุทธศักราช (พ.ศ.)
  const nextYearBuddhist = dayjs().year() + 543;

  const [selectedDate, setSelectedDate] = useState<Dayjs | null>(
    initialDate ? convertToBuddhistYear(initialDate) : null // ตั้งค่าเริ่มต้นเป็นปี 2567
  );

  useEffect(() => {
    // เมื่อ initialDate เปลี่ยนแปลง ให้ปรับ selectedDate
    if (initialDate) {
      setSelectedDate(convertToBuddhistYear(initialDate));
    }
  }, [initialDate]);

  const handleDateChange = (date: Dayjs | null) => {
    const gregorianDate = convertToGregorianYear(date); // แปลงกลับเป็นคริสต์ศักราชสำหรับการเก็บในฐานข้อมูล
    setSelectedDate(date);
    onDateChange(gregorianDate); // ส่งค่ากลับไปในรูปแบบคริสต์ศักราช
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
        format="DD/MM/YYYY"
        placeholder="วัน/เดือน/ปี พ.ศ."
        value={selectedDate}
        inputReadOnly={true}
        showToday={false}
        style={{
          width: "100%",
          padding: "10px",
          height: "45px",
        }}
        allowClear={false}
        defaultPickerValue={dayjs().year(nextYearBuddhist)} // กำหนดให้เลือกปีเริ่มต้นเป็น พ.ศ. 2567
      />
    </div>
  );
};

export default DateInput;
