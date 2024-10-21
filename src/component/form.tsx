//form.tsx
import React, { useState, useEffect } from "react";
import Button from "./button";
import UserInfo from "./formComponent/UserInfo";
import DateSection from "./formComponent/DateSection";
import VehicleInfo from "./formComponent/VehicleInfo";
import OwnerInfo from "./formComponent/OwnerInfo";
import { Form, Row, Col } from "react-bootstrap";
import { Dayjs } from "dayjs";
import { calculateTax } from "../data/calculateTax";
import dayjs from "dayjs";

const FormComponent: React.FC = () => {
  const [validated, setValidated] = useState(false);
  const [registrationDate, setRegistrationDate] = useState<Dayjs | null>(null);
  const [expirationDate, setExpirationDate] = useState<Dayjs | null>(null);
  const [latestTaxPaymentDate, setLatestTaxPaymentDate] =
    useState<Dayjs | null>(null);
  const [selectedRadio, setSelectedRadio] = useState<string | null>(null);
  const [ownerData, setOwnerData] = useState<string>("");
  const [usernameData, setUsernameData] = useState<string>("");
  const [engineSize, setEngineSize] = useState<string>("");
  const [contactNumber, setContactNumber] = useState<string>("");
  const [registrationNumber, setRegistrationNumber] = useState<string>("");
  const [selectedCarType, setSelectedCarType] = useState<string | null>(null);
  const [selectedProvince, setSelectedProvince] = useState<string | null>(null);
  const [totalCost, setTotalCost] = useState<number | null>(null);
  const [bikeTypeOrDoorCount, setBikeTypeOrDoorCount] = useState<string | null>(
    null
  );

  useEffect(() => {
    setBikeTypeOrDoorCount(null); // รีเซ็ตเมื่อ selectedCarType เปลี่ยน
  }, [selectedCarType]);

  const handleDateChange = (
    date: Dayjs | null,
    type: "registration" | "expiration" | "latestTaxPayment"
  ) => {
    if (type === "registration") {
      setRegistrationDate(date);
    } else if (type === "expiration") {
      setExpirationDate(date);
    } else if (type === "latestTaxPayment") {
      setLatestTaxPaymentDate(date);
    }
  };

  const handleRadioChange = (value: string) => {
    setSelectedRadio(value);
    setOwnerData("");
    setValidated(false);
  };

  const handleLicensePlateChange = (value: string) => {
    const licensePlatePattern = /^[A-Za-z0-9ก-ฮ]{1,8}$/; // รูปแบบหมายเลขทะเบียน
    if (licensePlatePattern.test(value)) {
      setRegistrationNumber(value); // ตั้งค่าใหม่
    } else {
      console.error("หมายเลขทะเบียนไม่ถูกต้อง");
    }
  };

  const handleNumberInputChange = (
    value: string,
    setter: React.Dispatch<React.SetStateAction<string>>
  ) => {
    // ใช้ Regular Expression เพื่อตรวจสอบว่าเป็นตัวเลข 10 หลักที่เริ่มต้นด้วย 06 หรือ 08
    const phonePattern = /^(06|08)\d{8}$/;

    if (phonePattern.test(value)) {
      setter(value); // อนุญาตเฉพาะหมายเลขโทรศัพท์ที่ถูกต้อง
    } else {
      console.error(
        "กรุณากรอกหมายเลขโทรศัพท์มือถือที่ถูกต้อง (เริ่มต้นด้วย 06 หรือ 08 และมีความยาว 10 หลัก)"
      );
    }
  };
  const handleOwnerDataChange = (value: string) => {
    // เช็คว่ากรอกเป็นหมายเลขบัตรประชาชน (13 หลัก) หรือหมายเลขพาสปอร์ต (ขึ้นต้นด้วยตัวอักษรและตามด้วยเลข 7-8 หลัก)
    if (/^\d{13}$/.test(value) || /^[A-Z]\d{7,8}$/.test(value)) {
      setOwnerData(value); // อัปเดต state
    } else {
      console.error("หมายเลขไม่ถูกต้อง");
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setValidated(true);

    const calculateCarAge = (registerDate: Dayjs | null): number => {
      return registerDate ? dayjs().year() - registerDate.year() : 0;
    };

    const monthsLate = (
      expirationDate: Dayjs | null,
      latestTaxPaymentDate: Dayjs | null
    ): number => {
      if (expirationDate && latestTaxPaymentDate) {
        return Math.max(0, expirationDate.diff(latestTaxPaymentDate, "months"));
      }
      return 0;
    };
    console.log("เดือนที่เกินมา = ", monthsLate);

    const isMoreThanThreeYears = (
      lastTaxDate: Dayjs | null,
      expirationDate: Dayjs | null
    ): boolean => {
      if (lastTaxDate && expirationDate) {
        const yearDiff = expirationDate.diff(lastTaxDate, "year");
        return yearDiff > 3;
      }
      return false;
    };

    const isFormValid =
      ownerData &&
      usernameData &&
      engineSize &&
      contactNumber &&
      registrationNumber &&
      registrationDate &&
      expirationDate &&
      latestTaxPaymentDate &&
      selectedRadio &&
      bikeTypeOrDoorCount &&
      selectedCarType;

    if (isFormValid) {
      const carDetails = {
        isCar: selectedCarType === "รถยนต์",
        isTwoDoor: bikeTypeOrDoorCount === "2 ประตู",
        isMotorcycleTrailer:
          selectedCarType === "รถจักรยานยนต์" &&
          bikeTypeOrDoorCount === "รถพ่วง",
        weight: parseFloat(engineSize) || 0,
        cc: parseFloat(engineSize) || 0,
        age: calculateCarAge(registrationDate),
        expiryDate: expirationDate ? expirationDate.toDate() : null, // ส่ง expirationDate
        lastTaxDate: latestTaxPaymentDate
          ? latestTaxPaymentDate.toDate()
          : null, // ส่ง lastTaxDate
        isInChiangRai: selectedProvince === "เชียงราย",
        isMotorcycle: selectedCarType === "รถจักรยานยนต์",
        isCarTruck: selectedCarType == "รถบรรทุก",
        isElectric: selectedCarType == "รถไฟฟ้า",
        isHybrid: selectedCarType == "รถไฮบริด",
        hasMoreThanSevenSeats: selectedCarType == "รถบรรทุก(เกิน7ที่นั่ง)",
        isRoadroller: selectedCarType == "รถบดถนน",
        isTractor: selectedCarType == "รถแทรกเตอร์",
        isCarTrailer: selectedCarType == "รถพ่วง",
        isMoreThanThreeYears: isMoreThanThreeYears(
          latestTaxPaymentDate,
          expirationDate
        ),
        monthsLate: monthsLate(latestTaxPaymentDate, expirationDate),
      };

      console.log("Car Details:", carDetails);
      const totalTax = calculateTax(carDetails);
      setTotalCost(totalTax);
    }
  };

  return (
    <div className="container mx-auto">
      <Form
        className="form"
        noValidate
        validated={validated}
        onSubmit={handleSubmit}
      >
        {/* UserInfo */}
        <UserInfo
          usernameData={usernameData}
          setUsernameData={setUsernameData}
          selectedProvince={selectedProvince}
          setSelectedProvince={setSelectedProvince}
          selectedCarType={selectedCarType}
          setSelectedCarType={setSelectedCarType}
        />

        {/* DateSection with callback for different dates */}
        <DateSection
          handleDateChange={handleDateChange} // Callback to handle date changes
        />

        {/* Integrate OwnerInfo */}
        <OwnerInfo
          selectedRadio={selectedRadio}
          setSelectedRadio={handleRadioChange}
          ownerData={ownerData}
          setOwnerData={handleOwnerDataChange} // ใช้ handleOwnerDataChange ที่ปรับปรุงแล้ว
          selectedCarType={selectedCarType}
          bikeTypeOrDoorCount={bikeTypeOrDoorCount}
          setBikeTypeOrDoorCount={setBikeTypeOrDoorCount}
        />

        {/* Integrate VehicleInfo */}
        <VehicleInfo
          registrationNumber={registrationNumber}
          setRegistrationNumber={
            (e) => handleLicensePlateChange(e.target.value) // ส่ง e.target.value
          }
          contactNumber={contactNumber}
          setContactNumber={
            (e) => handleNumberInputChange(e.target.value, setContactNumber) // ส่ง e.target.value
          }
          engineSize={engineSize}
          setEngineSize={
            (e) => handleNumberInputChange(e.target.value, setEngineSize) // ส่ง e.target.value
          }
          selectedCarType={selectedCarType}
        />

        <hr className="my-4" />
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
                  registrationDate &&
                  expirationDate &&
                  latestTaxPaymentDate &&
                  selectedRadio &&
                  bikeTypeOrDoorCount &&
                  selectedCarType
                )
              }
            />
          </Col>
        </Row>
      </Form>
      {totalCost !== null && <div>ค่าภาษีรวม: {totalCost}</div>}
    </div>
  );
};

export default FormComponent;
