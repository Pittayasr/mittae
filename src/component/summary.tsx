// summary.tsx
import React, { useState } from "react";
import { Col, Row, Button, Form } from "react-bootstrap";
import dayjs from "dayjs";
import "dayjs/locale/th";
import { db } from "../../firebaseConfig";
import { collection, addDoc } from "firebase/firestore";
import AlertModal from "./textFillComponent/alertModal";

// const formatDate = (date: Date | null) => {
//   if (!date) return "-";
//   const formattedDate = dayjs(date).locale("th").format("D MMMM YYYY");
//   const buddhistYear = dayjs(date).year() + 543;
//   return formattedDate.replace(`${dayjs(date).year()}`, `${buddhistYear}`);
// };

const formatDateForFirestore = (date: Date | null) => {
  if (!date) return null;
  return dayjs(date).startOf("day").toDate(); // Set time to 00:00:00
};

interface SummaryProps {
  ownerData: string;
  usernameData: string;
  selectedProvince: string | null;
  engineSize: string | null;
  contactNumber: string;
  registrationNumber: string;
  CCorWeight: string;
  carOrMotorcycleLabel: string;
  registrationDate: Date | null;
  expirationDate: Date | null;
  latestTaxPaymentDate: Date | null;
  selectedRadio: string | null;
  bikeTypeOrDoorCount: string | null;
  selectedCarType: string | null;
  totalCost: number | null;
  prbCost: number | null; // ค่าพรบ.สุทธิ
  taxCost: number | null; // ค่าภาษีสุทธิ
  lateFee: number | null; // ค่าปรับล่าช้า
  inspectionCost: number | null; // ค่าตรวจสภาพ
  processingCost: number | null; // ค่าดำเนินการ
  carAge: { years: number; months: number; days: number };
  onBack: () => void; // ฟังก์ชันสำหรับย้อนกลับ
  onConfirm: () => void; // ฟังก์ชันสำหรับส่งข้อมูล
}

const Summary: React.FC<SummaryProps> = ({
  ownerData,
  usernameData,
  selectedProvince,
  engineSize,
  contactNumber,
  registrationNumber,
  registrationDate,
  expirationDate,
  // CCorWeight,
  // carOrMotorcycleLabel,
  latestTaxPaymentDate,
  // selectedRadio,
  bikeTypeOrDoorCount,
  selectedCarType,
  totalCost,
  prbCost,
  taxCost,
  lateFee,
  inspectionCost,
  processingCost,
  carAge,
  onBack,
}) => {
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [success, setSuccess] = useState(false);

  const handleOpenModal = () => {
    setModalMessage("คุณต้องการยืนยันว่า\nข้อมูลทั้งหมดถูกต้องใช่ไหม?");
    setSuccess(false);
    setShowModal(true);
  };

  const handleConfirm = async () => {
    const data = {
      ownerData: ownerData || "",
      usernameData: usernameData || "",
      selectedProvince: selectedProvince || "",
      engineSize: engineSize || "0",
      contactNumber: contactNumber || "",
      registrationNumber: registrationNumber || "",
      registrationDate: registrationDate ? registrationDate : new Date(),
      expirationDate: expirationDate ? expirationDate : new Date(),
      latestTaxPaymentDate: latestTaxPaymentDate
        ? latestTaxPaymentDate
        : new Date(),
      bikeTypeOrDoorCount: bikeTypeOrDoorCount || "",
      selectedCarType: selectedCarType || "",
      totalCost: totalCost || 0,
      prbCost: prbCost || 0,
      taxCost: taxCost || 0,
      lateFee: lateFee || 0,
      inspectionCost: inspectionCost || 0,
      processingCost: processingCost || 0,
      carAge: carAge || { years: 0, months: 0, days: 0 },
    };

    const updatedData = {
      usernameData: data.usernameData,
      province: data.selectedProvince,
      vehicleType: data.selectedCarType,
      bikeTypeOrDoorCount: data.bikeTypeOrDoorCount,
      weightOrCC: data.engineSize,
      registrationDate: formatDateForFirestore(data.registrationDate),
      expirationDate: formatDateForFirestore(data.expirationDate), // formatDate only to show on UI, not here
      latestTaxPaymentDate: formatDateForFirestore(data.latestTaxPaymentDate),
      vehicleAge: data.carAge,
      contactNumber: data.contactNumber,
      ownerData: data.ownerData,
      prbCost: data.prbCost,
      registrationNumber: data.registrationNumber,
      taxCost: data.taxCost,
      lateFee: data.lateFee,
      inspectionCost: data.inspectionCost,
      processingCost: data.processingCost,
      totalCost: data.totalCost,
    };

    try {
      const docRef = await addDoc(collection(db, "summary"), updatedData);
      console.log("Document written with ID: ", docRef.id);
      setModalMessage(
        "ข้อมูลถูกส่งสำเร็จแล้ว! ✅\nขอขอบพระคุณที่ใช้บริการกับทางเราตลอดไป 🙏❤️\n📢 สักครู่หลังจากชำระเงินแล้ว\nท่านจะได้รับข้อความ SMS ยืนยันความคุ้มครองฯ พ.ร.บ.ไปยังหมายเลขโทรศัพท์ที่ท่านแจ้งมานะคะ ❤️"
      );
      setSuccess(true);
    } catch (e) {
      console.error("Error adding document: ", e);
      setModalMessage("การส่งข้อมูลล้มเหลว กรุณาลองอีกครั้ง");
      setSuccess(false);
    }
    setShowModal(true);
  };

  return (
    <Form>
      <h2 className="text-center mb-4">สรุปข้อมูล</h2>

      <Row>
        {/* <Col md={6}>
          <h5 className="mb-3">ข้อมูลรถ</h5>
          <ul className="list-unstyled">
            <li className="mb-1">
              <strong>ชื่อเจ้าของรถ:</strong> {usernameData}
            </li>
            <li className="mb-1">
              <strong>จังหวัด:</strong> {selectedProvince}
            </li>
            <li className="mb-1">
              <strong>ประเภทรถ:</strong> {selectedCarType}
            </li>
            <li className="mb-1">
              <strong>{carOrMotorcycleLabel}:</strong> {bikeTypeOrDoorCount}
            </li>
            <li className="mb-1">
              <strong>✅ค่าพรบ.ตาม{CCorWeight}🚘:</strong> {engineSize}
            </li>
            <li className="mb-1">
              <strong>หมายเลขทะเบียนรถ:</strong> {registrationNumber}
            </li>
            <li className="mb-1">
              <strong>วันที่จดทะเบียน:</strong> {formatDate(registrationDate)}
            </li>
            <li className="mb-1">
              <strong>วันสิ้นอายุ:</strong> {formatDate(expirationDate)}
            </li>
            <li className="mb-1">
              <strong>วันต่อภาษีล่าสุด:</strong>{" "}
              {formatDate(latestTaxPaymentDate)}
            </li>
            <li className="mb-4">
              <strong>อายุรถ:</strong> {carAge.years} ปี, {carAge.months} เดือน,{" "}
              {carAge.days} วัน
            </li>
          </ul>
        </Col> */}

        <Col>
          {/* <h5 className="mb-3">ข้อมูลเพิ่มเติม</h5>
          <ul className="list-unstyled">
            <li className="mb-1">
              <strong>หมายเลขโทรศัพท์ติดต่อ:</strong> {contactNumber}
            </li>
            <li className="mb-1">
              <strong>{selectedRadio}:</strong> {ownerData}
            </li>
          </ul> */}

          {totalCost !== null && (
            <ul className="list-unstyled mt-4">
              {/* <h5 className="mt-3">ค่าใช้จ่าย</h5> */}
              {/* <li className="mb-1">
                <strong>✅ค่าพรบ.ตาม{CCorWeight}🚘:</strong> {prbCost} บาท
              </li>
              <li className="mb-1">
                <strong>✅ค่าภาษีประจำปี:</strong> {taxCost?.toFixed(2)} บาท
              </li>
              <li className="mb-1">
                <strong>➕ค่าปรับชำระล่าช้า:</strong> {lateFee?.toFixed(2)} บาท
              </li>
              <li className="mb-1">
                <strong>✅ค่าตรวจสภาพรถเอกชน🛣️:</strong> {inspectionCost} บาท
              </li>
              <li className="mb-1">
                <strong>✅ค่าบริการและดำเนินการ♎:</strong> {processingCost} บาท
              </li> */}
              <li className="mb-1">
                <strong>
                  🙏⭐ขออนุญาตแจ้งยอดค่าใช้จ่ายรวมทั้งสิ้น :{" "}
                  {totalCost?.toFixed(2)} บาทค่ะ
                </strong>
              </li>
              <li className="mb-1">
                <strong>✅1.🎯รบกวนลูกค้าโอนเงินชำระเรียบร้อยแล้ว</strong>
              </li>
              <li className="mb-1">
                <strong>
                  ✅2.💵แจ้งส่งสลิป🧾ยืนยันเพื่อให้ทางเราดำเนินการต่อไป🙏
                </strong>
              </li>
              <li className="mb-1">
                <strong>
                  ✅3.ท่านจะได้รับ📑พ.ร.บ.ทันทีเมื่อชำระเงินเรียบร้อย
                </strong>
              </li>
              <li className="mb-1">
                <strong>
                  ✅4.แอดมินจะดำเนินการแจ้งนัดหมายเข้าไปรับรถ(หากต้องมีการตรวจสภาพรถเอกชน
                  ตรอ)
                </strong>
              </li>
              <li className="mb-4">
                <strong>✅ขอขอบพระคุณที่ใช้บริการกับทางเราตลอดไป🙏❤️</strong>
              </li>
              <li className="mb-1">
                <strong>
                  📢สักครู่หลังจากชำระเงินแล้วท่านจะได้รับข้อความSMSยืนยันความคุ้มครองฯพ.ร.บ.ไปยังหมายเลขโทรศัพท์ที่ท่านแจ้งมานะคะ❤️
                </strong>
              </li>
            </ul>
          )}
        </Col>
      </Row>

      <hr className="my-4" />

      <footer>
        <Row className="justify-content-end">
          <Col className="form-button-container" xs="auto">
            <Button
              className="form-button mx-3"
              variant="outline-success"
              onClick={onBack}
            >
              ย้อนกลับ
            </Button>
            <Button
              className="form-button"
              variant="success"
              onClick={handleOpenModal}
            >
              ส่ง
            </Button>
          </Col>
        </Row>
      </footer>

      <AlertModal
        show={showModal}
        onBack={() => {
          setShowModal(false);
        }}
        onSuccess={() => {
          window.location.reload();
          onBack();
          setShowModal(false);
        }}
        onConfirm={
          success
            ? () => {
                onBack();
                setShowModal(false);
              }
            : handleConfirm
        }
        message={modalMessage}
        success={success}
      />
    </Form>
  );
};

export default Summary;
