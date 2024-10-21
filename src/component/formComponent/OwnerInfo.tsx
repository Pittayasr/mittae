import React, { useEffect } from "react"; // นำเข้า useEffect
import { Col, Row } from "react-bootstrap";
import RadioButton from "../radioButton";
import TextInput from "../textInput";
import TextSelect from "../textSelect";

interface OwnerInfoProps {
  selectedRadio: string | null;
  setSelectedRadio: (value: string) => void;
  ownerData: string;
  setOwnerData: (value: string) => void;
  selectedCarType: string | null;
  setBikeTypeOrDoorCount: (value: string | null) => void;
  bikeTypeOrDoorCount: string | null;
}

const OwnerInfo: React.FC<OwnerInfoProps> = ({
  selectedRadio,
  setSelectedRadio,
  ownerData,
  setOwnerData,
  selectedCarType,
  setBikeTypeOrDoorCount,
  bikeTypeOrDoorCount,
}) => {
  useEffect(() => {
    // รีเซ็ต bikeTypeOrDoorCount เมื่อ selectedCarType เปลี่ยนแปลง
    console.log("Resetting bikeTypeOrDoorCount due to selectedCarType change");
    setBikeTypeOrDoorCount(null);
  }, [selectedCarType, setBikeTypeOrDoorCount]);

  // ฟังก์ชันในการจัดการการเปลี่ยนแปลงใน TextInput
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setOwnerData(value); // อัปเดต ownerData ตามค่าใน input
  };

  return (
    <>
      <Row>
        <Col className="mb-4" md={12} xs={12}>
          <RadioButton
            options={[
              "หมายเลขบัตรประชาชนเจ้าของรถล่าสุด",
              "หมายเลขพาสปอร์ตเจ้าของรถล่าสุด",
            ]}
            name="radioOptions"
            label="ประเภทข้อมูลเจ้าของรถ"
            selectedValue={selectedRadio}
            onChange={setSelectedRadio}
            isValid={selectedRadio !== null}
          />
        </Col>
      </Row>
      <Row>
        <Col className="date-idNo-carType-Input mb-4" md={6} xs={6}>
          {selectedRadio && (
            <TextInput
              label={
                selectedRadio === "หมายเลขบัตรประชาชนเจ้าของรถล่าสุด"
                  ? "กรอกหมายเลขบัตรประชาชน"
                  : "กรอกหมายเลขพาสปอร์ต"
              }
              placeholder={
                selectedRadio === "หมายเลขบัตรประชาชนเจ้าของรถล่าสุด"
                  ? "กรอกหมายเลขบัตรประชาชน"
                  : "กรอกหมายเลขพาสปอร์ต"
              }
              id="ownerData"
              value={ownerData}
              onChange={handleInputChange} // เรียก handleInputChange เมื่อมีการเปลี่ยนแปลง
              disabled={!selectedRadio}
              required
            />
          )}
        </Col>
        <Col className="date-idNo-carType-Input mb-4" md={6} xs={6}>
          {selectedCarType && (
            <TextSelect
              value={bikeTypeOrDoorCount ?? ""}
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
              placeholder={
                selectedCarType === "รถจักรยานยนต์"
                  ? "เลือกประเภท..."
                  : "เลือกจำนวนประตู..."
              }
              onChange={setBikeTypeOrDoorCount}
              required
            />
          )}
        </Col>
      </Row>
    </>
  );
};

export default OwnerInfo;
