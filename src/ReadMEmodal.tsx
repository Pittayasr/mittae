import { Modal, Button } from "react-bootstrap";

interface PDPA_modalProps {
  isVisible: boolean;
  onAgree: () => void;
}

const PDPA_modal: React.FC<PDPA_modalProps> = ({ isVisible, onAgree }) => {
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
        <Modal.Title className="text-center">อ่านก่อนส่ง</Modal.Title>
      </Modal.Header>
      <Modal.Body className="mx-2">
        <p className="mb-2 text-center">🙏✅ยินดีให้บริการค่ะ</p>
        <p className="mb-2 text-center">
          รบกวนคุณลูกค้าส่งเอกสารต่อไปนี้ให้แอดมินได้ตรวจสอบเลยค่ะ
        </p>
        <p className="mb-2">
          📌1.ภาพถ่ายหน้าเล่มทะเบียนรถแบบชัดๆไม่เอียงไม่มืดไม่ดำไม่เบลอนะคะ
        </p>
        <p className="mb-2">📌2.หมายเลขโทรศัพท์ติดต่อลูกค้า</p>
        <p className="mb-4">📌3.รูปถ่ายแผ่นป้ายทะเบียนรถ</p>
        <p className="mb-2 text-center">🚩ขั้นตอนการทำ</p>
        <p className="mb-2">📌1.ลูกค้าส่งเอกสารมาให้ตรวจสอบ</p>
        <p className="mb-2">
          📌2.ดำเนินการตรวจสอบเสร็จจะแจ้งราคาให้ลูกค้าทราบเพื่อชำระเงินต่อไป
        </p>
        <p className="mb-2">
          📌3.เมื่อลูกค้าส่งสลิปยืนยันการชำระเงิน แอดมินฯ จะทำการออกพรบ.
          คุ้มครองให้ทันทีที่ชำระเงิน
          และจะขอนัดหมายเข้าไปรับรถเพื่อดำเนินการตรวจสภาพและชำระภาษีแล้วเสร็จภายในไม่เกินชั่วโมงค่ะ
        </p>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="primary" onClick={onAgree}>
          ถัดไป
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default PDPA_modal;
