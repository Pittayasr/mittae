import React, { useEffect, useRef, useState } from "react";
import { Form } from "react-bootstrap";
import $ from "jquery"; // นำเข้า jQuery
import "bootstrap-datepicker/dist/css/bootstrap-datepicker.min.css";
import "bootstrap-datepicker"; // นำเข้า Bootstrap Datepicker

const DateInput: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<string>("");
  const dateInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // กำหนดค่าให้กับ datepicker
    if (dateInputRef.current) {
      $(dateInputRef.current)
        .datepicker({
          format: "dd/mm/yyyy",
          autoclose: true,
          language: "th", // ใช้ภาษาไทย
        })
        .on("changeDate", (e: any) => {
          const date = new Date(e.date);
          setSelectedDate(convertToThaiYear(date));
        });
    }

    // ทำความสะอาดเมื่อ component ถูก unmount
    return () => {
      if (dateInputRef.current) {
        $(dateInputRef.current).datepicker("destroy");
      }
    };
  }, []);

  // ฟังก์ชันแปลงวันที่ให้เป็นปี พ.ศ.
  const convertToThaiYear = (date: Date) => {
    const year = date.getFullYear() + 543; // แปลงเป็นปี พ.ศ.
    const day = date.getDate();
    const month = date.getMonth() + 1; // เดือนเริ่มนับจาก 0
    return `${day}/${month}/${year}`; // คืนค่าในรูปแบบ วัน/เดือน/ปี
  };

  return (
    <Form.Group controlId="formDate">
      <Form.Label>เลือกวันที่ (พ.ศ.)</Form.Label>
      <Form.Control
        type="text"
        placeholder="เลือกวันที่"
        ref={dateInputRef}
        value={selectedDate}
        readOnly // ทำให้ไม่สามารถพิมพ์ได้
      />
      {selectedDate && (
        <div className="mt-2">
          <p>วันที่เลือก: {selectedDate}</p>
        </div>
      )}
    </Form.Group>
  );
};

export default DateInput;
