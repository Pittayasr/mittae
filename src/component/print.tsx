// print.tsx
import React, { useState } from "react";
import {
  calculatePrice,
  calculateFileColorPercentage,
} from "../data/calculatePrint";
import { Col, Row, Form, Button, Alert, Modal, Spinner } from "react-bootstrap";
import TextInput from "./textInput";
import TextSelect from "./textSelect";
import FileInput from "./fileInput";
import AlertModal from "./alertModal";
import { db } from "../../firebaseConfig";
import { collection, addDoc } from "firebase/firestore";
import "@fortawesome/fontawesome-free/css/all.min.css";

const Print: React.FC = () => {
  const [selectTypePrint, setSelectTypePrint] = useState<string | null>(null);
  const [pagePrint, setPagePrint] = useState<string>(""); // Page count as string
  const [copiesSetPrint, setCopiesSetPrint] = useState<string>(""); // Copies count as string
  const [selectedFile, setSelectedFile] = useState<File | null>(null); // Selected file
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [totalPrice, setTotalPrice] = useState<number>(0);
  const [textColorPercentage, setTextColorPercentage] = useState<number | null>(
    null
  );

  const [isCalculating, setIsCalculating] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [success, setSuccess] = useState(false);

  const handleOpenModal = () => {
    setModalMessage(
      `รวมค่าใช้จ่าย: ${totalPrice} บาท \nเปอร์เซ็นต์ของสีในเอกสาร: ${textColorPercentage} %\nคุณต้องการยืนยันว่า\nข้อมูลทั้งหมดถูกต้องใช่ไหม?`
    );
    setShowModal(true);
  };

  // useEffect(() => {
  //   const fetchPrice = async () => {
  //     // Only proceed if valid data exists

  //   };

  //   fetchPrice();
  // }, [selectedFile, selectTypePrint, pagePrint, copiesSetPrint]);

  // Helper function to check if a value is a valid number
  const isValidNumber = (value: string) => {
    const parsedValue = parseInt(value, 10);
    return !isNaN(parsedValue) && parsedValue > 0;
  };

  const handleConfirm = async () => {
    if (
      !selectTypePrint ||
      !isValidNumber(pagePrint) ||
      !isValidNumber(copiesSetPrint) ||
      !selectedFile
    ) {
      setIsSubmitted(true);
      return;
    }

    setIsCalculating(true);

    try {
      const price = await calculatePrice(
        selectTypePrint,
        pagePrint,
        copiesSetPrint,
        selectedFile
      );
      setTotalPrice(price);

      const colorPercentage = await calculateFileColorPercentage(selectedFile);
      setTextColorPercentage(colorPercentage);

      handleOpenModal(); // เรียกเปิดโมดัลที่แสดงข้อมูลรวมก่อน
    } catch (error) {
      console.error("Error during submission: ", error);
      setModalMessage("การส่งข้อมูลล้มเหลว กรุณาลองอีกครั้ง");
      setSuccess(false);
      setShowModal(true); // แสดงโมดัลผิดพลาด
    } finally {
      setIsCalculating(false); // Hide loader
    }
  };

  // ฟังก์ชันสำหรับยืนยันการส่งข้อมูล
  const handleSubmitData = async () => {
    try {
      const data = {
        typePrint: selectTypePrint,
        numPages: pagePrint,
        numSetPrint: copiesSetPrint,
        fileName: selectedFile?.name ?? "ยังไม่ได้เลือกไฟล์",
        price: totalPrice,
      };

      const docRef = await addDoc(collection(db, "print"), data);
      console.log("Document written with ID: ", docRef.id);

      setModalMessage(
        `ข้อมูลถูกส่งสำเร็จแล้ว! ✅\nขอขอบพระคุณที่ใช้บริการกับทางเราตลอดไป 🙏❤️`
      );
      setSuccess(true);
      setShowModal(true); // แสดงข้อความสำเร็จหลังส่งข้อมูล
    } catch (error) {
      console.error("Error during submission: ", error);
      setModalMessage("การส่งข้อมูลล้มเหลว กรุณาลองอีกครั้ง");
      setSuccess(false);
      setShowModal(true); // แสดงข้อความผิดพลาด
    }
  };

  const onBack = () => {
    setSelectTypePrint(null);
    setPagePrint("");
    setCopiesSetPrint("");
    setSelectedFile(null);
    setIsSubmitted(false);
    setTotalPrice(0);
    setTextColorPercentage(null);
    setShowModal(false);
  };

  return (
    <div className="form-container mx-auto mt-1">
      <Form onSubmit={handleConfirm}>
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
            <strong>5. ส่งไฟล์: PDF WORD JPG หรือ PNG เท่านั้น</strong>
          </li>
          <li>
            <strong>6. รับที่ร้านเท่านั้น</strong>
          </li>
        </ul>

        {/* Form Fields */}
        <Row className="mb-3">
          <Col xs={6} md={6} className="mb-3">
            <TextSelect
              label="ประเภทการปริ้น"
              id="selectTypePrint"
              options={["ขาวดำ", "สี"]}
              placeholder="สี/ขาวดำ"
              value={selectTypePrint || ""}
              onChange={(value) => {
                console.log("Selected Type Print:", value);
                setSelectTypePrint(value);
              }}
              required
              isInvalid={isSubmitted && !selectTypePrint}
              alertText="กรุณาเลือกประเภทการปริ้น"
            />
          </Col>

          <Col xs={6} md={6} className="mb-3">
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
          </Col>

          <Col xl={6} lg={12} className="mb-3">
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
          <Col xl={6} lg={12} className="mb-3">
            <FileInput onFileSelect={(file) => setSelectedFile(file)} />
          </Col>
        </Row>

        {/* Display Price */}
        <Row>
          <Col className="text-center">
            <h4>รวมค่าใช้จ่าย: {totalPrice} บาท</h4>
            {<p>เปอร์เซ็นต์ของสีในเอกสาร: {textColorPercentage}%</p>}
          </Col>
        </Row>

        <hr className="mb-4" />

        <footer className="d-flex justify-content-center">
          <Button variant="success" onClick={handleConfirm} className="w-50">
            ส่ง
          </Button>
        </footer>

        {/* Loader Modal */}
        <Modal show={isCalculating} centered>
          <Modal.Body className="text-center">
            <Spinner animation="border" role="status" className="mb-3" />
            <p>กำลังประมวลผล...</p>
          </Modal.Body>
        </Modal>

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
              : handleSubmitData
          }
          message={modalMessage}
          success={success}
        />
      </Form>
    </div>
  );
};

export default Print;
