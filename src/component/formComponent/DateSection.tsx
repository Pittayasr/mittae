// DateSection.tsx
import React, { useMemo } from "react";
import { Col, Row } from "react-bootstrap";
import DateInput from "../textFillComponent/dateInput";
import TextSelect from "../textFillComponent/textSelect";
import dayjs, { Dayjs } from "dayjs";

interface DateSectionProps {
  isInvalid: boolean;
  handleDateChange: (
    date: Dayjs | null,
    type: "registration" | "expiration" | "latestTaxPayment"
  ) => void;
  registrationDate: Dayjs | null;
  expirationDate: Dayjs | null;
  latestTaxPaymentDate: Dayjs | null;
  missedTaxPayment: string | null;
  setMissedTaxPayment: (value: string | null) => void;
  setIsFormValid: (isValid: boolean) => void;
}

const DateSection: React.FC<DateSectionProps> = ({
  isInvalid,
  handleDateChange,
  registrationDate,
  expirationDate,
  latestTaxPaymentDate,
  missedTaxPayment,
  setMissedTaxPayment,
}) => {
  const daysSinceRegistration = useMemo(() => {
    if (!registrationDate) return 0;
    return dayjs().diff(registrationDate, "day");
  }, [registrationDate]);

  const maxMissedPayments = useMemo(() => {
    if (daysSinceRegistration === 0) return 0;

    const yearsPassed = Math.floor(daysSinceRegistration / 365); // คำนวณปีที่ผ่านไป
    return Math.min(Math.max(yearsPassed, 0), 5); // จำกัดที่ 5 ปี
  }, [daysSinceRegistration]);

  // สร้างตัวเลือกสำหรับจำนวนครั้งที่ขาดชำระ
  const missedPaymentOptions = useMemo(() => {
    if (maxMissedPayments === 0) return [{ label: "ไม่เคย", value: "ไม่เคย" }];

    const options = [{ label: "ไม่เคย", value: "ไม่เคย" }];
    for (let i = 1; i <= maxMissedPayments; i++) {
      options.push({ label: `${i} ครั้ง`, value: `${i} ครั้ง` });
    }
    return options;
  }, [maxMissedPayments]);

  const handleScrollAndDateChange = (
    date: Dayjs | null,
    type: "registration" | "expiration" | "latestTaxPayment"
  ) => {
    if (type === "registration" || type === "expiration") {
      // เลื่อนหน้าจอขึ้นด้านบน
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }

    // เรียกใช้ handleDateChange ดั้งเดิม
    handleDateChange(date, type);
  };

  return (
    <Row>
      {/* วันที่จดทะเบียน */}
      <Col
        className="date-idNo-carType-Input mb-4"
        xs={12}
        sm={6}
        md={daysSinceRegistration !== 0 && daysSinceRegistration <= 1825 ? 6 : 4}
      >
        {/* <div className="responsive-label d-flex justify-content-between align-items-center mb-1">
          <span className=" mb-1">วันที่จดทะเบียน</span>
          <ImageModal
            imageUrl="/src/data/registerDate.png"
            buttonText="ดูรูปตัวอย่าง"
          />
        </div> */}
        <DateInput
          label="วันที่จดทะเบียน"
          onDateChange={(date) =>
            handleScrollAndDateChange(date, "registration")
          }
          imgPath="/src/data/registerDate.png"
          value={registrationDate} // Directly use registrationDate as Dayjs
          isInvalid={isInvalid}
          alertText="กรุณาเลือกวันที่จดทะเบียน"
        />
        {/* <span>อายุรถ: {carAge.years} ปี {carAge.months} เดือน {carAge.days} วัน</span> */}
      </Col>

      {/* วันสิ้นอายุ */}
      <Col
        className="date-idNo-carType-Input mb-4"
        xs={12}
        sm={6}
        md={daysSinceRegistration !== 0 && daysSinceRegistration <= 1825 ? 6 : 4}
      >
        {/* <div className="responsive-label d-flex justify-content-between align-items-center mb-1">
          <span className="mb-1">วันสิ้นอายุ</span>
          <ImageModal
            imageUrl="/src/data/endDate.png"
            buttonText="ดูรูปตัวอย่าง"
          />
        </div> */}
        <DateInput
          label="วันสิ้นอายุ"
          onDateChange={(date) => handleScrollAndDateChange(date, "expiration")}
          imgPath="/src/data/endDate.png"
          value={expirationDate} // Directly use expirationDate as Dayjs
          isInvalid={isInvalid}
          alertText="กรุณาเลือกวันสิ้นอายุ"
        />
      </Col>

      {/* วันต่อภาษีล่าสุด */}
      <Col
        className="date-idNo-carType-Input mb-4"
        xs={12}
        sm={daysSinceRegistration !== 0 && daysSinceRegistration <= 1825 ? 6 : 12}
        md={daysSinceRegistration !== 0 && daysSinceRegistration <= 1825 ? 6 : 4}
      >
        {/* <div
          className="responsive-label d-flex justify-content-between align-items-center "
          style={{ paddingBottom: "10px" }}
        >
          <span className="mb-0">วันต่อภาษีล่าสุด</span>
        </div> */}
        <DateInput
          label="วันต่อภาษีล่าสุด"
          imgPath=""
          onDateChange={(date) => handleDateChange(date, "latestTaxPayment")}
          value={latestTaxPaymentDate} // Directly use latestTaxPaymentDate as Dayjs
          isInvalid={isInvalid}
          alertText="กรุณาเลือกวันต่อภาษีล่าสุด"
        />
      </Col>
      {/* การขาดการชำระ */}
      {daysSinceRegistration !== 0 && daysSinceRegistration <= 1825 && (
        <Col md={daysSinceRegistration !== 0 && daysSinceRegistration <= 1825 ? 6 : 4} sm={6} xs={12} className="mb-3">
          <TextSelect
            label="เคยขาดชำระภาษีหรือไม่"
            id="insuranceType"
            options={missedPaymentOptions}
            value={missedTaxPayment}
            onChange={setMissedTaxPayment}
            placeholder="เลือก..."
            required
            alertText="กรุณาเลือกจำนวนครั้งที่ขาดชำระภาษี"
          />
        </Col>
      )}
    </Row>
  );
};

export default DateSection;
