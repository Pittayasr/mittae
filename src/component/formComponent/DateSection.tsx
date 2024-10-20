// DateSection.tsx
import React, { useState } from "react";
import { Col, Row } from "react-bootstrap";
import DateInput from "../dateInput";
import ImageModal from "../Imagemodal";
import dayjs, { Dayjs } from "dayjs";

interface DateSectionProps {
  handleDateChange: (
    date: Dayjs | null,
    type: "registration" | "expiration" | "latestTaxPayment"
  ) => void;
}

const DateSection: React.FC<DateSectionProps> = ({ handleDateChange }) => {
  const [registrationDate, setRegistrationDate] = useState<Dayjs | null>(null);
  const [expirationDate, setExpirationDate] = useState<Dayjs | null>(null);
  const [lastTaxDate, setLastTaxDate] = useState<Dayjs | null>(null);

  const calculateAge = (date: Dayjs | null) => {
    if (!date) return 0;
    return dayjs().diff(date, "year"); // Calculate age in years
  };

  const calculateYearDifference = (
    startDate: Dayjs | null,
    endDate: Dayjs | null
  ) => {
    if (!startDate || !endDate) return 0;
    return endDate.diff(startDate, "year"); // Calculate the difference in years
  };

  const handleRegistrationDateChange = (date: Dayjs | null) => {
    setRegistrationDate(date);
    handleDateChange(date, "registration"); // ส่งประเภทวันที่
  };

  const handleExpirationDateChange = (date: Dayjs | null) => {
    setExpirationDate(date);
    handleDateChange(date, "expiration"); // ส่งประเภทวันที่
  };

  const handleLastTaxDateChange = (date: Dayjs | null) => {
    setLastTaxDate(date);
    handleDateChange(date, "latestTaxPayment"); // ส่งประเภทวันที่
  };

  const vehicleAge = calculateAge(registrationDate);
  const yearDiffExpirationToLastTax = calculateYearDifference(
    expirationDate,
    lastTaxDate,
  );
  const isMoreThanThreeYears = yearDiffExpirationToLastTax > 3; // เช็คว่าระยะห่างมากกว่า 3 ปีไหม

  return (
    <Row>
      <Col className="mb-4" md={4} xs={12}>
        <div className="d-flex justify-content-between align-items-center mb-1">
          <span>วันที่จดทะเบียน</span>
          <ImageModal
            imageUrl="/src/data/registerDate.png"
            buttonText="ดูรูปตัวอย่าง"
          />
        </div>
        <DateInput onDateChange={handleRegistrationDateChange} labelText="" />
        <span>อายุรถ: {vehicleAge} ปี</span>
      </Col>
      <Col className="date-idNo-carType-Input mb-4" md={4} xs={6}>
        <div className="d-flex justify-content-between align-items-center mb-1">
          <span>วันสิ้นอายุ</span>
          <ImageModal
            imageUrl="/src/data/endDate.png"
            buttonText="ดูรูปตัวอย่าง"
          />
        </div>
        <DateInput onDateChange={handleExpirationDateChange} labelText="" />
      </Col>
      <Col className="date-idNo-carType-Input mb-4" md={4} xs={6}>
        <div className="d-flex justify-content-between align-items-center mb-1">
          <span>วันต่อภาษีล่าสุด</span>
        </div>
        <DateInput onDateChange={handleLastTaxDateChange} labelText="" />
      </Col>
      <Col className="mb-4" md={12} xs={12}>
        <span>
          ระยะห่างจากวันสิ้นอายุถึงวันต่อภาษีล่าสุด:{" "}
          {yearDiffExpirationToLastTax} ปี
        </span>
        <span>{isMoreThanThreeYears ? " => เกิน 3 ปี" : "ไม่เกิน 3 ปี"}</span>
      </Col>
    </Row>
  );
};

export default DateSection;
