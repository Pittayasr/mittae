import React, { useState } from "react";
import TextInput from "./component/textInput";
import TextSelect from "./component/textSelect";
import DateInput from "./component/dateInput"; // นำเข้า DateInput
import Button from "./component/Button";
import { Form, Row, Col } from "react-bootstrap";
import { Dayjs } from "dayjs";

const provinces = [
  "กรุงเทพมหานคร",
  "กระบี่",
  "กาญจนบุรี",
  "กาฬสินธุ์",
  "กำแพงเพชร",
  "ขอนแก่น",
  "จันทบุรี",
  "ฉะเชิงเทรา",
  "ชลบุรี",
  "ชัยนาท",
  "ชัยภูมิ",
  "ชุมพร",
  "เชียงราย",
  "เชียงใหม่",
  "ตรัง",
  "ตราด",
  "ตาก",
  "นครนายก",
  "นครปฐม",
  "นครพนม",
  "นครราชสีมา",
  "นครศรีธรรมราช",
  "นครสวรรค์",
  "นนทบุรี",
  "นราธิวาส",
  "น่าน",
  "บึงกาฬ",
  "บุรีรัมย์",
  "ปทุมธานี",
  "ประจวบคีรีขันธ์",
  "ปราจีนบุรี",
  "ปัตตานี",
  "พระนครศรีอยุธยา",
  "พังงา",
  "พัทลุง",
  "พิจิตร",
  "พิษณุโลก",
  "เพชรบุรี",
  "เพชรบูรณ์",
  "แพร่",
  "ภูเก็ต",
  "มหาสารคาม",
  "มุกดาหาร",
  "แม่ฮ่องสอน",
  "ยะลา",
  "ยโสธร",
  "ร้อยเอ็ด",
  "ระนอง",
  "ระยอง",
  "ราชบุรี",
  "ลพบุรี",
  "ลำปาง",
  "ลำพูน",
  "เลย",
  "ศรีสะเกษ",
  "สกลนคร",
  "สงขลา",
  "สตูล",
  "สมุทรปราการ",
  "สมุทรสงคราม",
  "สมุทรสาคร",
  "สระแก้ว",
  "สระบุรี",
  "สิงห์บุรี",
  "สุโขทัย",
  "สุพรรณบุรี",
  "สุราษฎร์ธานี",
  "สุรินทร์",
  "หนองคาย",
  "หนองบัวลำภู",
  "อ่างทอง",
  "อำนาจเจริญ",
  "อุดรธานี",
  "อุตรดิตถ์",
  "อุทัยธานี",
  "อุบลราชธานี",
];

const FormComponent: React.FC = () => {
  const [validated, setValidated] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Dayjs | null>(null); // เก็บค่าวันที่ที่เลือก

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    const form = e.currentTarget;
    e.preventDefault();
    if (form.checkValidity() === false) {
      e.stopPropagation();
      setValidated(true);
    } else {
      setValidated(false);
      console.log("Form submitted successfully");
      console.log("Selected Date:", selectedDate?.format("DD/MM/YYYY")); // แสดงวันที่ที่เลือก
    }
  };

  // ฟังก์ชันจัดการการเปลี่ยนแปลงวันที่
  const handleDateChange = (date: Dayjs | null) => {
    setSelectedDate(date);
  };

  return (
    <div className="container mx-auto">
      <Form noValidate validated={validated} onSubmit={handleSubmit}>
        {/* ใช้ Row เดียวกันสำหรับฟิลด์ทั้งสาม */}
        <Row className="g-3 my-3">
          <Col md={4} xs={12}>
            <TextInput label="ชื่อเจ้าของรถ" id="firstName" required />
          </Col>
          <Col md={4} xs={12}>
            <TextSelect
              label="ประเภทรถจักรยานยนต์"
              id="bikeType"
              options={["รถส่วนบุคคล", "รถสาธารณะ", "รถพ่วง"]}
              required
            />
          </Col>
          <Col md={4} xs={12}>
            <TextSelect
              label="จังหวัด"
              id="province"
              options={provinces}
              required
            />
          </Col>
        </Row>

        {/* แทรก DateInput สำหรับการเลือกวันที่ */}
        <Row className="g-3 my-3">
          <Col md={6} xs={12}>
            <DateInput onDateChange={handleDateChange} />{" "}
            {/* ส่ง onDateChange */}
          </Col>
        </Row>

        <TextInput label="Username" id="username" required />
        <TextInput label="Email" id="email" type="email" />
        <TextInput label="Address" id="address" required />
        <TextInput label="Address 2" id="address2" />

        <hr className="my-4" />

        <Button label="ต่อไป" className="w-100" />
      </Form>
    </div>
  );
};

export default FormComponent;
