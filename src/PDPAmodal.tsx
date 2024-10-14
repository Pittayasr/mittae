import React, { useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";

interface PDPA_modalProps {
  isVisible: boolean;
  onAgree: () => void;
}

const PDPA_modal: React.FC<PDPA_modalProps> = ({ isVisible, onAgree }) => {
  const [isAgreed, setIsAgreed] = useState(false);

  const handleAgreeChange = () => {
    setIsAgreed(!isAgreed);
  };

  return (
    <Modal
      show={isVisible}
      backdrop="static"
      keyboard={false}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header>
        <Modal.Title className="text-center">
          พระราชบัญญัติคุ้มครองข้อมูลส่วนบุลคล พ.ศ. 2562 (Personal Data
          Protection Act: PDPA)
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className="mx-2">
        <p className="mb-4">
          ตามที่มีการประกาศใช้พระราชบัญญัติคุ้มครองข้อมูลส่วนบุคคล พ.ศ. 2562
          ข้าพเจ้าในฐานะผู้ให้ข้อมูลได้ตามที่มีการประกาศใช้พระราชบัญญัติคุ้มครองข้อมูลส่วนบุคคล
          พ.ศ. 2562 ข้าพเจ้าในฐานะผู้ให้ข้อมูลได้อ่านและรับทราบข้อมูลต่อไปนี้:
        </p>
        <p className="mb-4">
          1.วัตถุประสงค์ของการเก็บข้อมูลส่วนบุคคล
          ข้าพเจ้าเข้าใจว่าข้อมูลส่วนบุคคลของข้าพเจ้า เช่น ชื่อ นามสกุล
          หมายเลขบัตรประจำตัวประชาชน ที่อยู่ อีเมล หรือข้อมูลอื่นๆ ที่เกี่ยวข้อง
          จะถูกเก็บรวบรวมเพื่อวัตถุประสงค์เฉพาะด้านที่ได้แจ้งไว้ เช่น
          การให้บริการ การปรับปรุงบริการ และการติดต่อเพื่อให้ข้อมูลข่าวสาร
        </p>
        <p className="mb-4">
          2.การใช้และเปิดเผยข้อมูลส่วนบุคคล
          ข้าพเจ้ายินยอมให้ข้อมูลส่วนบุคคลดังกล่าวถูกใช้และเปิดเผยต่อหน่วยงานหรือบุคคลที่เกี่ยวข้องตามความจำเป็น
          เพื่อวัตถุประสงค์ของการให้บริการ
          หรือเพื่อปฏิบัติตามกฎหมายที่เกี่ยวข้อง
        </p>
        <p className="mb-4">
          3.การคุ้มครองข้อมูลส่วนบุคคล
          ข้อมูลส่วนบุคคลของข้าพเจ้าจะถูกเก็บรักษาอย่างปลอดภัยและถูกใช้ตามที่ได้รับความยินยอมเท่านั้น
          โดยบริษัทฯ จะใช้มาตรการที่เหมาะสมเพื่อป้องกันการเข้าถึง การใช้
          การเปิดเผยข้อมูลที่ไม่ได้รับอนุญาต
        </p>
        <p className="mb-4">
          4.สิทธิของเจ้าของข้อมูล ข้าพเจ้ามีสิทธิตามกฎหมายที่จะเข้าถึง แก้ไข
          หรือเพิกถอนความยินยอมในการเก็บรวบรวม ใช้
          หรือเปิดเผยข้อมูลส่วนบุคคลของข้าพเจ้าได้ตามกฎหมาย PDPA
          โดยสามารถติดต่อบริษัทฯได้
        </p>
        <Form>
          <Form.Check
            type="checkbox"
            id="custom-checkbox"
            label="ข้าพเจ้าได้อ่านและยอมรับเงื่อนไขทุกประการ"
            checked={isAgreed}
            onChange={handleAgreeChange}
          />
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="primary" onClick={onAgree} disabled={!isAgreed}>
          ตกลง
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default PDPA_modal;
