import React, { useState } from "react";
import PDPA_modal from "./component/PDPAmodal";
import ReadMEmodal from "./component/ReadMEmodal";
import FormComponent from "./component/form";
import "./App.css";

function App() {
  const [isPDPAAgreed, setIsPDPAAgreed] = useState(false);
  const [showReadMe, setShowReadMe] = useState(false);
  const [showForm, setShowForm] = useState(false);

  const handlePDPAAgree = () => {
    setIsPDPAAgreed(true);
    setShowReadMe(true); // แสดง ReadMEmodal เมื่อยอมรับ PDPA
  };

  const handleReadMeAgree = () => {
    setShowReadMe(false); // ซ่อน ReadMEmodal
    setShowForm(true); // แสดงฟอร์ม
  };

  return (
    <div className="container my-5">
      {/* PDPA Modal */}
      <PDPA_modal isVisible={!isPDPAAgreed} onAgree={handlePDPAAgree} />

      {/* ReadMe Modal */}
      <ReadMEmodal isVisible={showReadMe} onAgree={handleReadMeAgree} />

      {/* แสดงฟอร์มเมื่อยอมรับเงื่อนไข */}
      {showForm && (
        <div className="form-container mx-auto">
          {/* <h4 className="mb-3 text-center">รถจักรยานยนต์</h4> */}
          <FormComponent />
        </div>
      )}
    </div>
  );
}

export default App;
