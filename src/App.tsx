import { useState, useEffect } from "react";
import { Button } from "react-bootstrap";
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
import "./App.css";
import SelectFormModal from "./component/selectFromModal";

function App() {
  const [isPDPAAgreed, setIsPDPAAgreed] = useState(false);
  const [showSelectFormModal, setShowSelectFormModal] = useState(true);
  const [showBrowserWarning, setShowBrowserWarning] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();

  const isAndroid = /android/i.test(navigator.userAgent);

  useEffect(() => {
    const isWebView = () => {
      const userAgent = window.navigator.userAgent.toLowerCase();
      return (
        userAgent.includes("wv") || // Android WebView
        userAgent.includes("webview") || // iOS WebView
        ((userAgent.includes("iphone") || userAgent.includes("ipad")) &&
          userAgent.includes("safari") === false) // iOS WebView (no Safari)
      );
    };

    // ตรวจสอบ localStorage ก่อน
    const storedWarning = localStorage.getItem("showBrowserWarning");
    const shouldShowWarning = location.pathname === "/print" && isWebView();

    if (shouldShowWarning) {
      setShowBrowserWarning(true);
      localStorage.setItem("showBrowserWarning", "true"); // บันทึกสถานะ
    } else if (storedWarning === "true" && location.pathname !== "/print") {
      setShowBrowserWarning(false);
      localStorage.removeItem("showBrowserWarning"); // ลบสถานะเมื่อออกจากหน้า
    }
  }, [location.pathname]);

  const handlePDPAAgree = () => {
    setIsPDPAAgreed(true);
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

  if (
    !isPDPAAgreed &&
    (location.pathname === "/form" ||
      location.pathname === "/print" ||
      location.pathname === "/delivery")
  ) {
    return <PDPA_modal isVisible={!isPDPAAgreed} onAgree={handlePDPAAgree} />;
  }

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

      <Routes>
        <Route
          path="/form"
          element={isPDPAAgreed ? <FormComponent /> : <Navigate to="/" />}
        />
        <Route
          path="/print"
          element={isPDPAAgreed ? <Print /> : <Navigate to="/" />}
        />
        <Route
          path="/delivery"
          element={isPDPAAgreed ? <Delivery /> : <Navigate to="/" />}
        />
        <Route path="/print_admin_XTc}KPf]=Z@J" element={<PrintAdmin />} />
        {/* Default route */}
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
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </div>
  );
}

function AppWrapper() {
  return (
    <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <App />
    </Router>
  );
}

export default AppWrapper;
