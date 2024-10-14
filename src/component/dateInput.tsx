import React, { useEffect, useRef, useState } from "react";
import { Form } from "react-bootstrap";
import $ from "jquery"; // นำเข้า jQuery
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-datepicker";

const DateInput: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<string>("");
  const dateInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (dateInputRef.current) {
      // กำหนดค่า locale สำหรับภาษาไทย
      $.fn.datepicker.dates["th"] = {
        days: ["อาทิตย์", "จันทร์", "อังคาร", "พุธ", "พฤหัส", "ศุกร์", "เสาร์"],
        daysShort: ["อา", "จ", "อ", "พ", "พฤ", "ศ", "ส"],
        daysMin: ["อา", "จ", "อ", "พ", "พฤ", "ศ", "ส"],
        months: [
          "มกราคม",
          "กุมภาพันธ์",
          "มีนาคม",
          "เมษายน",
          "พฤษภาคม",
          "มิถุนายน",
          "กรกฎาคม",
          "สิงหาคม",
          "กันยายน",
          "ตุลาคม",
          "พฤศจิกายน",
          "ธันวาคม",
        ],
        monthsShort: [
          "ม.ค.",
          "ก.พ.",
          "มี.ค.",
          "เม.ย.",
          "พ.ค.",
          "มิ.ย.",
          "ก.ค.",
          "ส.ค.",
          "ก.ย.",
          "ต.ค.",
          "พ.ย.",
          "ธ.ค.",
        ],
        today: "วันนี้",
      };

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

    return () => {
      if (dateInputRef.current) {
        $(dateInputRef.current).datepicker("destroy");
      }
    };
  }, []);

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
        readOnly
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
