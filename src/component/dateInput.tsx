import React, { useState } from "react";
import { DatePicker } from "antd";
import dayjs, { Dayjs } from "dayjs";
import "dayjs/locale/th";
import locale from "antd/es/date-picker/locale/th_TH";
import "antd/dist/reset.css";

const DateInput: React.FC<{ onDateChange: (date: Dayjs | null) => void }> = ({
  onDateChange,
}) => {
  const [selectedDate, setSelectedDate] = useState<Dayjs | null>(
    dayjs().year(2567)
  ); // เริ่มต้นที่ปี 2567

  const handleDateChange = (date: Dayjs | null) => {
    setSelectedDate(date);
    onDateChange(date);
  };

  return (
    <DatePicker
      locale={locale}
      onChange={handleDateChange}
      format="DD/MM/YYYY" // ตั้งค่าการแสดงผลเป็นแบบไทย
      placeholder="เลือกวันที่"
      // ใช้ value ที่เป็นปี พ.ศ. ในการตั้งค่า
      value={selectedDate ? dayjs(selectedDate) : null}
      // แสดงวันที่ในรูปแบบ พ.ศ. แทนวันที่ปกติ
      renderExtraFooter={() => (
        <div>
          <span>ปี พ.ศ. {selectedDate ? selectedDate.year() : ""}</span>
        </div>
      )}
      inputReadOnly
      style={{ width: "50%" }}
      allowClear
    />
  );
};

export default DateInput;
