// summary.tsx
import React, { useState, ReactNode } from "react";
import { Col, Row, Button, Form, Modal, Image, Spinner } from "react-bootstrap";
import dayjs from "dayjs";
import "dayjs/locale/th";
import { Viewer } from "@react-pdf-viewer/core";
import "@react-pdf-viewer/core/lib/styles/index.css";
import { db } from "../../../firebaseConfig";
import { collection, addDoc } from "firebase/firestore";
import AlertModal from "../textFillComponent/alertModal";
import FileInput from "../textFillComponent/fileInput";
import QRCodeImage from "../../data/QRcodeClean.png";

import { FaCheckCircle, FaExclamationTriangle } from "react-icons/fa";
import { VscError } from "react-icons/vsc";

const formatDate = (date: Date | null) => {
  if (!date) return "-";
  const formattedDate = dayjs(date).locale("th").format("D MMMM YYYY");
  const buddhistYear = dayjs(date).year() + 543;
  return formattedDate.replace(`${dayjs(date).year()}`, `${buddhistYear}`);
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
  selectedRegistrationBookFile: File | null;
  selectedLicenseFile: File | null;
  status: string;

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
  CCorWeight,
  carOrMotorcycleLabel,
  latestTaxPaymentDate,
  selectedRadio,
  bikeTypeOrDoorCount,
  selectedCarType,
  totalCost,
  prbCost,
  taxCost,
  lateFee,
  inspectionCost,
  processingCost,
  carAge,
  selectedRegistrationBookFile,
  selectedLicenseFile,

  onBack,
}) => {
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState<ReactNode>(null);
  const [success, setSuccess] = useState(false);
  const [isError, setIsError] = useState(false);
  const [isInvalid, setIsInvalid] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const [selectedSlipQRcodeFile, setSelectedSlipQRcodeFile] =
    useState<File | null>(null);

  const handleOpenModal = () => {
    if (!selectedSlipQRcodeFile) {
      setIsInvalid(true);
      return;
    }

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

    setIsError(false);
    setShowModal(true);
  };

  const [showPhotoModal, setShowPhotoModal] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [fileType, setFileType] = useState<string | null>(null);

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

  const downloadQRCode = () => {
    const link = document.createElement("a");
    link.href = QRCodeImage; // URL ของรูปภาพ QR Code
    link.download = "QRCode.png"; // ชื่อไฟล์ที่จะดาวน์โหลด
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleConfirm = async () => {
    setIsSubmitting(true);
    try {
      const formData = new FormData();
      if (selectedRegistrationBookFile) {
        formData.append("registrationBookFile", selectedRegistrationBookFile);
      }
      if (selectedLicenseFile) {
        formData.append("licensePlateFile", selectedLicenseFile);
      }
      if (selectedSlipQRcodeFile) {
        formData.append("formSlipQRcode", selectedSlipQRcodeFile);
      }
      // console.log("FormData content:", Array.from(formData.entries()));

      const response = await fetch("http://localhost:3000/upload-multiple", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Upload error details:", errorData);
        throw new Error("Failed to upload files to server");
      }

      const responseData = await response.json();

      // ตรวจสอบว่า responseData มีค่าที่ต้องการ
      if (
        !responseData.form ||
        !responseData.form.registrationBookFile ||
        !responseData.form.licensePlateFile ||
        !responseData.form.formSlipQRcode
      ) {
        throw new Error("Response data missing required files");
      }

      const { registrationBookFile, licensePlateFile, formSlipQRcode } =
        responseData.form;

      // console.log("Files uploaded successfully:", {
      //   registrationBookFile,
      //   licensePlateFile,
      // });

      const uploadTime = dayjs().toISOString();

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
        CCorWeight: CCorWeight || "",
        carOrMotorcycleLabel: carOrMotorcycleLabel || "",
        selectedRadio: selectedRadio || "",
      };

      const updatedData = {
        usernameData: data.usernameData,
        province: data.selectedProvince,
        vehicleType: data.selectedCarType,
        bikeTypeOrDoorCount: data.bikeTypeOrDoorCount,
        weightOrCC: data.CCorWeight,
        engineSize: data.engineSize,
        registrationDate: formatDate(data.registrationDate),
        expirationDate: formatDate(data.expirationDate),
        latestTaxPaymentDate: formatDate(data.latestTaxPaymentDate),
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
        CCorWeight: data.CCorWeight,
        carOrMotorcycleLabel: data.carOrMotorcycleLabel,
        selectedRadio: data.selectedRadio,
        registrationBookFilePath: registrationBookFile.filePath,
        registrationBookStoredFileName: registrationBookFile.storedFileName,
        licensePlateFilePath: licensePlateFile.filePath,
        licensePlateStoredFileName: licensePlateFile.storedFileName,
        formSlipQRcodeFilePath: formSlipQRcode.filePath,
        formSlipQRcodeFileFileName: formSlipQRcode.storedFileName,
        uploadTime,
        status: "อยู่ระหว่างดำเนินการ",
      };

      await addDoc(collection(db, "prbform"), updatedData);
      // console.log("Document written with ID: ", docRef.id);

      setModalMessage(
        <div className="d-flex flex-column align-items-center text-center">
          <FaCheckCircle className="text-success my-3" size={50} />
          <p className="px-2">
            ข้อมูลถูกส่งสำเร็จแล้ว! ✅<br />
            ขอขอบพระคุณที่ใช้บริการกับทางเราตลอดไป 🙏❤️
            <br />
            📢สักครู่หลังจากชำระเงินแล้ว <br />
            ท่านจะได้รับข้อความ SMS ยืนยัน
            <br />
            ความคุ้มครองฯพ.ร.บ.ไปยังหมายเลขโทรศัพท์ที่ท่านแจ้งมานะคะ❤️
          </p>
        </div>
      );
      setSuccess(true);
    } catch (error) {
      console.error("Error uploading file or saving data:", error);
      setModalMessage(
        <div className="d-flex flex-column align-items-center text-center">
          <VscError className="text-danger my-3" size={50} />
          <p className="px-2">การส่งข้อมูลล้มเหลว กรุณาลองอีกครั้ง</p>
        </div>
      );
      setIsError(true);
      setSuccess(false);
      setShowModal(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <Form onSubmit={handleOpenModal}>
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

          <Col xs={12} lg={6}>
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
              <ul className="list-unstyled">
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
                {/* <li>
                  <Button
                    className="text-success px-3 py-0"
                    variant="link"
                    onClick={() =>
                      handleShowPreview(selectedRegistrationBookFile || null)
                    }
                  >
                    ภาพสำเนาภาพเล่มทะเบียนรถที่เลือก
                  </Button>{" "}
                  <Button
                    className="text-success my-3 px-0 py-0"
                    variant="link"
                    onClick={() =>
                      handleShowPreview(selectedLicenseFile || null)
                    }
                  >
                    ภาพแผ่นป้ายทะเบียนรถที่เลือก
                  </Button>
                </li> */}

                <p className="mb-1">
                  <strong>
                    🙏⭐ขออนุญาตแจ้งยอดค่าใช้จ่ายรวมทั้งสิ้น:{" "}
                    {totalCost?.toFixed(2)} บาทค่ะ
                  </strong>
                </p>
                <p className="mb-1">
                  <strong>✅1.🎯รบกวนลูกค้าโอนเงินชำระเรียบร้อยแล้ว</strong>
                </p>
                <p className="mb-1">
                  <strong>
                    ✅2.💵แจ้งส่งสลิป🧾ยืนยันเพื่อให้ทางเราดำเนินการต่อไป🙏
                  </strong>
                </p>
                <p className="mb-1">
                  <strong>
                    ✅3.ท่านจะได้รับ📑พ.ร.บ.ทันทีเมื่อชำระเงินเรียบร้อย
                  </strong>
                </p>
                <p className="mb-4">
                  <strong>
                    ✅4.แอดมินจะดำเนินการแจ้งนัดหมายเข้าไปรับรถ(หากต้องมีการตรวจสภาพรถเอกชน
                    ตรอ)
                  </strong>
                </p>
                <p className="mb-1">
                  <strong>✅ขอขอบพระคุณที่ใช้บริการกับทางเราตลอดไป🙏❤️</strong>
                </p>
                <p className="mb-1">
                  <strong>
                    📢สักครู่หลังจากชำระเงินแล้วท่านจะได้รับข้อความSMSยืนยันความคุ้มครองฯพ.ร.บ.ไปยังหมายเลขโทรศัพท์ที่ท่านแจ้งมานะคะ❤️
                  </strong>
                </p>
              </ul>
            )}
          </Col>
          <Col xs={12} lg={6} className="text-center">
            <Image
              src={QRCodeImage}
              className="rounded mx-auto d-block img-fluid  "
              alt="QR Code Bank"
              width="170"
              height="250"
              style={{ maxWidth: "100%", height: "auto", maxHeight: "250px" }}
            />
            <Button
              className="text-success my-3 px-0 py-0"
              variant="link"
              onClick={downloadQRCode}
            >
              บันทึกภาพ QRcode
            </Button>
          </Col>
          <Col>
            <Col xs={12} lg={12} className="mb-3">
              <FileInput
                label="สลิปชำระเงิน (รองรับ .png, .jpg)"
                onFileSelect={(file) => setSelectedSlipQRcodeFile(file)}
                accept=".jpg, .png"
                isInvalid={isInvalid && !selectedSlipQRcodeFile}
                alertText="กรุณาเลือกไฟล์ที่ต้องการปริ้นหรือเลือกไฟล์ใหม่อีกครั้ง"
                initialFile={selectedSlipQRcodeFile}
              />
            </Col>
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
          isError={isError}
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
        <Modal.Body className="text-center ">
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

export default Summary;
