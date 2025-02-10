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
      size="xl"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header className="d-flex justify-content-center">
        <Modal.Title className="text-center text-danger">
          <h4>
            พระราชบัญญัติคุ้มครองข้อมูลส่วนบุลคล พ.ศ. 2562 (Personal Data
            Protection Act: PDPA)
          </h4>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className="m-2 p-3 modal-body-scroll">
        <p className="text-justify mb-4">
          ตามที่มีการประกาศใช้พระราชบัญญัติคุ้มครองข้อมูลส่วนบุคคล พ.ศ. 2562
          ข้าพเจ้าในฐานะผู้ให้ข้อมูลได้อ่านและรับทราบข้อมูลต่อไปนี้:
        </p>
        <p className="text-justify mb-1">
          <strong>1. วัตถุประสงค์ของการเก็บข้อมูลส่วนบุคคล</strong> <br />
          ข้อมูลส่วนบุคคลของข้าพเจ้า เช่น ชื่อ นามสกุล หมายเลขบัตรประชาชน
          ที่อยู่ หมายเลขโทรศัพท์ อีเมล หรือข้อมูลอื่นที่เกี่ยวข้อง
          จะถูกเก็บรวบรวมเพื่อวัตถุประสงค์ดังนี้:
        </p>
        <ul>
          <li>
            การให้บริการ เช่น การต่อพรบ. ภาษีรถยนต์ การส่งของ การส่งสัตว์เลี้ยง
            และการจัดทำประกันภัยภาคสมัครใจ
          </li>
          <li>การติดต่อเพื่อแจ้งข้อมูลข่าวสารหรือบริการที่เกี่ยวข้อง</li>
          <li>การปรับปรุงและพัฒนาการให้บริการเพื่อประโยชน์สูงสุดของลูกค้า</li>
        </ul>
        <p className="text-justify mb-4">
          <strong>2. การใช้และเปิดเผยข้อมูลส่วนบุคคล</strong> <br />
          ข้าพเจ้ายินยอมให้บริษัทฯ ใช้และเปิดเผยข้อมูลส่วนบุคคลของข้าพเจ้า
          ต่อหน่วยงานที่เกี่ยวข้อง เช่น หน่วยงานภาครัฐ บริษัทคู่ค้า
          ผู้ให้บริการขนส่ง (FLASH, SPX, ไปรษณีย์ไทย) หรือหน่วยงานประกันภัย
          เพื่อวัตถุประสงค์ในการดำเนินการให้บริการ หรือปฏิบัติตามกฎหมาย
        </p>
        <p className="text-justify mb-4">
          <strong>3. การคุ้มครองข้อมูลส่วนบุคคล</strong> <br />
          บริษัทฯ จะเก็บรักษาข้อมูลส่วนบุคคลของข้าพเจ้าอย่างปลอดภัย
          และใช้มาตรการที่เหมาะสมเพื่อป้องกันการเข้าถึง การใช้
          และการเปิดเผยข้อมูลโดยไม่ได้รับอนุญาต
        </p>
        <p className="text-justify mb-4">
          <strong>4. สิทธิของเจ้าของข้อมูล</strong> <br />
          ข้าพเจ้ามีสิทธิเข้าถึง แก้ไข หรือลบข้อมูลส่วนบุคคลของข้าพเจ้า
          รวมถึงเพิกถอนความยินยอมได้ทุกเมื่อ โดยสามารถติดต่อบริษัทฯ
          ผ่านช่องทางที่กำหนด
        </p>
        <Form className="mt-4">
          <Form.Check
            type="checkbox"
            id="custom-checkbox"
            label="ข้าพเจ้าได้อนุญาตและยินยอมรับทราบเงื่อนไขทุกประการตามเงื่อนไขข้างต้น"
            checked={isAgreed}
            onChange={handleAgreeChange}
            className="custom-checkbox-pdpa px-4"
          />
        </Form>
      </Modal.Body>
      <Modal.Footer className="d-flex justify-content-center">
        <Button
          variant="success"
          onClick={onAgree}
          disabled={!isAgreed}
          className="w-50"
        >
          ตกลง
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default PDPA_modal;
