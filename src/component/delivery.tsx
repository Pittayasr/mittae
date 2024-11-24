import React, { useState } from "react";
import DeliveryUserInfo from "./deliveryComponent/deliveryUserInfo";
import DeliveryAddress from "./deliveryComponent/deliveryAddress";
import { Form, Row, Col, Button, Alert } from "react-bootstrap";
import "@fortawesome/fontawesome-free/css/all.min.css";

const DeliverySender: React.FC = () => {
  const [usernameSender, setUsernameSender] = useState<string>("");
  const [contactNumSender, setContactNumSender] = useState<string>("");
  const [NoIDcardSender, setNoIDcardSender] = useState<string>("");
  const [houseNoSender, setHouseNoSender] = useState<string>("");
  const [soiSender, setSoiSender] = useState<string>("");
  const [villageNoSender, setVillageNoSender] = useState<string>("");
  const [dormitorySender, setDormitorySender] = useState<string>("");
  const [subDistrictSender, setSubDistrictSender] = useState<string>("");
  const [districtSender, setDistrictSender] = useState<string>("");
  const [postalCodeSender, setPostalCodeSender] = useState<string>("");
  const [selectedProvinceSender, setSelectedProvinceSender] = useState<
    string | null
  >(null);

  const [usernameReceiver, setUsernameReceiver] = useState<string>("");
  const [contactNumReceiver, setContactNumReceiver] = useState<string>("");
  const [NoIDcardReceiver, setNoIDcardReceiver] = useState<string>("");
  const [houseNoReceiver, setHouseNoReceiver] = useState<string>("");
  const [soiReceiver, setSoiReceiver] = useState<string>("");
  const [villageNoReceiver, setVillageNoReceiver] = useState<string>("");
  const [dormitoryReceiver, setDormitoryReceiver] = useState<string>("");
  const [subDistrictReceiver, setSubDistrictReceiver] = useState<string>("");
  const [districtReceiver, setDistrictReceiver] = useState<string>("");
  const [postalCodeReceiver, setPostalCodeReceiver] = useState<string>("");
  const [selectedProvinceReceiver, setSelectedProvinceReceiver] = useState<
    string | null
  >(null);

  const [validated, setValidated] = useState(false);
  const [isFormValid, setIsFormValid] = useState(false);
  const [showSender, setshowSender] = useState(true);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setValidated(true);

    if (isFormValid) {
      setshowSender(false);
    }
  };

  const handleBackToSender = () => {
    setshowSender(true);
    setValidated(false);
  };

  return (
    <div className="form-container mx-auto">
      <Form
        className="form"
        noValidate
        validated={validated}
        onSubmit={handleSubmit}
      >
        {showSender ? (
          <>
            <h2 className="text-center mb-4 text-success">ข้อมูลผู้ส่ง</h2>
            <DeliveryUserInfo
              isInvalid={validated}
              username={usernameSender}
              setUsername={setUsernameSender}
              contactNum={contactNumSender}
              setContactNum={setContactNumSender}
              NoIDcard={NoIDcardSender}
              setNoIDcard={setNoIDcardSender}
              setIsFormValid={setIsFormValid}
            />
            <DeliveryAddress
              isInvalid={validated}
              houseNo={houseNoSender}
              setHouseNo={setHouseNoSender}
              soi={soiSender}
              setSoi={setSoiSender}
              villageNo={villageNoSender}
              setVillageNo={setVillageNoSender}
              dormitory={dormitorySender}
              setDormitory={setDormitorySender}
              subDistrict={subDistrictSender}
              setSubDistrict={setSubDistrictSender}
              district={districtSender}
              setDistrict={setDistrictSender}
              postalCode={postalCodeSender}
              setPostalCode={setPostalCodeSender}
              selectedProvince={selectedProvinceSender}
              setSelectedProvince={setSelectedProvinceSender}
              setIsFormValid={setIsFormValid}
            />
            <hr className="my-4" />
            <footer>
              {!isFormValid && (
                <Alert
                  variant="success"
                  className="d-flex align-items-center mb-4"
                >
                  <i className="fas fa-exclamation-triangle me-2"></i>
                  <span>กรุณากรอกข้อมูลให้ครบถ้วน</span>
                </Alert>
              )}
              <Row className="mb-2 ">
                <Col className="mb-2 form-button-container">
                  <Button
                    className="form-button"
                    type="submit"
                    variant="success"
                    disabled={!isFormValid}
                  >
                    ถัดไป
                  </Button>
                </Col>
              </Row>
            </footer>
          </>
        ) : (
          <>
            <h2 className="text-center mb-4 text-success">ข้อมูลผู้รับ</h2>
            <DeliveryUserInfo
              isInvalid={validated}
              username={usernameReceiver}
              setUsername={setUsernameReceiver}
              contactNum={contactNumReceiver}
              setContactNum={setContactNumReceiver}
              NoIDcard={NoIDcardReceiver}
              setNoIDcard={setNoIDcardReceiver}
              setIsFormValid={setIsFormValid}
            />
            <DeliveryAddress
              isInvalid={validated}
              houseNo={houseNoReceiver}
              setHouseNo={setHouseNoReceiver}
              soi={soiReceiver}
              setSoi={setSoiReceiver}
              villageNo={villageNoReceiver}
              setVillageNo={setVillageNoReceiver}
              dormitory={dormitoryReceiver}
              setDormitory={setDormitoryReceiver}
              subDistrict={subDistrictReceiver}
              setSubDistrict={setSubDistrictReceiver}
              district={districtReceiver}
              setDistrict={setDistrictReceiver}
              postalCode={postalCodeReceiver}
              setPostalCode={setPostalCodeReceiver}
              selectedProvince={selectedProvinceReceiver}
              setSelectedProvince={setSelectedProvinceReceiver}
              setIsFormValid={setIsFormValid}
            />
            <hr className="my-4" />
            <footer>
              {!isFormValid && (
                <Alert
                  variant="success"
                  className="d-flex align-items-center mb-4"
                >
                  <i className="fas fa-exclamation-triangle me-2"></i>
                  <span>กรุณากรอกข้อมูลให้ครบถ้วน</span>
                </Alert>
              )}
              <Row className="mb-2 ">
                <Col className="mb-2 form-button-container">
                  <Button
                    className="form-button mx-3"
                    type="button"
                    variant="outline-success"
                    onClick={handleBackToSender}
                  >
                    ย้อนกลับ
                  </Button>
                  <Button
                    className="form-button"
                    type="submit"
                    variant="success"
                    disabled={!isFormValid}
                  >
                    ถัดไป
                  </Button>
                </Col>
              </Row>
            </footer>
          </>
        )}
      </Form>
    </div>
  );
};

export default DeliverySender;
