import React, { useState, useEffect } from "react";
import {
  calculatePrice,
  calculateTextColorPercentage,
} from "../data/calculatePrint";
import { Col, Row, Form, Button, Alert } from "react-bootstrap";
import TextInput from "./textInput";
import TextSelect from "./textSelect";
import FileInput from "./fileInput";
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

  useEffect(() => {
    const fetchPrice = async () => {
      // Only proceed if valid data exists
      if (
        selectedFile &&
        selectTypePrint &&
        isValidNumber(pagePrint) &&
        isValidNumber(copiesSetPrint)
      ) {
        const price = await calculatePrice(
          selectedFile,
          selectTypePrint,
          pagePrint
        );
        setTotalPrice(price);

        const colorPercentage = await calculateTextColorPercentage(
          selectedFile,
          1
        ); // Example pageNum as 1
        setTextColorPercentage(colorPercentage);
      }
    };

    fetchPrice();
  }, [selectedFile, selectTypePrint, pagePrint, copiesSetPrint]);

  // Helper function to check if a value is a valid number
  const isValidNumber = (value: string) => {
    const parsedValue = parseInt(value, 10);
    return !isNaN(parsedValue) && parsedValue > 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
  };

  return (
    <div className="form-container mx-auto mt-1">
      <Form onSubmit={handleSubmit}>
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
              value={selectTypePrint}
              onChange={(value) => setSelectTypePrint(value)}
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
          <Button variant="success" type="submit" className="w-50">
            ส่ง
          </Button>
        </footer>
      </Form>
    </div>
  );
};

export default Print;
