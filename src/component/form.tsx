import React, { useState } from "react";
import TextInput from "./textInput";
import TextSelect from "./textSelect";
import DateInput from "./dateInput"; // นำเข้า DateInput
import Button from "./Button";
import { Form, Row, Col } from "react-bootstrap";
import { Dayjs } from "dayjs";
import { provinces } from "../data/provinces"; // นำเข้า จังหวัด
import RadioButton from "./radioButton"; // นำเข้า RadioButton
import ImageModal from "./Imagemodal";

const FormComponent: React.FC = () => {
  const [validated, setValidated] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Dayjs | null>(null); // เก็บค่าวันที่ที่เลือก
  const [selectedRadio, setSelectedRadio] = useState<string | null>(null); // เก็บค่าสำหรับ radio button
  const [textInputValue, setTextInputValue] = useState<string>(""); // เก็บค่าใน TextInput
  const [selectedCarType, setSelectedCarType] = useState<string | null>(null); // เก็บประเภทรถที่เลือก

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    const form = e.currentTarget;
    e.preventDefault();
    if (form.checkValidity() === false) {
      e.stopPropagation();
      setValidated(true);
    } else {
      setValidated(false);
      console.log("Form submitted successfully");
      console.log("Selected Radio:", selectedRadio); // แสดงค่า radio button ที่เลือก
      console.log("Selected Date:", selectedDate?.format("DD/MM/YYYY")); // แสดงวันที่ที่เลือก
      console.log("TextInput Value:", textInputValue); // แสดงค่าจาก TextInput
    }
  };

  // ฟังก์ชันจัดการการเปลี่ยนแปลงวันที่
  const handleDateChange = (date: Dayjs | null) => {
    setSelectedDate(date);
  };

  const handleRadioChange = (value: string) => {
    setSelectedRadio(value);
    setTextInputValue(""); // ล้างค่าใน TextInput เมื่อเปลี่ยนตัวเลือก
    setValidated(false); // Reset validation state เมื่อเปลี่ยนปุ่มวงรี
  };

  return (
    <div className="container mx-auto">
      <Form noValidate validated={validated} onSubmit={handleSubmit}>
        {/* Section 1: ข้อมูลเจ้าของรถ */}
        <Row className="mt-3 mb-3">
          <Col md={4} xs={12}>
            <TextInput label="ชื่อเจ้าของรถ" id="firstName" required />
          </Col>
          <Col md={4} xs={12}>
            <TextSelect
              label="ประเภทรถ"
              id="carType"
              options={[
                "รถยนต์",
                "รถจักรยานยนต์",
                "รถบรรทุก",
                "รถไฮบริด",
                "รถไฟฟ้า",
              ]}
              onChange={(value) => {
                setSelectedCarType(value);
                setTextInputValue(""); // เมื่อเปลี่ยนเลือกประเภทรถใหม่ให้ล้างค่าใน TextInput
              }}
              required
            />
          </Col>
          <Col md={4} xs={12}>
            <TextSelect
              label="จังหวัด"
              id="province"
              options={provinces}
              onChange={(value) => {
                setSelectedCarType(value);
                setTextInputValue(""); // เมื่อเปลี่ยนเลือกประเภทรถใหม่ให้ล้างค่าใน TextInput
              }}
              required
            />
          </Col>
        </Row>

        {/* Section 2: วันที่ต่างๆ */}
        <Row className="mb-3">
          <Col className="mb-3" md={4} xs={12}>
            {/* ข้อความ "ดูรูปตัวอย่าง" แทรกอยู่บน DateInput */}
            <ImageModal /> {/* เรียกใช้ ImageModal ที่คุณสร้างไว้ */}
            <DateInput
              onDateChange={handleDateChange} // ส่ง onDateChange เพื่อจัดการการเปลี่ยนแปลงวันที่
              labelText="วันที่จดทะเบียน"
            />
          </Col>
          <Col className="mb-3" md={4} xs={12}>
            {/* ข้อความ "ดูรูปตัวอย่าง" แทรกอยู่บน DateInput */}
            <ImageModal /> {/* เรียกใช้ ImageModal ที่คุณสร้างไว้ */}
            <DateInput
              onDateChange={handleDateChange} // ส่ง onDateChange เพื่อจัดการการเปลี่ยนแปลงวันที่
              labelText="วันสิ้นอายุ"
            />
          </Col>
          <Col md={4} xs={12}>
            <DateInput
              onDateChange={handleDateChange} // ส่ง onDateChange เพื่อจัดการการเปลี่ยนแปลงวันที่
              labelText="วันต่อภาษีล่าสุด"
            />
          </Col>
        </Row>

        {/* Section 3: ข้อมูลรถและติดต่อ */}
        <Row className="mb-3">
          <Col md={4} xs={12}>
            <TextInput
              label="หมายเลขทะเบียนรถ"
              id="registrationNumber"
              required
            />
          </Col>
          <Col md={4} xs={12}>
            <TextInput
              label={
                !selectedCarType
                  ? "โปรดเลือกประเภทรถ"
                  : selectedCarType === "รถไฮบริด"
                  ? "น้ำหนักรถ (กิโลกรัม)"
                  : selectedCarType === "รถบรรทุก"
                  ? "น้ำหนักรถ (กิโลกรัม)"
                  : selectedCarType === "รถไฟฟ้า"
                  ? "น้ำหนักรถ (กิโลกรัม)"
                  : "ขนาดความจุ CC"
              }
              id="engineSize"
              value={textInputValue}
              onChange={(e) => setTextInputValue(e.target.value)}
              disabled={!selectedCarType}
              required
            />
          </Col>
          <Col md={4} xs={12}>
            <TextInput
              label="เบอร์โทรศัพท์ผู้กรอกข้อมูล"
              id="contactNumber"
              required
            />
          </Col>
        </Row>

        {/* Section 4: ข้อมูลเจ้าของรถ (เลือกประเภทและกรอกข้อมูล) */}
        <Row className="mb-3">
          <Col md={12} xs={12}>
            <RadioButton
              options={[
                "เลขที่บัตรประชาชนเจ้าของรถล่าสุด",
                "หมายเลขพาสปอร์ตเจ้าของรถล่าสุด",
              ]}
              name="radioOptions"
              label="ประเภทข้อมูลเจ้าของรถ"
              selectedValue={selectedRadio}
              onChange={handleRadioChange}
              isValid={selectedRadio !== null} // ใช้โลจิกการตรวจสอบว่า selectedRadio ไม่เป็นค่า null
            />
          </Col>
        </Row>

        <Row>
          <Col md={8} xs={12} xxl={8} xl={8}>
            <TextInput
              label={
                !selectedRadio
                  ? "โปรดเลือกประเภทข้อมูลเจ้าของรถ"
                  : selectedRadio === "เลขที่บัตรประชาชนเจ้าของรถล่าสุด"
                  ? "กรอกเลขที่บัตรประชาชน"
                  : "กรอกหมายเลขพาสปอร์ต"
              }
              id="ownerData"
              value={textInputValue}
              onChange={(e) => setTextInputValue(e.target.value)} // อัปเดตค่าใน TextInput
              disabled={!selectedRadio} // ปิดการใช้งานถ้ายังไม่ได้เลือก radio
              required
            />
          </Col>
          <Col md={4} xl={4} xs={6}>
            <TextSelect
              label="จำนวนประตูรถ"
              id="bikeTypeAdditional"
              options={["2 ประตู", "4 ประตู"]}
              onChange={(value) => {
                setSelectedCarType(value);
                setTextInputValue(""); // เมื่อเปลี่ยนเลือกประเภทรถใหม่ให้ล้างค่าใน TextInput
              }}
              required
            />
          </Col>
        </Row>

        <hr className="my-4" />

        {/* ปุ่มกด */}
        <Row className="mb-3">
          <Col>
            <Button label="ต่อไป" className="w-100" />
          </Col>
        </Row>
      </Form>
    </div>
  );
};

export default FormComponent;
