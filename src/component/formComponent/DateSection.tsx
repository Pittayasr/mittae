import React, { useMemo, useEffect } from "react";
import { Col, Row } from "react-bootstrap";
import DateInput from "../textFillComponent/dateInput";
import TextSelect from "../textFillComponent/textSelect";
import { calculateCarAge } from "../../data/calculateTax"; // นำเข้าฟังก์ชัน
import { Dayjs } from "dayjs";

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
  setCarMoreThan5Years: (value: boolean) => void;
}

const DateSection: React.FC<DateSectionProps> = ({
  isInvalid,
  handleDateChange,
  registrationDate,
  expirationDate,
  latestTaxPaymentDate,
  missedTaxPayment,
  setMissedTaxPayment,
  setIsFormValid,
  setCarMoreThan5Years,
}) => {
  // ใช้ฟังก์ชัน calculateCarAge แทนการคำนวณวันเอง
  const carAge = useMemo(
    () => calculateCarAge(registrationDate),
    [registrationDate]
  );

  // ตรวจสอบว่ารถมีอายุ >= 5 ปี หรือไม่
  const carMoreThan5Years = useMemo(() => carAge.years < 5, [carAge]);

  // อัปเดตค่า `setCarMoreThan5Years`
  useEffect(() => {
    setCarMoreThan5Years(carMoreThan5Years);
  }, [carMoreThan5Years, setCarMoreThan5Years]);

  // คำนวณจำนวนครั้งที่ขาดชำระ (สูงสุด 5 ปี)
  const maxMissedPayments = useMemo(() => Math.min(carAge.years, 5), [carAge]);

  // ตัวเลือก dropdown ของ "จำนวนขาดชำระภาษี"
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
    // if (type === "registration" || type === "expiration") {
    //   window.scrollTo({ top: 200, behavior: "smooth" });
    // }
    handleDateChange(date, type);
  };

  // ตรวจสอบว่าค่าที่กรอกถูกต้องหรือไม่
  const isDateInvalid = useMemo(() => {
    if (!latestTaxPaymentDate || !expirationDate) return false;
    return latestTaxPaymentDate.isAfter(expirationDate);
  }, [latestTaxPaymentDate, expirationDate]);

  // ตรวจสอบความถูกต้องของฟอร์ม
  useEffect(() => {
    if (carMoreThan5Years) {
      setMissedTaxPayment(null);
    }
    setIsFormValid(!isDateInvalid);
  }, [isDateInvalid, setIsFormValid]);
  

  return (
    <Row>
      {/* วันที่จดทะเบียน */}
      <Col xs={12} sm={6} md={carMoreThan5Years ? 6 : 4} className="mb-4">
        <DateInput
          label="วันที่จดทะเบียน"
          onDateChange={(date) =>
            handleScrollAndDateChange(date, "registration")
          }
          imgPath="/src/data/registerDate.png"
          value={registrationDate}
          isInvalid={isInvalid}
          alertText="กรุณาเลือกวันที่จดทะเบียน"
          required
        />
      </Col>

      {/* วันต่อภาษีล่าสุด */}
      <Col xs={12} sm={6} md={carMoreThan5Years ? 6 : 4} className="mb-4">
        <DateInput
          label="วันต่อภาษีล่าสุด"
          imgPath=""
          onDateChange={(date) => handleDateChange(date, "latestTaxPayment")}
          value={latestTaxPaymentDate}
          isInvalid={isDateInvalid || isInvalid}
          alertText="วันต่อภาษีล่าสุดต้องไม่เกินวันสิ้นอายุ"
          required
        />
      </Col>

      {/* วันสิ้นอายุ */}
      <Col
        xs={12}
        sm={carMoreThan5Years ? 6 : 12}
        md={carMoreThan5Years ? 6 : 4}
        className="mb-4"
      >
        <DateInput
          label="วันสิ้นอายุ"
          onDateChange={(date) => handleScrollAndDateChange(date, "expiration")}
          imgPath="/src/data/endDate.png"
          value={expirationDate}
          isInvalid={isInvalid}
          alertText="กรุณาเลือกวันสิ้นอายุ"
          required
        />
      </Col>

      {/* แสดงช่องขาดชำระภาษี เฉพาะรถที่มีอายุ >= 5 ปี */}
      {carMoreThan5Years && (
        <Col md={6} sm={6} xs={12} className="mb-3">
          <TextSelect
            label="เคยขาดจ่ายชำระภาษีหรือไม่"
            id="insuranceType"
            options={missedPaymentOptions}
            value={missedTaxPayment}
            onChange={setMissedTaxPayment}
            placeholder="เลือก..."
            required
            alertText="กรุณาเลือกจำนวนครั้งที่ขาดชำระภาษี"
            isInvalid={isInvalid}
          />
        </Col>
      )}
    </Row>
  );
};

export default DateSection;
