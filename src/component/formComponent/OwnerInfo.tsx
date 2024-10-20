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

  return (
    <>
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
