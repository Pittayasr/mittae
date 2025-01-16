import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import useAuth from "../useAuth";
import { Button, Form, Container, Row, Col, Alert } from "react-bootstrap";
import TextInput from "../textFillComponent/textInput";
import { VscEye, VscEyeClosed } from "react-icons/vsc";
import {
  getFirestore,
  collection,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { app } from "../../../firebaseConfig";

const LoginAdmin: React.FC = () => {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMessage("");

    try {
      const db = getFirestore(app);
      const adminCollection = collection(db, "admin");
      const q = query(adminCollection, where("username", "==", username.trim()));
      const querySnapshot = await getDocs(q);

      let loginSuccess = false;

      querySnapshot.forEach((doc) => {
        const data = doc.data();
        if (data.password === password) {
          loginSuccess = true;
        }
      });

      if (loginSuccess) {
        // window.alert("เข้าสู่ระบบสำเร็จ");
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
      <Row className="w-100" style={{ minWidth: "200px", maxWidth: "500px" }}>
        <Col md={4} className="form-container mx-auto">
          <Form onSubmit={handleSubmit}>
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
                id="username"
                label="ชื่อผู้ใช้หรืออีเมล"
                type="username"
                placeholder="กรอกอีเมลของคุณ"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </Col>

            <Col className="mb-3">
              <Form.Group>
                <Form.Label>รหัสผ่าน</Form.Label>
                <div className="position-relative">
                  <Form.Control
                    type={showPassword ? "text" : "password"} // แสดงรหัสผ่านหรือไม่
                    placeholder="กรอกรหัสผ่านของคุณ"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <span
                    className="position-absolute"
                    style={{
                      top: "50%",
                      right: "10px",
                      transform: "translateY(-50%)",
                      cursor: "pointer",
                    }}
                    onClick={() => setShowPassword(!showPassword)} // เปลี่ยนสถานะแสดง/ซ่อนรหัสผ่าน
                  >
                    {showPassword ? (
                      <VscEyeClosed size={20} />
                    ) : (
                      <VscEye size={20} />
                    )}
                  </span>
                </div>
              </Form.Group>
            </Col>

            {/* <Form.Group className="mb-3">
              <Form.Check
                type="checkbox"
                id="rememberMe"
                label="จดจำฉันไว้"
                className="custom-checkbox-pdpa "
              />
            </Form.Group> */}
            <Button type="submit" variant="success" className="w-100 mt-3">
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
