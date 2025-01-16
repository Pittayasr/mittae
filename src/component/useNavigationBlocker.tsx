import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Modal, Button } from "react-bootstrap";

const useCustomNavigationBlocker = (when: boolean) => {
  const [showModal, setShowModal] = useState(false);
  const [nextPath, setNextPath] = useState<string | null>(null);
  const navigate = useNavigate();

  const blockNavigation = (path: string) => {
    if (when) {
      setShowModal(true); // แสดง Modal
      setNextPath(path); // บันทึกเส้นทางที่ผู้ใช้ต้องการไป
    } else {
      navigate(path); // เปลี่ยนเส้นทางโดยตรงหากไม่มีเงื่อนไขบล็อค
    }
  };

  const confirmNavigation = () => {
    setShowModal(false);
    if (nextPath) {
      navigate(nextPath); // เปลี่ยนเส้นทางเมื่อผู้ใช้ยืนยัน
      setNextPath(null);
    }
  };

  const cancelNavigation = () => {
    setShowModal(false);
    setNextPath(null); // ยกเลิกการเปลี่ยนเส้นทาง
  };

  const NavigationBlockerModal = () => (
    <Modal show={showModal} onHide={cancelNavigation}>
      <Modal.Header closeButton>
        <Modal.Title>ยืนยันการออกจากหน้า</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p className="text-center">
          คุณแน่ใจหรือไม่ว่าต้องการออกจากหน้านี้? <br />
          ข้อมูลที่กรอกไว้จะหายไป
        </p>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="outline-success" onClick={cancelNavigation}>
          ยกเลิก
        </Button>
        <Button variant="success" onClick={confirmNavigation}>
          ยืนยัน
        </Button>
      </Modal.Footer>
    </Modal>
  );

  return { NavigationBlockerModal, blockNavigation };
};

export default useCustomNavigationBlocker;
