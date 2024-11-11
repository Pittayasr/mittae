import { useState } from "react";
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
import "./App.css";
import SelectFormModal from "./component/selectFromModal";

function App() {
  const [isPDPAAgreed, setIsPDPAAgreed] = useState(false);
  const [showSelectFormModal, setShowSelectFormModal] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();

  const handlePDPAAgree = () => {
    setIsPDPAAgreed(true);
  };

  const handleNavigateToForm = () => {
    setShowSelectFormModal(false);
    navigate("/form");
  };

  const handleNavigateToPrint = () => {
    setShowSelectFormModal(false);
    navigate("/print");
  };

  if (
    !isPDPAAgreed &&
    (location.pathname === "/form" || location.pathname === "/print")
  ) {
    return <PDPA_modal isVisible={!isPDPAAgreed} onAgree={handlePDPAAgree} />;
  }

  // const handleReadMeAgree = () => {
  //   setShowReadMe(false);
  // };

  return (
    <div className="container my-3">
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
        <Route
          path="/"
          element={
            <SelectFormModal
              isVisible={showSelectFormModal}
              onClose={() => setShowSelectFormModal(false)}
              onNavigateToReadMe={handleNavigateToForm}
              onNavigateToPrint={handleNavigateToPrint}
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
    <Router>
      <App />
    </Router>
  );
}

export default AppWrapper;
