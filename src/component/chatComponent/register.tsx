import React, { useState, ReactNode } from "react";
import {
  Button,
  Form,
  Col,
  Row,
  Spinner,
  Container,
  Modal,
} from "react-bootstrap";
import TextInput from "../textFillComponent/textInput";
import AlertModal from "../textFillComponent/alertModal";
import { db } from "../../../firebaseConfig";
import { collection, addDoc } from "firebase/firestore";
import { FaCheckCircle, FaExclamationTriangle } from "react-icons/fa";
import { VscError } from "react-icons/vsc";

interface RegisterUserProps {
  name_surname: string;
  setName_surname: (value: string) => void;
  username: string;
  setUsername: (value: string) => void;
  password: string;
  setPassword: (value: string) => void;
  contactNumber: string;
  setContactNumber: (value: string) => void;
  email: string;
  setEmail: (value: string) => void;
  isInvalid: boolean;
  setIsInvalid: (value: boolean) => void;
  onBack: () => void;
}

const RegisterUser: React.FC<RegisterUserProps> = ({
  name_surname,
  setName_surname,
  username,
  setUsername,
  password,
  setPassword,
  contactNumber,
  setContactNumber,
  email,
  setEmail,
  onBack,
}) => {
  const [hasTouchedName_surname, setHasTouchedName_surname] = useState(false);
  const [hasTouchedContact, setHasTouchedContact] = useState(false);
  const [hasTouchedUsername, setHasTouchedUsername] = useState(false);
  const [hasTouchedPassword, setHasTouchedPassword] = useState(false);
  const [hasTouchedEmail, setHasTouchedEmail] = useState(false);

  const validateName_surname = (value: string) =>
    /^[เ-ไก-ฮa-zA-Z\-/]+$/.test(value);

  const validateUsername = (value: string) => /^[a-zA-Z0-9\-/]+$/.test(value);

  const validatePassword = (value: string) => {
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;
    return passwordRegex.test(value);
  };

  const validateEmail = (value: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(value);
  };

  const validateContactNumber = (value: string) =>
    /^(06|08|09)\d{8}$/.test(value);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState<ReactNode>(null);
  const [success, setSuccess] = useState(false);

  const handleOpenModal = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setModalMessage(
      <div className="d-flex flex-column align-items-center text-center">
        <FaExclamationTriangle className="text-warning my-3" size={50} />
        <p className="px-2">
          คุณต้องการยืนยันว่า
          <br />
          ข้อมูลทั้งหมดถูกต้องใช่ไหม?
        </p>
      </div>
    );

    setSuccess(false);
    setShowModal(true);
  };

  const handleConfirm = async () => {
    setIsSubmitting(true);

    const data = {
      name_surname: name_surname,
      username: username,
      password: password,
      contactNumber: contactNumber,
      email: email,
    };

    try {
      await addDoc(collection(db, "user"), data);

      setModalMessage(
        <div className="d-flex flex-column align-items-center text-center">
          <FaCheckCircle className="text-success my-3" size={50} />
          <p className="px-2">
            ข้อมูลถูกส่งสำเร็จแล้ว! ✅<br />
            ขอขอบพระคุณที่ใช้บริการกับทางเราตลอดไป 🙏❤️
          </p>
        </div>
      );
      setSuccess(true);
    } catch (error) {
      console.error("Error uploading file or saving data:", error);
      setModalMessage(
        <div className="d-flex flex-column align-items-center text-center">
          <VscError className="text-danger my-3" size={50} />
          <p className="px-2">การส่งข้อมูลล้มเหลว กรุณาลองอีกครั้ง</p>
        </div>
      );
      setSuccess(false);
    } finally {
      setIsSubmitting(false);
      setShowModal(true);
    }
  };

  return (
    <Container className="d-flex justify-content-center align-items-center min-vh-100">
      <Row className="w-100" style={{ minWidth: "200px", maxWidth: "500px" }}>
        <Col className="form-container mx-auto">
          <Form onSubmit={handleOpenModal}>
            {/* ชื่อ-สกุล */}
            <Col className="mb-3">
              <TextInput
                label="ชื่อ นามสกุล"
                id="้name_surname"
                placeholder="กรอกชื่อและนามสกุล"
                value={name_surname}
                onChange={(e) => {
                  setName_surname(e.target.value);
                  setHasTouchedName_surname(true);
                }}
                isInvalid={
                  hasTouchedName_surname && !validateName_surname(name_surname)
                }
                required
                alertText="กรุณากรอกชื่อและนามสกุล"
              />
            </Col>

            {/* ชื่อผู้ใช้ */}
            <Col className="mb-3">
              <TextInput
                label="ชื่อผู้ใช้งาน"
                id="้username"
                placeholder="กรอกชื่อผู้ใช้งาน"
                value={username}
                onChange={(e) => {
                  setUsername(e.target.value);
                  setHasTouchedUsername(true);
                }}
                isInvalid={hasTouchedUsername && !validateUsername(username)}
                required
                alertText="กรุณากรอกชื่อผู้ใช้งานให้ถูกต้อง"
              />
            </Col>

            {/* รหัสผ่าน */}
            <Col className="mb-3">
              <TextInput
                label="รหัสผ่าน"
                id="้password"
                placeholder="กรอกรหัสผ่าน"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setHasTouchedPassword(true);
                }}
                isInvalid={hasTouchedPassword && !validatePassword(username)}
                required
                alertText="รหัสผ่านต้องมีอย่างน้อย 8 ตัวอักษร ประกอบด้วยตัวพิมพ์ใหญ่ ตัวพิมพ์เล็ก ตัวเลข และอักขระพิเศษ"
              />
            </Col>

            {/* หมายเลขโทรศัพท์ */}
            <Col className="mb-3">
              <TextInput
                label="หมายเลขโทรศัพท์"
                id="contactNumber"
                placeholder="กรอกหมายเลขโทรศัพท์"
                value={contactNumber}
                onChange={(e) => {
                  setContactNumber(e.target.value);
                  setHasTouchedContact(true); // ระบุว่าผู้ใช้เริ่มกรอกข้อมูล
                }}
                isInvalid={
                  hasTouchedContact && !validateContactNumber(contactNumber)
                }
                required
                alertText={
                  hasTouchedContact
                    ? contactNumber.length > 10
                      ? "กรุณากรอกหมายเลขโทรศัพท์ 10 หลักและเริ่มด้วย 06, 08 หรือ 09"
                      : "กรุณากรอกเบอร์โทรศัพท์ให้ครบ 10 หลัก"
                    : ""
                }
              />
            </Col>

            {/* Email */}
            <Col className="mb-3">
              <TextInput
                label="อีเมล"
                id="้email"
                placeholder="user@example.com"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setHasTouchedEmail(true);
                }}
                isInvalid={hasTouchedEmail && !validateEmail(username)}
                required
                alertText="กรุณากรอกอีเมลให้ถูกต้อง เช่น user@example.com"
              />
            </Col>

            <Button type="submit" variant="success" className="w-100 mt-3">
              เข้าสู่ระบบ
            </Button>
            <footer className="text-center mt-4">
              <small>© copyright 2024</small>
            </footer>
          </Form>
        </Col>
      </Row>

      <AlertModal
        show={showModal}
        onBack={() => {
          setShowModal(false);
        }}
        onSuccess={() => {
          window.location.reload();
          onBack();
          setShowModal(false);
        }}
        onConfirm={
          success
            ? () => {
                onBack();
                setShowModal(false);
              }
            : handleConfirm
        }
        message={modalMessage}
        success={success}
      />

      <Modal show={isSubmitting} centered>
        <Modal.Body className="text-center">
          <Spinner
            animation="border"
            variant="success"
            role="status"
            className="my-3"
          />
          <p>กำลังส่งข้อมูล...</p>
        </Modal.Body>
      </Modal>
    </Container>
  );
};

export default RegisterUser;
