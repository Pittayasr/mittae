//form.tsx
import React, { useState, useEffect } from "react";
import Button from "./Button";
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
      selectedRadio &&
      selectedCarType;

    if (isFormValid) {
      const carDetails = {
        isTwoDoor: bikeTypeOrDoorCount === "2 ประตู",
        isMotorcycleTrailer:
          selectedCarType === "รถจักรยานยนต์" &&
          bikeTypeOrDoorCount === "รถพ่วง",
        weight: parseFloat(engineSize),
        cc: selectedCarType === "รถยนต์" ? parseFloat(engineSize) : 0,
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
          setOwnerData={setOwnerData}
          selectedCarType={selectedCarType}
          bikeTypeOrDoorCount={bikeTypeOrDoorCount}
          setBikeTypeOrDoorCount={setBikeTypeOrDoorCount}
        />

        {/* Integrate VehicleInfo */}
        <VehicleInfo
          registrationNumber={registrationNumber}
          setRegistrationNumber={setRegistrationNumber}
          contactNumber={contactNumber}
          setContactNumber={setContactNumber}
          engineSize={engineSize}
          setEngineSize={setEngineSize}
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
                  selectedRadio &&
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
