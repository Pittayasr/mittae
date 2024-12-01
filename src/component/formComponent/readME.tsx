import { Button } from "react-bootstrap";

interface ReadMeProps {
  onAgree: () => void;
}

const ReadMe: React.FC<ReadMeProps> = ({ onAgree }) => {
  return (
    <div className="container mx-auto">
      <h2 className="text-center">โปรดอ่านก่อนดำเนินการ </h2>
      <h5 className="text-center mb-4">🙏 ขอบคุณที่ใช้บริการของเรา</h5>
      <h6 className="text-center font-weight-bold mb-3">
        เอกสารที่ต้องส่งให้แอดมินตรวจสอบ
      </h6>
      <p className="list-unstyled mb-4 mt-3">
        <li className="mb-2">
          📌 1. ภาพถ่ายหน้าเล่มทะเบียนรถ (ชัดเจน ไม่เบลอ ไม่มืด ไม่เอียง)
        </li>
        <li className="mb-2">📌 2. หมายเลขโทรศัพท์ที่สามารถติดต่อได้</li>
        <li className="mb-2">📌 3. ภาพถ่ายป้ายทะเบียนรถ</li>
      </p>

      <hr />

      <h6 className="text-center font-weight-bold mb-3 ">ขั้นตอนการทำงาน</h6>
      <ul className="list-unstyled mb-4 mt-3">
        <li className="mb-2">📌 1. ลูกค้าส่งเอกสารมาให้ตรวจสอบ</li>
        <li className="mb-2">
          📌 2. หลังจากตรวจสอบ แอดมินจะแจ้งราคากลับไปให้ลูกค้าชำระเงิน
        </li>
        <li className="mb-2">
          📌 3. หลังการชำระเงินและส่งสลิปยืนยัน แอดมินจะออก พรบ.
          ให้และนัดรับรถเพื่อตรวจสภาพและชำระภาษี
          งานทั้งหมดจะเสร็จสิ้นภายในไม่เกิน 1 ชั่วโมง
        </li>
      </ul>

      <h6 className="text-center text-danger font-weight-bold mb-4">
        🚩 กรุณาตรวจสอบเอกสารให้ครบถ้วน
      </h6>

      <footer className="d-flex justify-content-center">
        <Button onClick={onAgree} className="w-50" variant="success">
          ถัดไป
        </Button>
      </footer>
    </div>
  );
};

export default ReadMe;
