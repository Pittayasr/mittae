import React, { useState } from "react";
import TextInput from "./textInput";
import TextSelect from "./textSelect";
import DateInput from "./dateInput";
import Button from "./Button";
import { Form, Row, Col } from "react-bootstrap";
import { Dayjs } from "dayjs";
import { provinces } from "../data/provinces";
import RadioButton from "./radioButton";
import ImageModal from "./Imagemodal";
import { calculateTax } from "../data/calculateTax";
import dayjs from "dayjs";

const FormComponent: React.FC = () => {
  const [validated, setValidated] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Dayjs | null>(null);
  const [selectedRadio, setSelectedRadio] = useState<string | null>(null);
  const [ownerData, setOwnerData] = useState<string>("");
  const [usernameData, setUsernameData] = useState<string>("");
  const [engineSize, setEngineSize] = useState<string>("");
  const [contactNumber, setContactNumber] = useState<string>("");
  const [registrationNumber, setRegistrationNumber] = useState<string>("");
  const [selectedCarType, setSelectedCarType] = useState<string | null>(null);
  const [selectedProvince, setSelectedProvince] = useState<string | null>(null); // เพิ่มเพื่อเก็บข้อมูลจังหวัด
  const [totalCost, setTotalCost] = useState<number | null>(null); // สำหรับเก็บค่าภาษีที่คำนวณได้

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const isFormValid =
      ownerData &&
      usernameData &&
      engineSize &&
      contactNumber &&
      registrationNumber &&
      selectedDate &&
      selectedRadio &&
      selectedCarType;

    if (isFormValid) {
      // สร้างอ็อบเจ็กต์ CarDetails สำหรับการคำนวณภาษี
      const carDetails = {
        isTwoDoor:
          selectedCarType === "รถยนต์" &&
          false /* เช็คว่ารถเป็น 2 ประตูหรือไม่ */,
        isTrailer:
          selectedCarType === "รถจักรยานยนต์" &&
          false /* เช็คว่ามีพ่วงหรือไม่ */,
        weight: parseFloat(engineSize),
        cc: selectedCarType === "รถยนต์" ? parseFloat(engineSize) : 0,
        age: selectedDate ? calculateCarAge(selectedDate) : 0,
        isInChiangRai: selectedProvince === "เชียงราย",
        isMotorcycle: selectedCarType === "รถจักรยานยนต์",
      };

      // คำนวณภาษี
      const totalTax = calculateTax(carDetails);
      setTotalCost(totalTax); // เก็บค่าภาษีใน state
    } else {
      console.log("Please fill all fields");
      setValidated(true);
    }
  };

  const handleDateChange = (date: Dayjs | null) => {
    setSelectedDate(date);
  };

  const handleRadioChange = (value: string) => {
    setSelectedRadio(value);
    setOwnerData("");
    setValidated(false);
  };

  const calculateCarAge = (registerDate: Dayjs): number => {
    const currentYear = dayjs().year();
    return currentYear - registerDate.year();
  };

  return (
    <div className="container mx-auto">
      <Form
        className="form"
        noValidate
        validated={validated}
        onSubmit={handleSubmit}
      >
        <Row className="mt-3">
          <Col className="mb-4" md={4} xs={12}>
            <TextInput
              label="ชื่อเจ้าของรถ"
              id="userName"
              value={usernameData}
              onChange={(e) => setUsernameData(e.target.value)}
              required
            />
          </Col>
          <Col className="mb-4" md={4} xs={6}>
            <TextSelect
              label="จังหวัด"
              id="province"
              options={provinces}
              onChange={(value) => setSelectedProvince(value)} // เก็บข้อมูลจังหวัด
              required
            />
          </Col>
          <Col className="mb-4" md={4} xs={6}>
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
              onChange={(value) => setSelectedCarType(value)}
              required
            />
          </Col>
        </Row>
        <Row>
          <Col className="mb-4" md={4} xs={12}>
            <div className="d-flex justify-content-between align-items-center mb-1">
              <span>วันที่จดทะเบียน</span>
              <ImageModal
                imageUrl="/src/data/registerDate.png"
                buttonText="ดูรูปตัวอย่าง"
              />
            </div>
            <DateInput onDateChange={handleDateChange} labelText="" />
          </Col>
          <Col className="date-idNo-carType-Input mb-4" md={4} xs={6}>
            <div className="d-flex justify-content-between align-items-center mb-1">
              <span>วันสิ้นอายุ</span>
              <ImageModal
                imageUrl="/src/data/endDate.png"
                buttonText="ดูรูปตัวอย่าง"
              />
            </div>
            <DateInput onDateChange={handleDateChange} labelText="" />
          </Col>
          <Col className="date-idNo-carType-Input mb-4" md={4} xs={6}>
            <DateInput
              onDateChange={handleDateChange}
              labelText="วันต่อภาษีล่าสุด"
            />
          </Col>
        </Row>
        <Row>
          <Col className="register-and-contract-number mb-4" md={4} xs={6}>
            <TextInput
              label="หมายเลขทะเบียนรถ"
              id="registrationNumber"
              value={registrationNumber}
              onChange={(e) => setRegistrationNumber(e.target.value)}
              required
            />
          </Col>

          <Col className="register-and-contract-number mb-4" md={4} xs={6}>
            <TextInput
              label="เบอร์โทรศัพท์ผู้กรอกข้อมูล"
              id="contactNumber"
              value={contactNumber}
              onChange={(e) => setContactNumber(e.target.value)}
              required
            />
          </Col>

          <Col className="mb-4" md={4} xs={12}>
            {selectedCarType && (
              <TextInput
                label={
                  selectedCarType === "รถบรรทุก" ||
                  selectedCarType === "รถบรรทุก(เกิน7ที่นั่ง)" ||
                  selectedCarType === "รถไฮบริด" ||
                  selectedCarType === "รถไฟฟ้า"
                    ? "น้ำหนักรถ (กิโลกรัม)"
                    : "ขนาดความจุ CC"
                }
                id="engineSize"
                value={engineSize}
                onChange={(e) => setEngineSize(e.target.value)}
                required
              />
            )}
          </Col>
        </Row>
        //radio button
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
              isValid={selectedRadio !== null}
            />
          </Col>
        </Row>
        <Row>
          <Col className="date-idNo-carType-Input mb-4" md={6} xs={6}>
            {selectedRadio && (
              <TextInput
                label={
                  selectedRadio === "เลขที่บัตรประชาชนเจ้าของรถล่าสุด"
                    ? "กรอกเลขที่บัตรประชาชน"
                    : "กรอกหมายเลขพาสปอร์ต"
                }
                id="ownerData"
                value={ownerData}
                onChange={(e) => setOwnerData(e.target.value)}
                disabled={!selectedRadio}
                required
              />
            )}
          </Col>
          <Col className="date-idNo-carType-Input mb-4" md={6} xs={6}>
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
            <Button
              label="ต่อไป"
              className="w-100"
              type="submit"
              variant="primary"
              disabled={
                !(
                  ownerData &&
                  usernameData &&
                  engineSize &&
                  contactNumber &&
                  registrationNumber &&
                  selectedDate &&
                  selectedRadio &&
                  selectedCarType
                )
              }
            />
          </Col>
        </Row>
        {totalCost !== null && <div>Total Cost of Tax: {totalCost}</div>}
      </Form>
    </div>
  );
};

export default FormComponent;
