import React, { useState, useEffect } from "react";
import DeliveryUserInfo from "./deliveryComponent/deliveryUserInfo";
import DeliveryAddress from "./deliveryComponent/deliveryAddress";
import TextInput from "./textFillComponent/textInput";
import TextSelect from "./textFillComponent/textSelect";
import { Form, Row, Col, Button, Alert } from "react-bootstrap";
import "@fortawesome/fontawesome-free/css/all.min.css";

//delivery.tsx
const Delivery: React.FC = () => {
  const [usernameSender, setUsernameSender] = useState<string>("");
  const [contactNumSender, setContactNumSender] = useState<string>("");
  const [NoIDcardSender, setNoIDcardSender] = useState<string>("");
  const [houseNoSender, setHouseNoSender] = useState<string>("");
  const [soiSender, setSoiSender] = useState<string>("");
  const [villageNoSender, setVillageNoSender] = useState<string>("");
  const [dormitorySender, setDormitorySender] = useState<string>("");
  const [subDistrictSender, setSubDistrictSender] = useState<string | null>(
    null
  );
  const [districtSender, setDistrictSender] = useState<string | null>(null);
  const [postalCodeSender, setPostalCodeSender] = useState<string>("");
  const [selectedProvinceSender, setSelectedProvinceSender] = useState<
    string | null
  >(null);

  const [usernameReceiver, setUsernameReceiver] = useState<string>("");
  const [contactNumReceiver, setContactNumReceiver] = useState<string>("");
  const [houseNoReceiver, setHouseNoReceiver] = useState<string>("");
  const [soiReceiver, setSoiReceiver] = useState<string>("");
  const [villageNoReceiver, setVillageNoReceiver] = useState<string>("");
  const [dormitoryReceiver, setDormitoryReceiver] = useState<string>("");
  const [subDistrictReceiver, setSubDistrictReceiver] = useState<string | null>(
    null
  );
  const [districtReceiver, setDistrictReceiver] = useState<string | null>(null);
  const [postalCodeReceiver, setPostalCodeReceiver] = useState<string>("");
  const [selectedProvinceReceiver, setSelectedProvinceReceiver] = useState<
    string | null
  >(null);
  const [selectDeliveryType, setSelectedDeliveryType] = useState<string | null>(
    null
  );
  const [selectCarType, setSelectedCarType] = useState<string | null>(null);
  const [CCsizeCar, setCCsizeCar] = useState<string>("");

  const [validated, setValidated] = useState(false);
  const [isFormSenderValid, setIsFormSenderValid] = useState(false);
  const [isFormReceiverValid, setIsFormReceiverValid] = useState(false);
  const [showSender, setShowSender] = useState(true);

  const [isInvalidNoIDcard, setIsInvalidNoIDcard] = useState(false);
  const [isInvalidAddress, setIsInvalidAddress] = useState(false);
  const [isInvalidUserInfo, setIsInvalidUserInfo] = useState(false);

  useEffect(() => {
    const formSenderIsValid =
      !!(
        usernameSender &&
        contactNumSender &&
        NoIDcardSender &&
        soiSender &&
        houseNoSender &&
        villageNoSender &&
        dormitorySender &&
        subDistrictSender &&
        districtSender &&
        postalCodeSender &&
        selectedProvinceSender
      ) &&
      isInvalidAddress &&
      isInvalidUserInfo &&
      !isInvalidNoIDcard;

    const formReceiverIsValid =
      !!(
        usernameReceiver &&
        contactNumReceiver &&
        houseNoReceiver &&
        soiReceiver &&
        houseNoReceiver &&
        villageNoReceiver &&
        dormitoryReceiver &&
        subDistrictReceiver &&
        districtReceiver &&
        postalCodeReceiver &&
        selectedProvinceReceiver &&
        selectDeliveryType &&
        selectCarType &&
        CCsizeCar
      ) &&
      isInvalidUserInfo &&
      isInvalidAddress;

    setIsFormSenderValid(formSenderIsValid);
    setIsFormReceiverValid(formReceiverIsValid);

    console.log({
      usernameSender,
      contactNumSender,
      NoIDcardSender,
      soiSender,
      houseNoSender,
      villageNoSender,
      dormitorySender,
      subDistrictSender,
      districtSender,
      postalCodeSender,
      selectedProvinceSender,
      isFormSenderValid,
      isFormReceiverValid,
      isInvalidNoIDcard,
      isInvalidUserInfo,
    });
  }, [
    usernameSender,
    contactNumSender,
    NoIDcardSender,
    soiSender,
    villageNoSender,
    houseNoSender,
    dormitorySender,
    subDistrictSender,
    districtSender,
    postalCodeSender,
    selectedProvinceSender,
    usernameReceiver,
    contactNumReceiver,
    houseNoReceiver,
    soiReceiver,
    villageNoReceiver,
    dormitoryReceiver,
    subDistrictReceiver,
    districtReceiver,
    postalCodeReceiver,
    selectedProvinceReceiver,
    selectDeliveryType,
    selectCarType,
    CCsizeCar,
    isFormSenderValid,
    isFormReceiverValid,
    isInvalidAddress,
  ]);

  const handleAddressValidation = (validations: {
    isInvalidHouseNo: boolean;
    isInvalidSoi: boolean;
    isInvalidVillageNo: boolean;
    isInvalidDormitory: boolean;
    isInvalidPostalCode: boolean;
  }) => {
    const isValid = !Object.values(validations).includes(true); // ถ้ามี false หมายถึงฟอร์ม valid
    setIsInvalidAddress(isValid);
  };

  const handleUserValidation = (validations: {
    isInvalidUsername: boolean;
    isInvalidContactNum: boolean;
  }) => {
    const isValid = !Object.values(validations).includes(true); // ถ้ามี false หมายถึงฟอร์ม valid
    setIsInvalidUserInfo(isValid);
  };

  // const handleReceiverValidation = (isValid: boolean) => {
  //   setIsFormReceiverValid(isValid);
  // };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setValidated(true);

    if (isFormSenderValid) {
      setShowSender(false);
      setValidated(false);
    }
  };

  const handleBackToSender = () => {
    setShowSender(true);
    setValidated(false);
  };

  const handleNoIDcardChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    let invalid = false;

    const idCardPattern = /^\d{13}$/; // ID card pattern
    invalid = value.length > 0 && !idCardPattern.test(value);

    if (!invalid) {
      // ตรวจสอบการคำนวณเลขหลักที่ 13
      const idArray = value.split("").map(Number); // แยกตัวเลขแต่ละหลัก
      let sum = 0;

      for (let i = 0; i < 12; i++) {
        sum += idArray[i] * (13 - i); // คูณเลขแต่ละหลักด้วยตำแหน่งที่สอดคล้อง
      }

      const checkDigit = (11 - (sum % 11)) % 10; // คำนวณเลขตรวจสอบ (หลักที่ 13)

      // ตรวจสอบว่าเลขหลักที่ 13 ตรงกับเลขตรวจสอบหรือไม่
      invalid = idArray[12] !== checkDigit;
    }

    setNoIDcardSender(value);
    setIsInvalidNoIDcard(invalid);

    // ตรวจสอบสถานะฟอร์มที่ครบถ้วนว่าถูกต้องหรือไม่
    setIsFormSenderValid(!invalid);
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
            <Row>
              <Col>
                <DeliveryUserInfo
                  isInvalid={validated}
                  username={usernameSender}
                  setUsername={setUsernameSender}
                  contactNum={contactNumSender}
                  setContactNum={setContactNumSender}
                  setIsFormValid={setIsFormSenderValid}
                  onValidateUserInfo={handleUserValidation}
                />
              </Col>
              <Col className="mb-4" md={4} xs={12}>
                <TextInput
                  id="userName"
                  label="กรอกหมายเลขบัตรประชาชน"
                  value={NoIDcardSender}
                  placeholder="กรอกหมายเลขบัตรประชาชน"
                  onChange={handleNoIDcardChange}
                  isInvalid={isInvalidNoIDcard}
                  alertText={
                    isInvalidNoIDcard
                      ? NoIDcardSender.length < 13
                        ? "กรอกหมายเลขบัตรประชาชนให้ครบถ้วน"
                        : "หมายเลขบัตรประชาชนไม่ถูกต้อง"
                      : ""
                  }
                  required
                  type="numeric"
                />
              </Col>
            </Row>

            <DeliveryAddress
              isInvalid={false}
              houseNo={houseNoSender}
              setHouseNo={setHouseNoSender}
              soi={soiSender}
              setSoi={setSoiSender}
              villageNo={villageNoSender}
              setVillageNo={setVillageNoSender}
              dormitory={dormitorySender}
              setDormitory={setDormitorySender}
              selectedSubDistrict={subDistrictSender}
              setSelectedSubDistrict={setSubDistrictSender}
              selectedDistrict={districtSender}
              setSelectedDistrict={setDistrictSender}
              postalCode={postalCodeSender}
              setPostalCode={setPostalCodeSender}
              selectedProvince={selectedProvinceSender}
              setSelectedProvince={setSelectedProvinceSender}
              selectDeliveryType={selectDeliveryType}
              setSelectedDeliveryType={setSelectedDeliveryType}
              showSender={showSender}
              setIsFormValid={setIsFormSenderValid}
              onValidateAddress={handleAddressValidation}
            />

            <hr className="my-4" />
            <footer>
              <Row className="mb-2 ">
                <Col className="mb-2 form-button-container">
                  <Button
                    className="form-button"
                    type="submit"
                    variant="success"
                    disabled={!isFormSenderValid}
                  >
                    ถัดไป
                  </Button>
                </Col>
              </Row>
            </footer>
            {!isFormSenderValid && (
              <Alert
                variant="success"
                className="d-flex align-items-center mb-4 mt-3"
              >
                <i className="fas fa-exclamation-triangle me-2"></i>
                <span>กรุณากรอกข้อมูลให้ครบถ้วนและถูกต้อง</span>
              </Alert>
            )}
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
              setIsFormValid={setIsFormReceiverValid}
              onValidateUserInfo={handleUserValidation}
            />

            <Row>
              <Col>
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
                  selectedSubDistrict={subDistrictReceiver}
                  setSelectedSubDistrict={setSubDistrictReceiver}
                  selectedDistrict={districtReceiver}
                  setSelectedDistrict={setDistrictReceiver}
                  postalCode={postalCodeReceiver}
                  setPostalCode={setPostalCodeReceiver}
                  selectedProvince={selectedProvinceReceiver}
                  setSelectedProvince={setSelectedProvinceReceiver}
                  selectDeliveryType={selectDeliveryType}
                  setSelectedDeliveryType={setSelectedDeliveryType}
                  showSender={showSender}
                  setIsFormValid={setIsFormReceiverValid}
                  onValidateAddress={handleAddressValidation}
                />
              </Col>
            </Row>
            <Row>
              <Col className="register-and-contract-number mb-4" md={4} xs={6}>
                <TextSelect
                  value={selectCarType || ""}
                  label="ประเภทรถจักรยานยนตร์"
                  id="CarType"
                  options={[
                    {
                      label: "รถจักรยานยนต์ทั่วไป",
                      value: "รถจักรยานยนต์ทั่วไป",
                    },
                    { label: "บิ๊กไบค์", value: "บิ๊กไบค์" },
                    { label: "ชอปเปอร์", value: "ชอปเปอร์" },
                  ]}
                  placeholder="เลือกอำเภอ"
                  onChange={(value) => {
                    if (value !== null) setSelectedCarType(value);
                  }}
                  required
                  isInvalid={isFormReceiverValid}
                  alertText="กรุณาเลือกอำเภอ"
                />
              </Col>
              <Col className="mb-4" md={4} xs={12}>
                <TextInput
                  id="CCsizeCar"
                  label="ขนาดความจุ CC"
                  value={CCsizeCar}
                  placeholder="กรอกขนาดความจุ(CC)"
                  onChange={(e) => setCCsizeCar(e.target.value)}
                  isInvalid={isFormReceiverValid}
                  alertText="กรุณากรอกชื่อให้ถูกต้อง"
                  required
                />
              </Col>
            </Row>

            <hr className="my-4" />
            <footer>
              {!isFormReceiverValid && (
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
                    disabled={!isFormReceiverValid}
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

export default Delivery;
