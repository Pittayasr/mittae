//dateInput.tsx
import React, { useState } from "react";
import { Modal, Form, Button } from "react-bootstrap";
import { ThaiDatePicker } from "thaidatepicker-react";
import ImageModal from "./Imagemodal";
import { IoCalendarClearOutline, IoCloseCircleSharp } from "react-icons/io5";
import dayjs, { Dayjs } from "dayjs";
import "dayjs/locale/th";

interface DateInputProps {
  onDateChange: (date: Dayjs | null) => void;
  value: Dayjs | null;
  isInvalid?: boolean;
  alertText?: string;
  required?: boolean;
  label: string;
  imgPath?: string | null;
}

const DateInput: React.FC<DateInputProps> = ({
  onDateChange,
  value,
  required,
  isInvalid = false,
  alertText,
  imgPath,
  label,
}) => {
  const [showModal, setShowModal] = useState(false);

  const handleDateChange = (selectedDate: string) => {
    if (selectedDate) {
      const parsedDate = dayjs(selectedDate, "YYYY-MM-DD"); // ใช้รูปแบบปี ค.ศ.
      onDateChange(parsedDate);
      // setShowModal(false);
    }
  };

  return (
    <Form.Group style={{ flexDirection: "column", position: "relative" }}>
      <div className="responsive-label d-flex justify-content-between align-items-center">
        <Form.Label>
          {label}{" "}
          {required && (
            <span
              style={{ color: "red", cursor: "help" }}
              title="จำเป็นต้องกรอกข้อมูล"
            >
              *
            </span>
          )}
        </Form.Label>
        {imgPath && <ImageModal imageUrl={imgPath} buttonText="รูปตัวอย่าง" />}
      </div>
      <div
        className="d-flex align-items-center "
        onClick={() => setShowModal(true)}
        style={{
          width: "100%",
          padding: "7px 12px",
          borderColor: isInvalid ? "red" : "#d9d9d9",
          borderRadius: "8px",
          fontFamily: "Noto Sans Thai, sans-serif",
          cursor: "pointer",
          backgroundColor: "#fff",
          borderWidth: "1px",
          borderStyle: "solid",
          outline: "none",
          textAlign: "left",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <span className="responsive-label">
          <IoCalendarClearOutline
            size={24}
            style={{ padding: "0px 5px 3px 0px" }}
          />
          {value
            ? value.add(543, "year").format("D MMM  YYYY")
            : "วัน เดือน ปี พ.ศ."}
        </span>
        {value && (
          <IoCloseCircleSharp
            size={18}
            type="IoCloseCircleSharp "
            className="align-items-center "
            style={{
              background: "none",
              border: "none",
              marginRight: "0px",
              cursor: "pointer",
              padding: "0",
              opacity: "0.4",
            }}
            onClick={(e) => {
              e.stopPropagation();
              onDateChange(null);
            }}
          />
        )}
      </div>

      <Modal
        show={showModal}
        onHide={() => setShowModal(false)}
        centered
        className="dropdown-dateInput"
      >
        <Modal.Header closeButton>
          <Modal.Title>เลือก{label}</Modal.Title>
        </Modal.Header>
        <Modal.Body className="px-2">
          {imgPath && (
            <div className="text-center mb-3">
              <img
                src={imgPath}
                alt="Example"
                style={{
                  maxWidth: "280px",
                  borderRadius: "5px",
                  marginBottom: "15px",
                }}
              />
            </div>
          )}
          <div className="d-flex justify-content-center">
            <ThaiDatePicker
              value={value ? value.format("YYYY-MM-DD") : ""}
              onChange={handleDateChange}
              header={{
                prevButtonIcon: <span>&lt;</span>,
                nextButtonIcon: <span>&gt;</span>,
                prevButtonClassName: "custom-prev-btn",
                nextButtonClassName: "custom-next-btn",
                monthSelectClassName: "custom-month-btn px-1",
                yearSelectClassName: "custom-year-btn px-1 ",
              }}
              inputProps={{
                style: {
                  backgroundColor: "#f0fdf4",
                  border: "1px solid #28a745",
                  borderRadius: "8px",
                  padding: "5px",
                  maxWidth: "100%",
                  cursor: "pointer",
                  textAlign: "center",
                },
                readOnly: true,
                value: "",
              }}
              reactDatePickerProps={{
                inline: true,
              }}
              placeholder="เลือกวันที่"
              clearable={false}
            />
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            ปิด
          </Button>
        </Modal.Footer>
      </Modal>

      {isInvalid && (
        <p
          className="mb-0"
          style={{ color: "red", fontSize: "14px", marginTop: "5px" }}
        >
          {alertText}
        </p>
      )}
    </Form.Group>
  );
};

export default DateInput;
