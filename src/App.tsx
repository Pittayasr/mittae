import { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useNavigate,
} from "react-router-dom";
import PDPA_modal from "./component/PDPAmodal";
import ReadMEmodal from "./component/ReadMEmodal";
import SelectFormModal from "./component/selectFromModal";
import FormComponent from "./component/form";
import Print from "./component/print";
import "./App.css";

function App() {
  const [isPDPAAgreed, setIsPDPAAgreed] = useState<boolean>(false);
  const [showReadMe, setShowReadMe] = useState(false);
  const [showSelectFormModal, setShowSelectFormModal] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // เช็คจาก localStorage ว่าผู้ใช้เคยยอมรับ PDPA แล้วหรือยัง
    const pdpaStatus = localStorage.getItem("isPDPAAgreed");
    if (pdpaStatus === "true") {
      setIsPDPAAgreed(true); // หากเคยยอมรับให้ตั้งค่าเป็น true
    }
  }, []);

  const handlePDPAAgree = () => {
    setIsPDPAAgreed(true);
    localStorage.setItem("isPDPAAgreed", "true"); // เก็บสถานะลงใน localStorage
    setShowSelectFormModal(true);
  };

  const handleNavigateToReadMe = () => {
    setShowSelectFormModal(false);
    setShowReadMe(true);
  };

  const handleReadMeAgree = () => {
    setShowReadMe(false);
    navigate("/form");
  };

  const handleNavigateToPrint = () => {
    setShowSelectFormModal(false);
    navigate("/print");
  };

  return (
    <div className="container my-2">
      {/* PDPA Modal: จะแสดงเฉพาะหากยังไม่ได้ยอมรับ */}
      {!isPDPAAgreed && (
        <PDPA_modal isVisible={!isPDPAAgreed} onAgree={handlePDPAAgree} />
      )}

      {/* Select Form Modal */}
      <SelectFormModal
        isVisible={showSelectFormModal}
        onClose={() => setShowSelectFormModal(false)}
        onNavigateToReadMe={handleNavigateToReadMe}
        onNavigateToPrint={handleNavigateToPrint}
      />

      {/* ReadMe Modal */}
      <ReadMEmodal isVisible={showReadMe} onAgree={handleReadMeAgree} />

      <Routes>
        <Route
          path="/form"
          element={isPDPAAgreed ? <FormComponent /> : <Navigate to="/" />}
        />
        <Route
          path="/print"
          element={isPDPAAgreed ? <Print /> : <Navigate to="/" />}
        />
        {/* Default route */}
        <Route />
      </Routes>
    </div>
  );
}

function AppWrapper() {
  return (
    <Router>
      <App />
    </Router>
  );
}

export default AppWrapper;
