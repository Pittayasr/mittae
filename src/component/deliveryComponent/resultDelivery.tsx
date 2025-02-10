//resultDelivery.tsx
import React, { useState, ReactNode } from "react";
import { Button, Row, Col, Form, Modal, Image, Spinner } from "react-bootstrap";
import { Viewer } from "@react-pdf-viewer/core";
import "@react-pdf-viewer/core/lib/styles/index.css";
import { calculateDelivery } from "../../data/calculateDelivery";
import { db } from "../../../firebaseConfig";
import { collection, addDoc } from "firebase/firestore";
import AlertModal from "../textFillComponent/alertModal";
import dayjs from "dayjs";
import "dayjs/locale/th";
import { FaCheckCircle, FaExclamationTriangle } from "react-icons/fa";
import { VscError } from "react-icons/vsc";
import { useLiffAuth } from "../../component/lineLiffAuthContext";

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
    selectedFilePath: File | null;
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
    packageDetail: string;
  };
  vehicleInfo?: {
    carType: string;
    ccSize: number;
    registrationBookFilePath?: File | null;
    idCardFilePath?: File | null;
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
  const [showPhotoModal, setShowPhotoModal] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [fileType, setFileType] = useState<string | null>(null);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const deliveryCost =
    vehicleInfo && deliveryType === "ส่งรถกลับบ้าน"
      ? calculateDelivery(receiverInfo.province, vehicleInfo.ccSize)
      : null;

  // const handleShowPreview = (file: File | null) => {
  //   if (file) {
  //     const previewUrl = URL.createObjectURL(file); // สร้าง URL ของไฟล์
  //     setPreviewUrl(previewUrl);
  //     setFileType(file.type); // ระบุประเภทไฟล์
  //     setShowPhotoModal(true);
  //   }
  // };

  const handleCloseModal = () => {
    setShowPhotoModal(false);
    setPreviewUrl(null);
    setFileType(null);
  };

  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState<ReactNode>(null);
  const [success, setSuccess] = useState(false);

  const { userId } = useLiffAuth();

  //resultDelivery.tsx
  const handleConfirm = async () => {
    setIsSubmitting(true);
    try {
      const formData = new FormData();

      // เพิ่มไฟล์สำหรับ Delivery
      if (senderInfo.selectedFilePath) {
        formData.append("passportOrIDnumberFile", senderInfo.selectedFilePath);
      }
      if (vehicleInfo?.registrationBookFilePath) {
        formData.append(
          "registrationBookFileDelivery",
          vehicleInfo.registrationBookFilePath
        );
      }
      if (vehicleInfo?.idCardFilePath) {
        formData.append("licenseFileDelivery", vehicleInfo.idCardFilePath);
      }

      // เพิ่มประเภท request
      formData.append("type", "Delivery");
      formData.append("selectDeliveryType", deliveryType);

      const response = await fetch(
        "https://api.mittaemaefahlung88.com/upload-multiple",
        {
          method: "POST",
          body: formData,
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Upload error details:", errorData);
        throw new Error(errorData.error || "Failed to upload files to server");
      }

      const responseData = await response.json();

      const getFileData = (
        key: string
      ): { storedFileName: string | null; filePath: string | null } | null => {
        const file = responseData.delivery?.[key];
        return file
          ? {
              storedFileName: file.storedFileName || null,
              filePath: file.filePath || null,
            }
          : null;
      };

      const uploadTime = dayjs().toISOString();

      // สร้างข้อมูลสำหรับ Firestore
      const data = {
        deliveryType,
        senderInfo: {
          username: senderInfo.username,
          contactNumber: senderInfo.contactNumber,
          ownerData: senderInfo.ownerData,
          dormitory: senderInfo.dormitory,
          soi: senderInfo.soi,
          houseNo: senderInfo.houseNo,
          villageNo: senderInfo.villageNo,
          subDistrict: senderInfo.subDistrict,
          district: senderInfo.district,
          province: senderInfo.province,
          postalCode: senderInfo.postalCode,
          passportOrIDnumberFile: getFileData("passportOrIDnumberFile"),
        },
        receiverInfo: {
          username: receiverInfo.username,
          contactNumber: receiverInfo.contactNumber,
          dormitory: receiverInfo.dormitory,
          soi: receiverInfo.soi,
          houseNo: receiverInfo.houseNo,
          villageNo: receiverInfo.villageNo,
          subDistrict: receiverInfo.subDistrict,
          district: receiverInfo.district,
          province: receiverInfo.province,
          postalCode: receiverInfo.postalCode,
          packageDetail: receiverInfo.packageDetail,
        },
        vehicleInfo:
          deliveryType === "ส่งรถกลับบ้าน" && vehicleInfo
            ? {
                carType: vehicleInfo.carType,
                ccSize: vehicleInfo.ccSize,
                registrationBookFileDelivery: getFileData(
                  "registrationBookFileDelivery"
                ),
                licenseFileDelivery: getFileData("licenseFileDelivery"),
              }
            : null,
        deliveryCost: deliveryCost || 0,
        uploadTime,
        status: "อยู่ระหว่างดำเนินการ",
      };

      await addDoc(collection(db, "delivery"), data);

      setModalMessage(
        <div className="d-flex flex-column align-items-center text-center">
          <FaCheckCircle className="text-success my-3" size={50} />
          <p className="px-2">
            ข้อมูลถูกส่งสำเร็จแล้ว! ✅<br />
            ขอขอบพระคุณที่ใช้บริการกับทางเราตลอดไป 🙏❤️
          </p>
        </div>
      );

      const passportOrIDnumberFileData = getFileData("passportOrIDnumberFile");

      const imageMessages = [];

      // เพิ่มภาพจาก passportOrIDnumberFileTransport
      if (passportOrIDnumberFileData?.filePath) {
        imageMessages.push({
          type: "image",
          originalContentUrl: passportOrIDnumberFileData.filePath,
          previewImageUrl: passportOrIDnumberFileData.filePath,
        });
      }

      const message = [
        {
          type: "text",
          text: `🚛 รายละเอียดการส่ง:
👤 ผู้ส่ง: ${senderInfo.username}
📞 เบอร์ติดต่อ: ${senderInfo.contactNumber}
${senderInfo.ownerData.includes("@") ? "พาสปอร์ต" : "เลขบัตรประชาชน"}: ${
            senderInfo.ownerData
          }
📍 ที่อยู่: 
          บ้านเลขที่: ${senderInfo.houseNo}, หมู่: ${
            senderInfo.villageNo
          }, ซอย: ${senderInfo.soi}, ตำบล/แขวง: ${
            senderInfo.subDistrict
          }, อำเภอ/เขต: ${senderInfo.district}, จังหวัด: ${
            senderInfo.province
          }, รหัสไปรษณีย์: ${senderInfo.postalCode}
        
👤 ผู้รับ: ${receiverInfo.username}
📞 เบอร์ติดต่อ: ${receiverInfo.contactNumber}
📍 ที่อยู่:
          บ้านเลขที่: ${receiverInfo.houseNo}, หมู่: ${
            receiverInfo.villageNo
          }, ซอย: ${receiverInfo.soi}, ตำบล/แขวง: ${
            receiverInfo.subDistrict
          }, อำเภอ/เขต: ${receiverInfo.district}, จังหวัด: ${
            receiverInfo.province
          }, รหัสไปรษณีย์: ${receiverInfo.postalCode}`,
        },
        ...imageMessages,
      ];

      const payload = {
        type: "Delivery",
        message,
        userId: userId || "UNKNOWN_USER",
      };

      console.log("Payload being sent to /webhook:", payload);

      // เรียก /webhook เพื่อส่ง message
      const webhookResponse = await fetch(
        "https://api.mittaemaefahlung88.com/webhook",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );

      if (!webhookResponse.ok) {
        const errorMessage = await webhookResponse.text();
        console.error("Webhook Error:", errorMessage);
        throw new Error("Failed to send message to webhook");
      }

      console.log("Webhook message sent successfully");

      setSuccess(true);
      {
        /* ส่วนที่ส่งข้อความแจ้งข้อมูลรายละเอียดของผู้ส่งและผู้รับต่างๆ ที่แจ้งเหมือนใน Form พร้อมส่งรูปที่ดึงมาจากที่ผู้ใช้ส่งในเว็บของผมผ่าน Node.js ใน server.ts และแปลง locationTransport ที่มี latitude และ
          longitude ให้มันเป็น google map ที่กดไปแล้วเป็นพิกัดที่หมุดในนั้นเลยเพื่อให้คนส่งของใช้เพื่อส่งของ */
      }
    } catch (error) {
      console.error("Error uploading file or saving data:", error);
      setModalMessage(
        <div className="d-flex flex-column align-items-center text-center">
          <VscError className="text-danger my-3" size={50} />
          <p className="px-2">การส่งข้อมูลล้มเหลว กรุณาลองอีกครั้ง</p>
        </div>
      );
      setSuccess(false);
    } finally {
      setIsSubmitting(false);
      setShowModal(true);
    }
  };

  const handleOpenModal = () => {
    setModalMessage(
      <div className="d-flex flex-column align-items-center text-center">
        <FaExclamationTriangle className="text-warning my-3" size={50} />
        <p className="px-2">
          คุณต้องการยืนยันว่า
          <br />
          ข้อมูลทั้งหมดถูกต้องใช่ไหม?
        </p>
      </div>
    );

    setSuccess(false);
    setShowModal(true);
  };

  return (
    <div>
      <Form>
        <Row className="mb-4">
          {/* ผู้ส่ง */}
          <Col md={6}>
            <h4 className="text-success">✅ ผู้ส่ง</h4>
            <ul className="list-unstyled">
              <li className="my-3">
                <strong>ชื่อ-นามสกุล:</strong> {senderInfo.username}
              </li>
              <li className="my-3">
                <strong>หมายเลขโทรศัพท์:</strong> {senderInfo.contactNumber}
              </li>
              <li className="mt-3 mb-0">
                <strong>
                  {senderInfo.ownerData.includes("@")
                    ? "พาสปอร์ต"
                    : "เลขบัตรประชาชน"}
                  :
                </strong>{" "}
                {senderInfo.ownerData}
              </li>
              {/* <Button
                className="text-success px-0 py-0"
                variant="link"
                onClick={() =>
                  handleShowPreview(senderInfo.selectedFilePath || null)
                }
              >
                {senderInfo.ownerData.includes("@")
                  ? "ดูไฟล์สำเนาพาสปอร์ต"
                  : "ดูไฟล์สำเนาเลขบัตรประชาชน"}
              </Button> */}
              <li className="my-3">
                <strong>บ้านเลขที่:</strong> {senderInfo.houseNo}
              </li>
              <li className="my-3">
                <strong>หมู่:</strong> {senderInfo.villageNo}
              </li>
              <li className="my-3">
                <strong>หอพัก:</strong> {senderInfo.dormitory}
              </li>
              <li className="my-3">
                <strong>ซอย:</strong> {senderInfo.soi}
              </li>
              <li className="my-3">
                <strong>ตำบล/แขวง:</strong> {senderInfo.subDistrict}
              </li>
              <li className="my-3">
                <strong>อำเภอ/เขต:</strong> {senderInfo.district}
              </li>
              <li className="my-3">
                <strong>จังหวัด:</strong> {senderInfo.province}
              </li>
              <li className="my-3 mb-4">
                <strong>รหัสไปรษณีย์:</strong> {senderInfo.postalCode}
              </li>
            </ul>
          </Col>

          {/* ผู้รับ */}
          <Col md={6}>
            <h4 className="text-success">✅ ผู้รับ</h4>
            <ul className="list-unstyled">
              <li className="my-3">
                <strong>ชื่อ-นามสกุล:</strong> {receiverInfo.username}
              </li>
              <li className="my-3">
                <strong>หมายเลขโทรศัพท์:</strong> {receiverInfo.contactNumber}
              </li>
              <li className="my-3">
                <strong>บ้านเลขที่:</strong> {receiverInfo.houseNo}
              </li>
              <li className="my-3">
                <strong>หมู่:</strong> {receiverInfo.villageNo}
              </li>
              <li className="my-3">
                <strong>หอพัก:</strong> {receiverInfo.dormitory}
              </li>
              <li className="my-3">
                <strong>ซอย:</strong> {receiverInfo.soi}
              </li>
              <li className="my-3">
                <strong>ตำบล/แขวง:</strong> {receiverInfo.subDistrict}
              </li>
              <li className="my-3">
                <strong>อำเภอ/เขต:</strong> {receiverInfo.district}
              </li>
              <li className="my-3">
                <strong>จังหวัด:</strong> {receiverInfo.province}
              </li>
              <li className="my-3 ">
                <strong>รหัสไปรษณีย์:</strong> {receiverInfo.postalCode}
              </li>
            </ul>
          </Col>

          <p className="my-3">
            <strong>รายละเอียดสิ่งของที่ส่ง:</strong>{" "}
            {receiverInfo.packageDetail}
          </p>
        </Row>

        {deliveryType === "ส่งรถกลับบ้าน" && vehicleInfo && (
          <Row className="mb-4">
            <Col>
              <h4 className="text-success">🏍️ ข้อมูลรถที่ส่ง</h4>
              <ul className="list-unstyled">
                <li className="my-3">
                  <strong>ประเภทรถจักรยานยนต์:</strong> {vehicleInfo.carType}
                </li>
                <li className="my-3">
                  <strong>ขนาดความจุ CC:</strong> {vehicleInfo.ccSize}
                </li>
                {/* <li className="my-3">
                  <strong>ราคาการส่งรถ:</strong>{" "}
                  {`${deliveryCost?.toLocaleString()} บาท`}
                </li>
                <li className="my-3">
                  <strong>
                    *(ทั้งนี้ยังไม่รวมค่าประกันความเสียหาย,จัดส่งให้ถึงที่บ้านและค่าหุ้มห่อเพิ่มเติมอีกตามแต่ขนาดของรถแต่ละประเภทชนิด)*
                  </strong>
                </li> */}
                {/* <li>
                  <strong>ไฟล์สำเนาภาพเล่มทะเบียน:</strong>{" "}
                  <Button
                    className="text-success px-0 py-0"
                    variant="link"
                    onClick={() =>
                      handleShowPreview(
                        vehicleInfo.registrationBookFilePath || null
                      )
                    }
                  >
                    ดูไฟล์ตัวอย่าง
                  </Button>
                </li>
                <li>
                  <strong>ไฟล์สำเนาบัตรประชาชน:</strong>{" "}
                  <Button
                    className="text-success my-3 px-0 py-0"
                    variant="link"
                    onClick={() =>
                      handleShowPreview(vehicleInfo.idCardFilePath || null)
                    }
                  >
                    ดูไฟล์ตัวอย่าง
                  </Button>
                </li> */}
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
              <Button
                className="form-button"
                variant="success"
                onClick={handleOpenModal}
              >
                ยืนยัน
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
      {/* Modal แสดงตัวอย่างไฟล์ */}
      <Modal show={showPhotoModal} onHide={handleCloseModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>ตัวอย่างไฟล์</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {fileType === "application/pdf" ? (
            <div style={{ height: "500px" }}>
              <Viewer fileUrl={previewUrl || ""} />
            </div>
          ) : (
            <Image src={previewUrl || ""} alt="Preview" fluid />
          )}
        </Modal.Body>
      </Modal>
      <Modal show={isSubmitting} centered>
        <Modal.Body className="text-center">
          <Spinner
            animation="border"
            variant="success"
            role="status"
            className="my-3"
          />
          <p>กำลังส่งข้อมูล...</p>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default ResultDelivery;
