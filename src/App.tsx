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
import Delivery from "./component/delivery";
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
    // setShowSelectFormModal(false);
    navigate("/form");
  };

  const handleNavigateToPrint = () => {
    // setShowSelectFormModal(false);
    navigate("/print");
  };

  const handleNavigateToDelivery = () => {
    // setShowSelectFormModal(false);
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
        <Route
          path="/delivery"
          element={isPDPAAgreed ? <Delivery /> : <Navigate to="/" />}
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
