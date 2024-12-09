import React, { useState } from "react";
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
  const [validated, setValidated] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;

    if (form.checkValidity() === false) {
      e.stopPropagation();
    } else {
      // ล้างข้อความแจ้งเตือนข้อผิดพลาดก่อนหน้า
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
          console.log("เข้าสู่ระบบสำเร็จ!");
          // เปลี่ยนเส้นทางไปยังหน้าผู้ดูแลระบบหรือดำเนินการอื่นๆ
        } else {
          setErrorMessage("อีเมลหรือรหัสผ่านไม่ถูกต้อง");
        }
      } catch (error) {
        console.error("เกิดข้อผิดพลาดระหว่างเข้าสู่ระบบ:", error);
        setErrorMessage(
          "เกิดข้อผิดพลาดระหว่างเข้าสู่ระบบ กรุณาลองใหม่อีกครั้ง"
        );
      }
    }

    setValidated(true);
  };

  return (
    <Container className="d-flex justify-content-center align-items-center min-vh-100">
      <Row className="w-100">
        <Col md={4} className="mx-auto">
          <Form
            noValidate
            validated={validated}
            onSubmit={handleSubmit}
            className="shadow p-4 rounded bg-white"
          >
            <h1 className="h3 mb-3 fw-normal text-center">กรุณาเข้าสู่ระบบ</h1>
            {errorMessage && (
              <Alert variant="danger" className="text-center">
                {errorMessage}
              </Alert>
            )}
            <TextInput
              id="email"
              label="ที่อยู่อีเมล"
              type="email"
              placeholder="กรอกอีเมลของคุณ"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              alertText="กรุณาใส่ชื่อผู้ใช้อีเมลให้ถูกต้อง"
            />
            <TextInput
              id="password"
              label="รหัสผ่าน"
              type="password"
              placeholder="กรอกรหัสผ่านของคุณ"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              alertText="กรุณาใส่รหัสผ่าน"
            />
            <Form.Group className="mb-3">
              <Form.Check type="checkbox" id="rememberMe" label="จดจำฉันไว้" />
            </Form.Group>
            <Button type="submit" variant="primary" className="w-100">
              เข้าสู่ระบบ
            </Button>
            <footer className="text-center mt-3">
              <small>© 2017–2024</small>
            </footer>
          </Form>
        </Col>
      </Row>
    </Container>
  );
};

export default LoginAdmin;
