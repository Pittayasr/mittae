import { Modal, Button } from "react-bootstrap";

interface readMeModalProps {
  isVisible: boolean;
  onAgree: () => void;
}

const readMeModal: React.FC<readMeModalProps> = ({ isVisible, onAgree }) => {
  return (
    <Modal
      show={isVisible}
      backdrop="static"
      keyboard={false}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header className="d-flex justify-content-center">
        <Modal.Title className="text-center">โปรดอ่านก่อนดำเนินการ</Modal.Title>
      </Modal.Header>
      <Modal.Body className="px-4">
        <p className="text-center mb-4">🙏 ขอบคุณที่ใช้บริการของเรา</p>

        <p className="font-weight-bold mb-3">
          เอกสารที่ต้องส่งให้แอดมินตรวจสอบ
        </p>
        <ul className="list-unstyled mb-4">
          <li className="mb-2">
            📌 1. ภาพถ่ายหน้าเล่มทะเบียนรถ (ชัดเจน ไม่เบลอ ไม่มืด ไม่เอียง)
          </li>
          <li className="mb-2">📌 2. หมายเลขโทรศัพท์ที่สามารถติดต่อได้</li>
          <li className="mb-2">📌 3. ภาพถ่ายป้ายทะเบียนรถ</li>
        </ul>

        <hr />

        <p className="font-weight-bold mb-3">ขั้นตอนการทำงาน</p>
        <ul className="list-unstyled mb-4">
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

        <p className="text-center text-danger font-weight-bold mb-0">
          🚩 กรุณาตรวจสอบเอกสารให้ครบถ้วน
        </p>
      </Modal.Body>
      <Modal.Footer className="justify-content-center">
        <Button variant="primary" onClick={onAgree} style={{ width: "300px" }}>
          ถัดไป
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default readMeModal;
