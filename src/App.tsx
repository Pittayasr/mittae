//App.tsx
import { useState, useEffect } from "react";
import { Button } from "react-bootstrap";
import { AuthProvider } from "./component/authContext";
import useAuth from "./component/useAuth";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
  useNavigate,
} from "react-router-dom";
import PDPA_modal from "./component/PDPAmodal";
import FormComponent from "./component/form";
import Print from "./component/print";
import Delivery from "./component/delivery";
import PrintAdmin from "./component/printAdmin";
import FormAdmin from "./component/formAdmin";
import DeliveryAdmin from "./component/deliveryAdmin";
import "./App.css";
import SelectFormModal from "./component/selectFromModal";
import SelectAdminFormModal from "./component/selelctAdminFormModal";
import LoginAdmin from "./component/loginAdmin";

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isLoggedIn } = useAuth();
  return isLoggedIn ? <>{children}</> : <Navigate to="/login" />;
};

function App() {
  const [showPDPA, setShowPDPA] = useState(false);
  const [showSelectFormModal, setShowSelectFormModal] = useState(true);
  const [showBrowserWarning, setShowBrowserWarning] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();

  const isAndroid = /android/i.test(navigator.userAgent);

  useEffect(() => {
    const isWebView = () => {
      const userAgent = window.navigator.userAgent.toLowerCase();
      return (
        userAgent.includes("wv") ||
        userAgent.includes("webview") ||
        ((userAgent.includes("iphone") || userAgent.includes("ipad")) &&
          userAgent.includes("safari") === false)
      );
    };

    const shouldShowWarning = location.pathname === "/print" && isWebView();

    setShowBrowserWarning(shouldShowWarning);

    // แสดง PDPA_modal เมื่อเข้าหน้าใหม่
    if (["/form", "/print", "/delivery"].includes(location.pathname)) {
      setShowPDPA(true); // เปิด Modal PDPA เสมอเมื่อเปลี่ยนหน้า
    } else {
      setShowPDPA(false);
    }

    // แสดง SelectFormModal ในหน้าหลัก
    if (location.pathname === "/") {
      setShowSelectFormModal(true);
    } else {
      setShowSelectFormModal(false);
    }
  }, [location.pathname]);

  const handlePDPAAgree = () => {
    setShowPDPA(false);
  };

  const handleNavigateToForm = () => {
    navigate("/form");
  };

  const handleNavigateToPrint = () => {
    navigate("/print");
  };

  const handleNavigateToDelivery = () => {
    navigate("/delivery");
  };

  const handleNavigateToFormAdmin = () => {
    navigate("/form_admin_hc{SlU(.'rhA");
  };

  const handleNavigateToPrintAdmin = () => {
    navigate("/print_admin_XTc}KPf]=Z@J");
  };

  // if (
  //   !isPDPAAgreed &&
  //   (location.pathname === "/form" ||
  //     location.pathname === "/print" ||
  //     location.pathname === "/delivery")
  // ) {
  //   return <PDPA_modal isVisible={!isPDPAAgreed} onAgree={handlePDPAAgree} />;
  // }

  return (
    <div className="container my-3">
      {/* แสดง Modal แจ้งเตือน */}
      {showBrowserWarning && (
        <div className="browser-warning-modal">
          <div className="modal-container">
            <h3>กรุณาเปลี่ยนเบราว์เซอร์</h3>
            <p>
              เบราว์เซอร์นี้ไม่รองรับการใช้งานในการอัปโหลดไฟล์
              กรุณาเปิดเว็บไซต์ใน <strong>Google Chrome, Safari</strong>{" "}
              หรือเบราว์เซอร์ อื่นๆที่รองรับ:
            </p>
            {/* ปุ่มสำหรับเปิดใน Google Chrome */}
            {isAndroid && (
              <Button
                className="my-2"
                variant="success"
                onClick={() => {
                  window.location.href =
                    "intent://mittaemaefahlung88.com#Intent;scheme=https;package=com.android.chrome;end";
                }}
              >
                เปิดใน Google Chrome
              </Button>
            )}

            {/* ปุ่มสำหรับเปิดใน Safari */}
            {!isAndroid && (
              <Button
                className="my-2"
                variant="success"
                onClick={() => {
                  window.open("https://mittaemaefahlung88.com", "_blank");
                }}
              >
                เปิดใน Safari
              </Button>
            )}

            {/* ปุ่มสำหรับคัดลอกลิงก์ */}
            <Button
              className="my-2"
              variant="success"
              onClick={() => {
                navigator.clipboard.writeText(window.location.href);
                alert("URL ได้ถูกคัดลอกแล้ว กรุณาวางในเบราว์เซอร์ที่รองรับ");
              }}
            >
              คัดลอกลิงค์ URL ของเว็บไซต์
            </Button>
          </div>
        </div>
      )}
      {showPDPA && (
        <PDPA_modal isVisible={showPDPA} onAgree={handlePDPAAgree} />
      )}

      <Routes>
        {/* เส้นทางของผู้ใช้ทั่วไป */}
        <Route
          path="/"
          element={
            <SelectFormModal
              isVisible={showSelectFormModal}
              onClose={() => setShowSelectFormModal(false)}
              onNavigateToReadMe={handleNavigateToForm}
              onNavigateToPrint={handleNavigateToPrint}
              onNavigateToDelivery={handleNavigateToDelivery}
            />
          }
        />
        <Route path="/form" element={<FormComponent />} />
        <Route path="/print" element={<Print />} />
        <Route path="/delivery" element={<Delivery />} />

        {/* เส้นทางเข้าสู่ระบบสำหรับแอดมิน */}
        <Route path="/login" element={<LoginAdmin />} />

        {/* เส้นทางแอดมินที่ต้องการการล็อกอิน */}
        <Route
          path="/admin_select"
          element={
            <ProtectedRoute>
              <SelectAdminFormModal
                isVisible={true}
                onClose={() => {}}
                onNavigateToFormAdmin={handleNavigateToFormAdmin}
                onNavigateToPrintAdmin={handleNavigateToPrintAdmin}
              />
            </ProtectedRoute>
          }
        />

        <Route
          path="/form_admin_hc{SlU(.'rhA"
          element={
            <ProtectedRoute>
              <FormAdmin />
            </ProtectedRoute>
          }
        />
        <Route
          path="/print_admin_XTc}KPf]=Z@J"
          element={
            <ProtectedRoute>
              <PrintAdmin />
            </ProtectedRoute>
          }
        />
        <Route
          path="/delivery_admin_2[sru)x3X[SD"
          element={
            <ProtectedRoute>
              <DeliveryAdmin />
            </ProtectedRoute>
          }
        />

        {/* เส้นทางที่ไม่รู้จัก */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </div>
  );
}

function AppWrapper() {
  return (
    <AuthProvider>
      <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <App />
      </Router>
    </AuthProvider>
  );
}

export default AppWrapper;
