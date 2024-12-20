import React, { useState, ReactNode } from "react";
import { calculatePrice } from "../data/calculatePrint";
import {
  Col,
  Row,
  Form,
  Button,
  Alert,
  Modal,
  Spinner,
  Image,
} from "react-bootstrap";
import TextInput from "./textFillComponent/textInput";
import TextSelect from "./textFillComponent/textSelect";
import FileInput from "./textFillComponent/fileInput";
import AlertModal from "./textFillComponent/alertModal";
import QRCodeImage from "../data/QRcodeClean.png";
import { db } from "../../firebaseConfig";
import { collection, addDoc } from "firebase/firestore";
import "@fortawesome/fontawesome-free/css/all.min.css";
import dayjs from "dayjs";
import "dayjs/locale/th";
import { FaCheckCircle, FaExclamationTriangle } from "react-icons/fa";
import { VscError } from "react-icons/vsc";
import ScrollToTopAndBottomButton from "./ScrollToTopAndBottomButton";

// print.tsx
const Print: React.FC = () => {
  const [currentPage, setCurrentPage] = useState("form");
  const [selectTypePrint, setSelectTypePrint] = useState<string | null>(null);
  const [pagePrint, setPagePrint] = useState<number>(0); // Page count as string
  const [copiesSetPrint, setCopiesSetPrint] = useState<string>(""); // Copies count as string
  const [selectedPrintFile, setSelectedPrintFile] = useState<File | null>(null); // Selected file
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [totalCost, setTotalCost] = useState<number>(0);
  const [textColorPercentage, setTextColorPercentage] = useState<number | null>(
    null
  );
  const [selectedSlipQRcodeFile, setSelectedSlipQRcodeFile] =
    useState<File | null>(null);

  const [isCalculating, setIsCalculating] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState<ReactNode>(null);
  const [success, setSuccess] = useState(false);
  const [isError, setIsError] = useState(false);
  const [isInvalid, setIsInvalid] = useState(false);

  const [resetFileInput, setResetFileInput] = useState(false);
  const [keepSettings, setKeepSettings] = useState(false);

  const [lastCalculated, setLastCalculated] = useState({
    selectTypePrint: "",
    copiesSetPrint: "",
    fileName: "",
  });

  const resetForm = () => {
    if (!keepSettings) {
      setCopiesSetPrint("");
      setSelectTypePrint(null);
    }

    setPagePrint(0);
    setSelectedPrintFile(null);
    setIsSubmitted(false);
    setTotalCost(0);
    setTextColorPercentage(null);
    setSelectedSlipQRcodeFile(null);
    setTimeout(() => setResetFileInput(false), 0);
  };

  // useEffect(() => {
  //   // เมื่อ showModal เป็น false เราจะปิด Modal จริงๆ
  //   if (totalCost > 0 && !showModal) {
  //     setModalMessage(
  //       <div className="d-flex flex-column align-items-center text-center">
  //         <FaExclamationTriangle className="text-warning my-3" size={50} />
  //         <p className="px-2">
  //           คุณต้องการยืนยันว่า
  //           <br />
  //           ข้อมูลทั้งหมดถูกต้องใช่ไหม?
  //         </p>
  //       </div>
  //     );

  //     // setShowModal(true);
  //   }
  // }, [totalCost, textColorPercentage, showModal]);
  // // Helper function to check if a value is a valid number

  const isValidNumber = (value: string) => {
    const parsedValue = parseInt(value, 10);
    return !isNaN(parsedValue) && parsedValue > 0;
  };

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

  const downloadQRCode = () => {
    const link = document.createElement("a");
    link.href = QRCodeImage; // URL ของรูปภาพ QR Code
    link.download = "QRCode.png"; // ชื่อไฟล์ที่จะดาวน์โหลด
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // ฟังก์ชันสำหรับยืนยันการส่งข้อมูล
  const handleSubmitData = async () => {
    setIsSubmitting(true);
    try {
      // อัปโหลดไฟล์ไปที่เซิร์ฟเวอร์
      const formData = new FormData();
      if (selectedPrintFile) {
        formData.append("printFile", selectedPrintFile);
      }
      if (selectedSlipQRcodeFile) {
        formData.append("printSlipQRcode", selectedSlipQRcodeFile);
      }

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
        throw new Error("Failed to upload file to server");
      }

      const responseData = await response.json();

      if (
        !responseData.print ||
        !responseData.print.printFile ||
        !responseData.print.printSlipQRcode
      ) {
        throw new Error("Response data missing required files");
      }
      const { printFile, printSlipQRcode } = responseData.print;

      // console.log("File uploaded successfully:", printFile);

      const uploadTime = dayjs().toISOString();

      const data = {
        fileName: selectedPrintFile?.name ?? "ยังไม่ได้เลือกไฟล์", // ชื่อไฟล์ต้นฉบับ
        fileType: selectedPrintFile?.type ?? "ไม่ทราบประเภทไฟล์", // ประเภทไฟล์
        numPages: pagePrint, // จำนวนหน้า
        numCopies: parseInt(copiesSetPrint, 10), // จำนวนชุดที่ปริ้น
        colorType: selectTypePrint ?? "ไม่ระบุ", // ประเภทการปริ้น (สี/ขาวดำ)
        totalCost, // ราคาทั้งหมด
        uploadTime,
        printStoredFileName: printFile.storedFileName, // ชื่อไฟล์ที่เซิร์ฟเวอร์จัดเก็บ
        printFilePath: printFile.filePath, // URL สำหรับไฟล์ที่เซิร์ฟเวอร์
        printSlipQRcodeFileName: printSlipQRcode.storedFileName, // ชื่อไฟล์ที่เซิร์ฟเวอร์จัดเก็บ
        printSlipQRcodeFilePath: printSlipQRcode.filePath, // URL สำหรับไฟล์ที่เซิร์ฟเวอร์
        status: "อยู่ระหว่างดำเนินการ",
      };

      // ส่งข้อมูลไปที่ Firebase
      await addDoc(collection(db, "uploads"), data);
      // console.log("Document written with ID: ", docRef.id);

      setModalMessage(
        <div className="d-flex flex-column align-items-center text-center">
          <FaCheckCircle className="text-success my-3" size={50} />
          <p className="px-2">
            ข้อมูลถูกส่งสำเร็จแล้ว! ✅<br />
            ขอขอบพระคุณที่ใช้บริการกับทางเราตลอดไป 🙏❤️
          </p>
        </div>
      );
      setSuccess(true);
    } catch (error) {
      console.error("Error during submission:", error);

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

  // const onBack = () => {
  //   // console.log("onBack called");
  //   setTotalCost(0);
  //   setTextColorPercentage(null);
  //   setShowModal(false);
  // };

  const handleNext = async () => {
    if (
      !selectTypePrint ||
      !isValidNumber(copiesSetPrint) ||
      !selectedPrintFile
    ) {
      setIsSubmitted(true);
      return;
    }

    if (
      lastCalculated.selectTypePrint === selectTypePrint &&
      lastCalculated.copiesSetPrint === copiesSetPrint &&
      lastCalculated.fileName === selectedPrintFile.name
    ) {
      setCurrentPage("summary");
      return; // ไม่ต้องคำนวณใหม่ ใช้ค่าเดิม
    }

    setIsCalculating(true);
    try {
      const { totalPrice, pageCount } = await calculatePrice(
        selectTypePrint,
        copiesSetPrint,
        selectedPrintFile
      );
      setTotalCost(totalPrice);
      setTextColorPercentage(textColorPercentage);
      setPagePrint(pageCount);

      setLastCalculated({
        selectTypePrint: selectTypePrint,
        copiesSetPrint: copiesSetPrint,
        fileName: selectedPrintFile.name,
      });
    } catch (error) {
      console.error("Error during submission: ", error);
      setModalMessage("การคำนวณข้อมูลล้มเหลว กรุณาลองอีกครั้ง");
      setSuccess(false);
      setShowModal(true);
    } finally {
      setIsCalculating(false);
      setCurrentPage("summary");
    }
  };

  const handleBack = () => {
    setCurrentPage("form");
    setIsCalculating(false);
  };

  if (currentPage === "summary") {
    return (
      <div className="form-container mx-auto mt-1">
        <Row>
          <Col>
            <h5 className="text-center my-3">
              🙏⭐ขออนุญาตแจ้งยอดค่าใช้จ่ายรวมทั้งสิ้น: {totalCost} บาทค่ะ
            </h5>

            <Col className="text-center">
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
              <Col className=" mb-3">
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
          </Col>
        </Row>

        <hr className="mb-4" />
        <footer className="d-flex justify-content-center mt-4">
          <Col className="form-button-container" xs="auto">
            <Button
              variant="outline-success"
              onClick={handleBack}
              className="form-button mx-3"
            >
              ย้อนกลับ
            </Button>
            <Button
              variant="success"
              onClick={handleOpenModal}
              className="form-button"
            >
              ส่ง
            </Button>
          </Col>
        </footer>

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

        <AlertModal
          show={showModal}
          onBack={() => {
            // console.log("Cancel clicked, closing modal...");
            setShowModal(false);
            // onBack();
          }}
          onSuccess={() => {
            // console.log("Cancel clicked, closing modal...");
            // window.location.reload();
            resetForm();
            setCurrentPage("form");
            setSuccess(false);
            setShowModal(false);
          }}
          onConfirm={handleSubmitData}
          message={modalMessage}
          success={success}
          isError={isError}
        />
      </div>
    );
  }

  return (
    <div className="form-container mx-auto mt-1">
      <Form onSubmit={handleNext}>
        <h2 className="text-center mb-4 text-success">ระบบปริ้นเอกสาร</h2>

        {/* Alert */}
        <Alert variant="success" className="d-flex align-items-center mb-4">
          <i className="fas fa-exclamation-triangle me-2"></i>
          <span>กรุณาอ่านและกรอกข้อมูลให้ครบถ้วนก่อนส่ง</span>
        </Alert>

        {/* Instructions */}
        <ul className="list-unstyled mb-4">
          <li>
            <strong>1. ปริ้นขาวดำ 1-4 แผ่น: แผ่นละ 5 บาท</strong>
          </li>
          <li>
            <strong>2. ปริ้นขาวดำครั้งละ 5 แผ่นขึ้นไป: แผ่นละ 1 บาท</strong>
          </li>
          <li>
            <strong>
              3. ปริ้นสี: ราคาขึ้นอยู่กับสัดส่วนสี เริ่มต้นที่แผ่นละ 5 บาท
            </strong>
          </li>
          <li>
            <strong>4. หลังจากชำระเงินแล้ว ให้ลูกค้าส่งไฟล์มาได้เลย</strong>
          </li>
          <li>
            <strong>
              5. ส่งไฟล์: PDF, JPG หรือ PNG เท่านั้น (ไม่รับไฟล์อื่นและ Google
              drive)
            </strong>
          </li>
          <li>
            <strong>6. รับที่ร้านเท่านั้น</strong>
          </li>
        </ul>

        {/* Form Fields */}
        <Row className="mb-3">
          <Col xs={12} md={6} className="mb-3">
            <TextSelect
              label="ประเภทการปริ้น"
              id="selectTypePrint"
              options={[
                { label: "สี", value: "สี" },
                { label: "ขาวดำ", value: "ขาวดำ" },
              ]}
              placeholder="สี/ขาวดำ"
              value={selectTypePrint || ""}
              onChange={(value) => {
                // console.log("Selected Type Print:", value);
                setSelectTypePrint(value);
              }}
              required
              isInvalid={isSubmitted && !selectTypePrint}
              alertText="กรุณาเลือกประเภทการปริ้น"
            />
          </Col>

          {/* <Col xs={6} md={6} className="mb-3">
            <TextInput
              label="จำนวนหน้าเอกสาร"
              id="pagePrint"
              type="numeric"
              inputMode="numeric"
              value={pagePrint}
              onChange={(e) => setPagePrint(e.target.value)}
              placeholder="กรอกจำนวนหน้า"
              required
              isInvalid={isSubmitted && !isValidNumber(pagePrint)}
              alertText="กรุณากรอกจำนวนหน้าให้ถูกต้อง"
            />
          </Col> */}

          <Col xs={12} md={6} xl={6} lg={6} className="mb-3">
            <TextInput
              label="จำนวนชุดที่ต้องการปริ้น"
              id="copiesSetPrint"
              type="numeric"
              inputMode="numeric"
              value={copiesSetPrint}
              onChange={(e) => setCopiesSetPrint(e.target.value)}
              placeholder="กรอกจำนวนชุด"
              required
              isInvalid={isSubmitted && !isValidNumber(copiesSetPrint)}
              alertText="กรุณากรอกจำนวนชุดให้ถูกต้อง"
            />
          </Col>
          <Col xl={12} lg={12} className="mb-3">
            <FileInput
              label="อัปโหลดไฟล์ (รองรับ .pdf, .png, .jpg)"
              onFileSelect={(file) => setSelectedPrintFile(file)}
              accept=".pdf, .jpg, .png"
              isInvalid={isSubmitted && !selectedPrintFile}
              alertText="กรุณาเลือกไฟล์ที่ต้องการปริ้นหรือเลือกไฟล์ใหม่อีกครั้ง"
              initialFile={selectedPrintFile}
              reset={resetFileInput}
            />
          </Col>
        </Row>

        {/* Display Price */}
        {/* <Row>
          <Col className="text-center">
            <h4>รวมค่าใช้จ่าย: {totalCost} บาท</h4>
            {<p>เปอร์เซ็นต์ของสีในเอกสาร: {textColorPercentage}%</p>}
          </Col>
        </Row> */}
        <Form.Check
          type="checkbox"
          label="คงการตั้งค่าเดิมไว้"
          id="checkbox"
          checked={keepSettings}
          onChange={(e) => setKeepSettings(e.target.checked)}
          className="custom-checkbox-pdpa mb-4"
        />

        <hr className="mb-4" />

        <footer className="d-flex justify-content-center">
          <Button variant="success" onClick={handleNext} className="w-50">
            ถัดไป
          </Button>
        </footer>

        {/* Loader Modal */}
        <Modal show={isCalculating} centered>
          <Modal.Body className="text-center">
            <Spinner
              animation="border"
              variant="success"
              role="status"
              className="my-3"
            />
            <p>กำลังประมวลผล...</p>
          </Modal.Body>
        </Modal>
      </Form>
      <ScrollToTopAndBottomButton />
    </div>
  );
};

export default Print;
