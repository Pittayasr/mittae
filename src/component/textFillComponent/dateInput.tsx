import React, { useState } from "react";
import { Dropdown, Form, Row, Col } from "react-bootstrap";
import Calendar, { CalendarProps } from "react-calendar";
import ImageModal from "./Imagemodal";
import "react-calendar/dist/Calendar.css";
import dayjs, { Dayjs } from "dayjs";
import "dayjs/locale/th";

interface DateInputProps {
  onDateChange: (date: Dayjs | null) => void;
  value: Dayjs | null;
  isInvalid?: boolean;
  alertText?: string;
  label: string;
  imgPath?: string | null; // Allow null or undefined
}

const DateInput: React.FC<DateInputProps> = ({
  onDateChange,
  value,
  isInvalid = false,
  alertText,
  imgPath,
  label,
}) => {
  const [showDropdown, setShowDropdown] = useState(false);

  const handleDateChange: CalendarProps["onChange"] = (value) => {
    if (value instanceof Date) {
      const dayjsDate = dayjs(value); // ไม่เพิ่ม 543 ปี
      onDateChange(dayjsDate);
      setShowDropdown(false);
    }
  };

  return (
    <Form.Group style={{ flexDirection: "column", position: "relative" }}>
      <div className="responsive-label d-flex justify-content-between align-items-center">
        <Form.Label>{label}</Form.Label>
        {imgPath && (
          <ImageModal imageUrl={imgPath} buttonText="ดูรูปตัวอย่าง" />
        )}
      </div>
      <Dropdown
        show={showDropdown}
        onToggle={(isOpen) => setShowDropdown(isOpen)}
      >
        <Dropdown.Toggle
          id="date-input"
          as="div"
          style={{
            width: "100%",
            padding: "7px 12px",
            borderColor: isInvalid ? "red" : "#d9d9d9",
            borderRadius: "8px",
            fontFamily: "Noto Sans Thai, sans-serif",
            cursor: "pointer",
            backgroundColor: "#fff",
            border: "1px solid #d9d9d9",
            outline: "none",
            textAlign: "left",
          }}
        >
          {value
            ? value.add(543, "year").format("D MMMM พ.ศ. YYYY")
            : "วัน เดือน ปี พ.ศ."}
        </Dropdown.Toggle>

        <Dropdown.Menu align="start" className="dropdown-dateInput">
          <Row>
            {imgPath && (
              <Col className="text-center p-0">
                <img
                  src={imgPath}
                  alt="Example"
                  style={{
                    maxWidth: "300px",
                    borderRadius: "5px",
                    marginBottom: "15px",
                  }}
                />
              </Col>
            )}
            <Col className="p-0">
              <Calendar
                onChange={handleDateChange}
                value={value ? value.toDate() : null} // ใช้ค่าปี ค.ศ. ภายใน Calendar
                locale="th-TH"
                calendarType="iso8601"
                className="calendar-content"
              />
            </Col>
          </Row>
        </Dropdown.Menu>
      </Dropdown>

      {isInvalid && (
        <p style={{ color: "red", fontSize: "14px", marginTop: "5px" }}>
          {alertText}
        </p>
      )}
    </Form.Group>
  );
};

export default DateInput;
