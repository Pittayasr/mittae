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
      <Form
        className="form"
        noValidate
        validated={validated}
        onSubmit={handleSubmit}
      >
        {/* Section 1: ข้อมูลเจ้าของรถ */}
        <Row className="mt-3">
          <Col className="mb-4" md={4} xs={6}>
            <TextInput label="ชื่อเจ้าของรถ" id="firstName" required />
          </Col>
          <Col className="mb-4" md={4} xs={6}>
            <TextSelect
              label="จังหวัด"
              id="province"
              options={provinces}
              onChange={() => {}}
              required
            />
          </Col>
          <Col className="mb-4" md={4} xs={12}>
            <TextSelect
              label="ประเภทรถ"
              id="carType"
              options={[
                "รถยนต์",
                "รถจักรยานยนต์",
                "รถบรรทุก",
                "รถบรรทุก(เกิน7ที่นั่ง)",
                "รถไฮบริด",
                "รถไฟฟ้า",
              ]}
              onChange={(value) => {
                setSelectedCarType(value);
              }}
              required
            />
          </Col>
        </Row>

        {/* Section 2: วันที่ต่างๆ */}
        <Row>
          <Col className="mb-4" md={4} xs={12}>
            <div className="d-flex justify-content-between align-items-center mb-1">
              <span>วันที่จดทะเบียน</span>
              <ImageModal
                imageUrl="/src/data/registerDate.png"
                buttonText="ดูรูปตัวอย่าง"
              />
            </div>
            {/* ข้อความ "ดูรูปตัวอย่าง" */}
            <DateInput
              onDateChange={handleDateChange} // ส่ง onDateChange เพื่อจัดการการเปลี่ยนแปลงวันที่
              labelText=""
            />
          </Col>
          <Col className=" dateTax mb-4" md={4} xs={6}>
            {/* ข้อความ "ดูรูปตัวอย่าง" แทรกอยู่บน DateInput */}
            <div className="d-flex justify-content-between align-items-center mb-1">
              <span>วันสิ้นอายุ</span>
              <ImageModal
                imageUrl="/src/data/endDate.png"
                buttonText="ดูรูปตัวอย่าง"
              />
            </div>
            {/* ข้อความ "ดูรูปตัวอย่าง" */}
            <DateInput
              onDateChange={handleDateChange} // ส่ง onDateChange เพื่อจัดการการเปลี่ยนแปลงวันที่
              labelText=""
            />
          </Col>
          <Col className="dateTax mb-4" md={4} xs={6}>
            {/* ข้อความ "ดูรูปตัวอย่าง" แทรกอยู่บน DateInput */}
            <div className="d-flex justify-content-between align-items-center mb-1">
              <span>วันต่อภาษีล่าสุด</span>
            </div>
            {/* ข้อความ "ดูรูปตัวอย่าง" */}
            <DateInput
              onDateChange={handleDateChange} // ส่ง onDateChange เพื่อจัดการการเปลี่ยนแปลงวันที่
              labelText=""
            />
          </Col>
        </Row>

        {/* Section 3: ข้อมูลรถและติดต่อ */}
        <Row>
          <Col className="noCar-tel mb-4" md={4} xs={6}>
            <TextInput
              label="หมายเลขทะเบียนรถ"
              id="registrationNumber"
              required
            />
          </Col>

          <Col className="noCar-tel mb-4" md={4} xs={6}>
            <TextInput
              label="เบอร์โทรศัพท์ผู้กรอกข้อมูล"
              id="contactNumber"
              required
            />
          </Col>

          <Col className="mb-4" md={4} xs={12}>
            {/* แสดงช่องนี้เมื่อมีการเลือกประเภทรถ */}
            {selectedCarType && (
              <TextInput
                label={
                  selectedCarType === "รถไฮบริด" ||
                  selectedCarType === "รถบรรทุก" ||
                  selectedCarType === "รถบรรทุก(เกิน7ที่นั่ง)" ||
                  selectedCarType === "รถไฟฟ้า"
                    ? "น้ำหนักรถ (กิโลกรัม)"
                    : "ขนาดความจุ CC"
                }
                id="engineSize"
                value={textInputValue}
                required
              />
            )}
          </Col>
        </Row>

        {/* Section 4: ข้อมูลเจ้าของรถ (เลือกประเภทและกรอกข้อมูล) */}
        <Row>
          <Col className="mb-4" md={12} xs={12}>
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

        {/* Section 5: กรอกข้อมูลเจ้าของรถ ชนิดรถต่างๆ */}
        <Row>
          <Col className="ID-card-and-type mb-4" md={6} xs={6}>
            {selectedRadio && (
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
            )}
          </Col>
          <Col className="ID-card-and-type mb-4" md={6} xs={6}>
            {selectedCarType && (
              <TextSelect
                label={
                  selectedCarType === "รถจักรยานยนต์"
                    ? "ประเภทของรถมอเตอร์ไซค์"
                    : "จำนวนประตูรถยนต์"
                }
                id="bikeTypeAdditional"
                options={
                  selectedCarType === "รถจักรยานยนต์"
                    ? ["รถส่วนบุคคล", "สาธารณะ", "รถพ่วง"]
                    : ["2 ประตู", "4 ประตู"]
                }
                onChange={() => {}}
                required
              />
            )}
          </Col>
        </Row>

        <hr className="my-4" />

        {/* ปุ่มกด */}
        <Row className="mb-2">
          <Col>
            <Button label="ต่อไป" className="w-100" />
          </Col>
        </Row>
      </Form>
    </div>
  );
};

export default FormComponent;
