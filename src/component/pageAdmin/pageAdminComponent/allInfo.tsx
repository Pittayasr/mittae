import React from "react";
import { Card, Row, Col } from "react-bootstrap";
import {
  FaCheckCircle,
  FaClock,
  FaExclamationTriangle,
  FaList,
} from "react-icons/fa";

interface AllInfoProps {
  total: number;
  completed: number;
  inProgress: number;
  additionalDocs: number;
}

const AllInfo: React.FC<AllInfoProps> = ({
  total,
  completed,
  inProgress,
  additionalDocs,
}) => {
  return (
    <Row className="mb-4 g-2">
      <Col xs={6} sm={6} md={3} lg={3}>
        <Card className="text-center compact-card">
          <Card.Body className="d-flex flex-column align-items-center">
            <FaList size={20} className="text-primary text-center mb-2" />
            <Card.Title className="small-text">ข้อมูลทั้งหมด</Card.Title>
            <Card.Text className="responsive-label">{total} รายการ</Card.Text>
          </Card.Body>
        </Card>
      </Col>
      <Col xs={6} sm={6} md={3} lg={3}>
        <Card className="text-center compact-card">
          <Card.Body className="d-flex flex-column align-items-center">
            <FaCheckCircle size={20} className="text-success mb-2" />
            <Card.Title className="small-text">สำเร็จแล้ว</Card.Title>
            <Card.Text className="responsive-label">
              {completed} รายการ
            </Card.Text>
          </Card.Body>
        </Card>
      </Col>
      <Col xs={6} sm={6} md={3} lg={3}>
        <Card className="text-center compact-card">
          <Card.Body className="d-flex flex-column align-items-center">
            <FaClock size={20} className="text-info mb-2" />
            <Card.Title className="small-text">กำลังดำเนินการ</Card.Title>
            <Card.Text className="responsive-label">
              {inProgress} รายการ
            </Card.Text>
          </Card.Body>
        </Card>
      </Col>
      <Col xs={6} sm={6} md={3} lg={3}>
        <Card className="text-center compact-card">
          <Card.Body className="d-flex flex-column align-items-center">
            <FaExclamationTriangle size={20} className="text-warning mb-2" />
            <Card.Title className="small-text">รอเอกสารเพิ่มเติม</Card.Title>
            <Card.Text className="responsive-label">
              {additionalDocs} รายการ
            </Card.Text>
          </Card.Body>
        </Card>
      </Col>
    </Row>
  );
};

export default AllInfo;
