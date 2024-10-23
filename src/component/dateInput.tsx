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
}

const DateInput: React.FC<DateInputProps> = ({
  onDateChange,
  labelText,
  initialDate,
  value, 
}) => {
  const convertToBuddhistYear = (date: Dayjs | null) => {
    return date ? dayjs(date).year(date.year() + 543) : null;
  };

  const convertToGregorianYear = (date: Dayjs | null) => {
    return date ? dayjs(date).year(date.year() - 543) : null;
  };

  const nextYearBuddhist = dayjs().year() + 543;

  const [selectedDate, setSelectedDate] = useState<Dayjs | null>(
    initialDate ? convertToBuddhistYear(initialDate) : null
  );

  useEffect(() => {
    if (initialDate) {
      setSelectedDate(convertToBuddhistYear(initialDate));
    }
  }, [initialDate]);

  useEffect(() => {
    // Update selectedDate when value prop changes
    if (value) {
      setSelectedDate(convertToBuddhistYear(value));
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
        format="DD/MM/YYYY"
        placeholder="วัน/เดือน/ปี พ.ศ."
        value={selectedDate} // Use selectedDate for controlled input
        inputReadOnly={true}
        showToday={false}
        style={{
          width: "100%",
          padding: "10px",
          height: "45px",
        }}
        allowClear={false}
        defaultPickerValue={dayjs().year(nextYearBuddhist)}
      />
    </div>
  );
};

export default DateInput;
