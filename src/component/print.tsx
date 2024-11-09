import React, { useState, useEffect } from "react";
import { Col, Row, Form, Button } from "react-bootstrap";
import TextInput from "./textInput";
import TextSelect from "./textSelect";
import "@fortawesome/fontawesome-free/css/all.min.css";

const Print: React.FC = () => {
  const [selectTypePrint, setSelectTypePrint] = useState<string | null>(null);
  const [pagePrint, setPagePrint] = useState<string>("");
  const [copiesSetPrint, setCopiesSetPrint] = useState<string>("");
  const [totalPrice, setTotalPrice] = useState<number>(0);

  useEffect(() => {
    // คำนวณจำนวนแผ่นทั้งหมด
    const pageCount = parseInt(pagePrint, 10) || 0;
    const copiesCount = parseInt(copiesSetPrint, 10) || 1;
    const totalPageCount = pageCount * copiesCount;

    let pricePerPage = 0;

    if (selectTypePrint === "ขาวดำ") {
      // ใช้เงื่อนไขใหม่ในการคำนวณราคา
      if (totalPageCount <= 4) {
        pricePerPage = 5;
      } else {
        pricePerPage = 1;
      }
    } else if (selectTypePrint === "สี") {
      pricePerPage = 5; // เริ่มต้นที่ 5 บาทสำหรับการปริ้นสี
    }

    setTotalPrice(pricePerPage * totalPageCount);
  }, [selectTypePrint, pagePrint, copiesSetPrint]);

  return (
    <div className="container mx-auto mt-1">
      <Form>
        <h2 className="text-center mb-4 text-primary">ระบบปริ้นเอกสาร</h2>

        {/* Alert */}
        <div className="alert alert-warning d-flex align-items-center mb-4">
          <i className="fas fa-exclamation-triangle me-2"></i>
          <span>กรุณาอ่านและกรอกข้อมูลให้ครบถ้วนก่อนส่ง</span>
        </div>

        {/* Instructions */}
        <ul className="list-unstyled mb-4">
          <li className="mb-2">
            <strong>1. ปริ้นขาวดำ 1-4 แผ่น: แผ่นละ 5 บาท</strong>
          </li>
          <li className="mb-2">
            <strong>2. ปริ้นขาวดำครั้งละ 5 แผ่นขึ้นไป: แผ่นละ 1 บาท</strong>
          </li>
          <li className="mb-2">
            <strong>
              3. ปริ้นสี: ราคาขึ้นอยู่กับสัดส่วนสี เริ่มต้นที่แผ่นละ 5 บาท
            </strong>
          </li>
          <li className="mb-2">
            <strong>4. หลังจากชำระเงินแล้ว ให้ลูกค้าส่งไฟล์มาได้เลย</strong>
          </li>
          <li className="mb-2">
            <strong>5. ส่งไฟล์: PDF WORD JPG หรือ PNG เท่านั้น</strong>
          </li>
          <li className="mb-2">
            <strong>6. รับที่ร้านเท่านั้น</strong>
          </li>
        </ul>

        {/* Form Fields */}
        <Row className="mb-3">
          <Col xs={6} md={4} className="mb-3">
            <TextSelect
              label="เลือกประเภทการปริ้น"
              id="selectTypePrint"
              options={["ขาวดำ", "สี"]}
              placeholder="เลือกประสีหรือขาวดำ"
              value={selectTypePrint}
              onChange={(value) => setSelectTypePrint(value)}
              required
              isInvalid={!selectTypePrint}
              alertText="กรุณาเลือกประเภทการปริ้น"
            />
          </Col>

          <Col xs={6} md={4} className="mb-3">
            <TextInput
              label="จำนวนหน้าเอกสาร"
              id="pagePrint"
              type="number"
              inputMode="numeric"
              value={pagePrint}
              onChange={(e) => {
                const value = e.target.value;
                if (/^\d*$/.test(value)) {
                  setPagePrint(value);
                }
              }}
              placeholder="กรอกจำนวนหน้า"
              required
              isInvalid={!pagePrint || parseInt(pagePrint, 10) <= 0}
              alertText="กรุณากรอกจำนวนหน้า"
            />
          </Col>

          <Col xs={12} md={4} className="mb-3">
            <TextInput
              label="จำนวนชุดที่ต้องการปริ้น"
              id="copiesSetPrint"
              type="number"
              inputMode="numeric"
              value={copiesSetPrint}
              onChange={(e) => {
                const value = e.target.value;
                if (/^\d*$/.test(value)) {
                  setCopiesSetPrint(value);
                }
              }}
              placeholder="กรอกจำนวนชุด"
              required
              isInvalid={!copiesSetPrint || parseInt(copiesSetPrint, 10) <= 0}
              alertText="กรุณากรอกจำนวนชุด"
            />
          </Col>
        </Row>

        {/* Total Price */}
        <Row>
          <Col className="text-center">
            <h4 className="text-success">รวมค่าใช้จ่าย: {totalPrice} บาท</h4>
          </Col>
        </Row>

        <hr className="my-4" />

        <footer>
          {/* Submit Button */}
          <Row className="justify-content-end">
            <Col xs="auto" style={{ minWidth: "150px" }}>
              <Button variant="light" type="submit" className="w-100 ">
                ย้อนกลับ
              </Button>
            </Col>
            <Col xs="auto" style={{ minWidth: "150px" }}>
              <Button variant="primary" type="submit" className="w-100 ">
                ส่ง
              </Button>
            </Col>
          </Row>
        </footer>
      </Form>
    </div>
  );
};

export default Print;
