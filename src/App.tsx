import React, { useState } from "react";
import PDPA_modal from "./PDPAmodal";
import FormComponent from "./from";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";

function App() {
  const [isPDPAAgreed, setIsPDPAAgreed] = useState(false);

  return (
    <div className="container my-3">
      <PDPA_modal
        isVisible={!isPDPAAgreed}
        onAgree={() => setIsPDPAAgreed(true)}
      />
      {isPDPAAgreed && (
        <div className="form-container mx-auto">
          <h4 className="mb-3 text-center">รถจักรยานยนต์</h4>
          <FormComponent />
        </div>
      )}
    </div>
  );
}

export default App;
