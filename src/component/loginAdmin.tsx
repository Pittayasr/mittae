import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import useAuth from "./useAuth";
import { Button, Form, Container, Row, Col, Alert } from "react-bootstrap";
import TextInput from "./textFillComponent/textInput";
import {
  getFirestore,
  collection,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { app } from "../../firebaseConfig";

const LoginAdmin: React.FC = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>("");

  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMessage("");

    try {
      const db = getFirestore(app);
      const adminCollection = collection(db, "admin");
      const q = query(adminCollection, where("username", "==", email.trim()));
      const querySnapshot = await getDocs(q);

      let loginSuccess = false;

      querySnapshot.forEach((doc) => {
        const data = doc.data();
        if (data.password === password) {
          loginSuccess = true;
        }
      });

      if (loginSuccess) {
        window.alert("เข้าสู่ระบบสำเร็จ");
        login();
        navigate("/admin_select");
      } else {
        setErrorMessage("อีเมลหรือรหัสผ่านไม่ถูกต้อง");
      }
    } catch (error) {
      console.error("เกิดข้อผิดพลาดระหว่างเข้าสู่ระบบ:", error);
      setErrorMessage("เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง");
    }
  };

  return (
    <Container className="d-flex justify-content-center align-items-center min-vh-100">
      <Row className="w-100">
        <Col md={4} className="mx-auto">
          <Form onSubmit={handleSubmit} className="shadow p-4 rounded bg-white">
            <h1 className="h3 mb-4 fw-normal text-center">
              กรุณาเข้าสู่ระบบแอดมิน
            </h1>
            {errorMessage && (
              <Alert variant="danger" className="text-center">
                {errorMessage}
              </Alert>
            )}
            <Col className="mb-3">
              <TextInput
                id="email"
                label="ชื่อผู้ใช้หรืออีเมล"
                type="email"
                placeholder="กรอกอีเมลของคุณ"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </Col>

            <Col className="mb-3">
              <TextInput
                id="password"
                label="รหัสผ่าน"
                type="password"
                placeholder="กรอกรหัสผ่านของคุณ"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </Col>

            <Form.Group className="mb-3">
              <Form.Check
                type="checkbox"
                id="rememberMe"
                label="จดจำฉันไว้"
                className="custom-checkbox p-0"
              />
            </Form.Group>
            <Button type="submit" variant="success" className="w-100">
              เข้าสู่ระบบ
            </Button>
            <footer className="text-center mt-4">
              <small>© copyright 2024</small>
            </footer>
          </Form>
        </Col>
      </Row>
    </Container>
  );
};

export default LoginAdmin;
