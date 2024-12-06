//resultDelivery.tsx
import React from "react";
import { Button, Row, Col, Form } from "react-bootstrap";
import { calculateDelivery } from "../../data/calculateDelivery";
// import { db } from "../../../firebaseConfig";
// import { collection, addDoc } from "firebase/firestore";
// import AlertModal from "../textFillComponent/alertModal";

interface ResultDeliveryProps {
  deliveryType: string;
  senderInfo: {
    username: string;
    contactNumber: string;
    ownerData: string;
    dormitory: string;
    soi: string;
    houseNo: string;
    villageNo: string;
    subDistrict: string;
    district: string;
    province: string;
    postalCode: string;
    selectedFilePath: string;
  };
  receiverInfo: {
    username: string;
    contactNumber: string;
    dormitory: string;
    soi: string;
    houseNo: string;
    villageNo: string;
    subDistrict: string;
    district: string;
    province: string;
    postalCode: string;
  };
  vehicleInfo?: {
    carType: string;
    ccSize: number;
    registrationBookFilePath?: string | null;
    idCardFilePath?: string | null;
  };
  onBack: () => void;
}

const ResultDelivery: React.FC<ResultDeliveryProps> = ({
  deliveryType,
  senderInfo,
  receiverInfo,
  vehicleInfo,
  onBack,
}) => {
  const deliveryCost =
    vehicleInfo && deliveryType === "ส่งรถกลับบ้าน"
      ? calculateDelivery(receiverInfo.province, vehicleInfo.ccSize)
      : null;

  //   const [showModal, setShowModal] = useState(false);
  //   const [modalMessage, setModalMessage] = useState("");
  //   const [success, setSuccess] = useState(false);

  // //   const handleConfirm = async () => {
  // //     try {
  // //       const formData = new FormData();
  // //       if (selectedRegistrationBookFile) {
  // //         formData.append("registrationBookFile", selectedRegistrationBookFile);
  // //       }
  // //       if (selectedLicenseFile) {
  // //         formData.append("licenseFile", selectedLicenseFile);
  // //       }

  // //       const response = await fetch("http://localhost:3000/upload-multiple", {
  // //         method: "POST",
  // //         body: formData,
  // //       });

  // //       if (!response.ok) {
  // //         const errorData = await response.json();
  // //         console.error("Upload error details:", errorData);
  // //         throw new Error("Failed to upload files to server");
  // //       }

  // //       const responseData = await response.json();

  // //       // ตรวจสอบว่า responseData มีค่าที่ต้องการ
  // //       if (!responseData.registrationBookFile || !responseData.licenseFile) {
  // //         throw new Error("Response data missing required files");
  // //       }

  // //       const { registrationBookFile, licenseFile } = responseData;

  // //       console.log("Files uploaded successfully:", {
  // //         registrationBookFile,
  // //         licenseFile,
  // //       });

  // //       const data = {
  // //         ownerData: ownerData || "",
  // //         usernameData: usernameData || "",
  // //         selectedProvince: selectedProvince || "",
  // //         engineSize: engineSize || "0",
  // //         contactNumber: contactNumber || "",
  // //         registrationNumber: registrationNumber || "",
  // //         registrationDate: registrationDate ? registrationDate : new Date(),
  // //         expirationDate: expirationDate ? expirationDate : new Date(),
  // //         latestTaxPaymentDate: latestTaxPaymentDate
  // //           ? latestTaxPaymentDate
  // //           : new Date(),
  // //         bikeTypeOrDoorCount: bikeTypeOrDoorCount || "",
  // //         selectedCarType: selectedCarType || "",
  // //         totalCost: totalCost || 0,
  // //         prbCost: prbCost || 0,
  // //         taxCost: taxCost || 0,
  // //         lateFee: lateFee || 0,
  // //         inspectionCost: inspectionCost || 0,
  // //         processingCost: processingCost || 0,
  // //         carAge: carAge || { years: 0, months: 0, days: 0 },
  // //         CCorWeight: CCorWeight || "",
  // //         carOrMotorcycleLabel: carOrMotorcycleLabel || "",
  // //         selectedRadio: selectedRadio || "",
  // //       };

  // //       const updatedData = {
  // //         usernameData: data.usernameData,
  // //         province: data.selectedProvince,
  // //         vehicleType: data.selectedCarType,
  // //         bikeTypeOrDoorCount: data.bikeTypeOrDoorCount,
  // //         weightOrCC: data.CCorWeight,
  // //         engineSize: data.engineSize,
  // //         registrationDate: formatDate(data.registrationDate),
  // //         expirationDate: formatDate(data.expirationDate), // formatDate only to show on UI, not here
  // //         latestTaxPaymentDate: formatDate(data.latestTaxPaymentDate),
  // //         vehicleAge: data.carAge,
  // //         contactNumber: data.contactNumber,
  // //         ownerData: data.ownerData,
  // //         prbCost: data.prbCost,
  // //         registrationNumber: data.registrationNumber,
  // //         taxCost: data.taxCost,
  // //         lateFee: data.lateFee,
  // //         inspectionCost: data.inspectionCost,
  // //         processingCost: data.processingCost,
  // //         totalCost: data.totalCost,
  // //         CCorWeight: data.CCorWeight,
  // //         carOrMotorcycleLabel: data.carOrMotorcycleLabel,
  // //         selectedRadio: data.selectedRadio,
  // //         registrationBookFilePath: registrationBookFile.filePath,
  // //         registrationBookStoredFileName: registrationBookFile.storedFileName,
  // //         licensePlateFilePath: licenseFile.filePath,
  // //         licensePlateStoredFileName: licenseFile.storedFileName,
  // //       };

  // //       const docRef = await addDoc(collection(db, "delivery"), updatedData);
  // //       console.log("Document written with ID: ", docRef.id);

  // //       setModalMessage(
  // //         `ข้อมูลถูกส่งสำเร็จแล้ว! ✅\nขอขอบพระคุณที่ใช้บริการกับทางเราตลอดไป 🙏❤️ \n📢สักครู่หลังจากชำระเงินแล้ว \nท่านจะได้รับข้อความ SMS ยืนยัน \nความคุ้มครองฯพ.ร.บ.ไปยังหมายเลขโทรศัพท์ที่ท่านแจ้งมานะคะ❤️`
  // //       );
  // //       setSuccess(true);
  // //     } catch (error) {
  // //       console.error("Error uploading file or saving data:", error);
  // //       setModalMessage("การส่งข้อมูลล้มเหลว กรุณาลองอีกครั้ง");
  // //       setSuccess(false);
  // //     } finally {
  // //       setShowModal(true);
  // //     }
  // //   };

  //   const handleOpenModal = () => {
  //     setModalMessage("คุณต้องการยืนยันว่า\nข้อมูลทั้งหมดถูกต้องใช่ไหม?");
  //     setSuccess(false);
  //     setShowModal(true);
  //   };

  return (
    <div>
      <Form>
        <Row className="mb-4">
          {/* ผู้ส่ง */}
          <Col md={6}>
            <h4 className="text-success">✅ ผู้ส่ง</h4>
            <ul className="list-unstyled">
              <li className="mb-1">
                <strong>ชื่อ-นามสกุล:</strong> {senderInfo.username}
              </li>
              <li className="mb-1">
                <strong>หมายเลขโทรศัพท์:</strong> {senderInfo.contactNumber}
              </li>
              <li className="mb-1">
                <strong>
                  {senderInfo.ownerData.includes("@")
                    ? "พาสปอร์ต"
                    : "เลขบัตรประชาชน"}
                  :
                </strong>{" "}
                {senderInfo.ownerData}
              </li>
              <li className="mb-1">
                <strong>บ้านเลขที่:</strong> {senderInfo.houseNo}
              </li>
              <li className="mb-1">
                <strong>หมู่:</strong> {senderInfo.villageNo}
              </li>
              <li className="mb-1">
                <strong>หอพัก:</strong> {senderInfo.dormitory}
              </li>
              <li className="mb-1">
                <strong>ซอย:</strong> {senderInfo.soi}
              </li>
              <li className="mb-1">
                <strong>ตำบล/แขวง:</strong> {senderInfo.subDistrict}
              </li>
              <li className="mb-1">
                <strong>อำเภอ/เขต:</strong> {senderInfo.district}
              </li>
              <li className="mb-1">
                <strong>จังหวัด:</strong> {senderInfo.province}
              </li>
              <li className="mb-1">
                <strong>รหัสไปรษณีย์:</strong> {senderInfo.postalCode}
              </li>
            </ul>
          </Col>

          {/* ผู้รับ */}
          <Col md={6}>
            <h4 className="text-success">✅ ผู้รับ</h4>
            <ul className="list-unstyled">
              <li className="mb-1">
                <strong>ชื่อ-นามสกุล:</strong> {receiverInfo.username}
              </li>
              <li className="mb-1">
                <strong>หมายเลขโทรศัพท์:</strong> {receiverInfo.contactNumber}
              </li>
              <li className="mb-1">
                <strong>บ้านเลขที่:</strong> {receiverInfo.houseNo}
              </li>
              <li className="mb-1">
                <strong>หมู่:</strong> {receiverInfo.villageNo}
              </li>
              <li className="mb-1">
                <strong>หอพัก:</strong> {receiverInfo.dormitory}
              </li>
              <li className="mb-1">
                <strong>ซอย:</strong> {receiverInfo.soi}
              </li>
              <li className="mb-1">
                <strong>ตำบล/แขวง:</strong> {receiverInfo.subDistrict}
              </li>
              <li className="mb-1">
                <strong>อำเภอ/เขต:</strong> {receiverInfo.district}
              </li>
              <li className="mb-1">
                <strong>จังหวัด:</strong> {receiverInfo.province}
              </li>
              <li className="mb-1">
                <strong>รหัสไปรษณีย์:</strong> {receiverInfo.postalCode}
              </li>
            </ul>
          </Col>
        </Row>

        {deliveryType === "ส่งรถกลับบ้าน" && vehicleInfo && (
          <Row className="mb-4">
            <Col>
              <h4 className="text-success">🏍️ ข้อมูลรถที่ส่ง</h4>
              <ul className="list-unstyled">
                <li className="mb-1">
                  <strong>ประเภทรถจักรยานยนต์:</strong> {vehicleInfo.carType}
                </li>
                <li className="mb-1">
                  <strong>ขนาดความจุ CC:</strong> {vehicleInfo.ccSize}
                </li>
                <li className="mb-1">
                  <strong>ราคาการส่งรถ:</strong>{" "}
                  {`${deliveryCost?.toLocaleString()} บาท`}
                </li>
              </ul>
            </Col>
          </Row>
        )}

        <footer>
          <Row className="mb-2 ">
            <Col className="form-button-container">
              <Button
                variant="outline-success"
                onClick={onBack}
                className="form-button mx-3"
              >
                ย้อนกลับ
              </Button>
              <Button className="form-button" variant="success">ยืนยัน</Button>
            </Col>
          </Row>
        </footer>
        {/* <AlertModal
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
              : (handleConfirm)
          }
          message={modalMessage}
          success={success}
        /> */}
      </Form>
    </div>
  );
};

export default ResultDelivery;
