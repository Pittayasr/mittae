import { useState } from "react";
import PDPA_modal from "./component/PDPAmodal";
import ReadMEmodal from "./component/ReadMEmodal";
import SelectFormModal from "./component/selectFromModal";
import FormComponent from "./component/form";
import Print from "./component/print"; // Import the Print component
import "./App.css";

function App() {
  const [isPDPAAgreed, setIsPDPAAgreed] = useState(false);
  const [showReadMe, setShowReadMe] = useState(false);
  const [showSelectFormModal, setShowSelectFormModal] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [showPrint, setShowPrint] = useState(false); // State to handle Print component

  const handlePDPAAgree = () => {
    setIsPDPAAgreed(true);
    setShowSelectFormModal(true); // Show SelectFormModal after agreeing to PDPA
  };

  const handleNavigateToReadMe = () => {
    setShowSelectFormModal(false);
    setShowReadMe(true);
  };

  const handleReadMeAgree = () => {
    setShowReadMe(false); // Hide ReadMeModal
    setShowForm(true); // Show form after agreeing to ReadMe
  };

  const handleNavigateToPrint = () => {
    setShowSelectFormModal(false);
    setShowPrint(true); // Show Print component
  };

  return (
    <div className="container my-5">
      {/* PDPA Modal */}
      <PDPA_modal isVisible={!isPDPAAgreed} onAgree={handlePDPAAgree} />

      {/* Select Form Modal */}
      <SelectFormModal
        isVisible={showSelectFormModal}
        onClose={() => setShowSelectFormModal(false)}
        onNavigateToReadMe={handleNavigateToReadMe}
        onNavigateToPrint={handleNavigateToPrint}
      />

      {/* ReadMe Modal */}
      <ReadMEmodal isVisible={showReadMe} onAgree={handleReadMeAgree} />

      {/* แสดงฟอร์มเมื่อยอมรับเงื่อนไข */}
      {showForm && (
        <div className="form-container mx-auto">
          <FormComponent />
        </div>
      )}

      {/* แสดง Print เมื่อเลือกไปที่หน้า Print */}
      {showPrint && (
        <div className="form-container mx-auto">
          <Print />
        </div>
      )}
    </div>
  );
}

export default App;
