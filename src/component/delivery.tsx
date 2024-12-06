import React, { useState, useEffect } from "react";
import DeliveryUserInfo from "./deliveryComponent/deliveryUserInfo";
import DeliveryAddress from "./deliveryComponent/deliveryAddress";
import ResultDelivery from "./deliveryComponent/resultDelivery";
import TextInput from "./textFillComponent/textInput";
import TextSelect from "./textFillComponent/textSelect";
import RadioButton from "./textFillComponent/radioButton";
import FileInput from "./textFillComponent/fileInput";

// import { calculateDelivery } from "../data/calculateDelivery";

import { Form, Row, Col, Button, Alert } from "react-bootstrap";
import "@fortawesome/fontawesome-free/css/all.min.css";

// import { collection, addDoc } from "firebase/firestore";
// import { db } from "../firebaseConfig";

// interface DeliveryProps {
//   showSender: boolean;
// }

//delivery.tsx
const Delivery: React.FC = () => {
  const [usernameSender, setUsernameSender] = useState<string>("");
  const [contactNumSender, setContactNumSender] = useState<string>("");
  const [selectedRadio, setSelectedRadio] = useState<string | null>(null);
  const [ownerData, setOwnerData] = useState<string>("");
  const [houseNoSender, setHouseNoSender] = useState<string>("");
  const [soiSender, setSoiSender] = useState<string>("");
  const [villageNoSender, setVillageNoSender] = useState<string>("");
  const [dormitorySender, setDormitorySender] = useState<string>("");
  const [subDistrictSender, setSubDistrictSender] = useState<string | null>(
    null
  );
  const [districtSender, setDistrictSender] = useState<string | null>(null);
  const [postalCodeSender, setPostalCodeSender] = useState<string>("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
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
  const [showReceiver, setShowReceiver] = useState(false);

  const [isInvalidOwnerInfo, setInvalidOwnerInfo] = useState(false);
  const [isInvalidAddress, setIsInvalidAddress] = useState(false);
  const [isInvalidUserInfo, setIsInvalidUserInfo] = useState(false);
  const [isInvalidCCsizeCar, setIsInvalidCCsizeCar] = useState(false);

  const [selectedProvinceNameSender, setSelectedProvinceNameSender] = useState<
    string | null
  >(null);
  const [selectedDistrictNameSender, setSelectedDistrictNameSender] = useState<
    string | null
  >(null);
  const [selectedSubDistrictNameSender, setSelectedSubDistrictNameSender] =
    useState<string | null>(null);

  const [selectedProvinceNameReceiver, setSelectedProvinceNameReceiver] =
    useState<string | null>(null);
  const [selectedDistrictNameReceiver, setSelectedDistrictNameReceiver] =
    useState<string | null>(null);
  const [selectedSubDistrictNameReceiver, setSelectedSubDistrictNameReceiver] =
    useState<string | null>(null);

  // const [deliveryCost, setDeliveryCost] = useState<number | null>(null);

  const [selectedRegistrationBookFile, setSelectedRegistrationBookFile] =
    useState<File | null>(null);
  const [selectedIDcardVehicleFile, setSelectedIDcardVehicleFile] =
    useState<File | null>(null);

  useEffect(() => {
    if (selectDeliveryType === "ส่งของปกติ") {
      if (
        selectCarType !== "-" ||
        CCsizeCar !== "-" ||
        !selectedRegistrationBookFile ||
        !selectedIDcardVehicleFile
      ) {
        setSelectedCarType("-");
        setCCsizeCar("-");
        setSelectedRegistrationBookFile(
          new File(["dummy content"], "default_registration_book.png", {
            type: "image/png",
          })
        );
        setSelectedIDcardVehicleFile(
          new File(["dummy content"], "default_id_card.png", {
            type: "image/png",
          })
        );
      }
    } else if (selectDeliveryType !== "ส่งของปกติ" && CCsizeCar === "-") {
      setSelectedCarType("");
      setCCsizeCar("");
      setSelectedRegistrationBookFile(null);
      setSelectedIDcardVehicleFile(null);
    }

    // if (selectDeliveryType === "ส่งรถกลับบ้าน" && selectedProvinceNameReceiver && CCsizeCar) {
    //   const cost = calculateDelivery(selectedProvinceNameReceiver, parseInt(CCsizeCar));
    //   setDeliveryCost(cost);
    // } else {
    //   setDeliveryCost(null);
    // }

    const formSenderIsValid =
      !!(
        usernameSender &&
        contactNumSender &&
        ownerData &&
        selectedFile &&
        // soiSender &&
        houseNoSender &&
        villageNoSender &&
        // dormitorySender &&
        subDistrictSender &&
        districtSender &&
        postalCodeSender &&
        selectedProvinceSender
      ) &&
      isInvalidAddress &&
      isInvalidUserInfo &&
      !isInvalidOwnerInfo;

    const formReceiverIsValid =
      !!(
        (
          usernameReceiver &&
          contactNumReceiver &&
          houseNoReceiver &&
          // soiReceiver &&
          villageNoReceiver &&
          // dormitoryReceiver &&
          subDistrictReceiver &&
          districtReceiver &&
          postalCodeReceiver &&
          selectedProvinceReceiver &&
          selectDeliveryType &&
          selectCarType &&
          CCsizeCar &&
          selectedRegistrationBookFile
        )
        // selectedIDcardVehicleFile
      ) &&
      isInvalidUserInfo &&
      isInvalidAddress;

    setIsFormSenderValid(formSenderIsValid);
    setIsFormReceiverValid(formReceiverIsValid);

    // console.log({
    //   usernameSender,
    //   contactNumSender,
    //   ownerData,
    //   soiSender,
    //   houseNoSender,
    //   villageNoSender,
    //   dormitorySender,
    //   subDistrictSender,
    //   districtSender,
    //   postalCodeSender,
    //   selectedProvinceSender,
    //   isFormSenderValid,
    //   isFormReceiverValid,
    //   isInvalidOwnerInfo,
    //   isInvalidUserInfo,
    //   selectedProvinceNameSender,
    //   selectedDistrictNameSender,
    //   selectedSubDistrictNameSender,
    //   selectedRegistrationBookFile,
    // });
  }, [
    usernameSender,
    contactNumSender,
    selectedFile,
    ownerData,
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
    isInvalidOwnerInfo,
    isInvalidUserInfo,
    // selectedProvinceNameSender,
    // selectedDistrictNameSender,
    // selectedSubDistrictNameSender,
    // selectedProvinceNameReceiver,
    // selectedDistrictNameReceiver,
    // selectedSubDistrictNameReceiver,
    selectedRegistrationBookFile,
    selectedIDcardVehicleFile,
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

  const handleRadioChange = (value: string) => {
    setSelectedRadio(value);
    setOwnerData("");
    setValidated(false);
  };

  // const handleReceiverValidation = (isValid: boolean) => {
  //   setIsFormReceiverValid(isValid);
  // };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setValidated(true);

    if (isFormSenderValid) {
      setShowSender(false);
      setShowReceiver(true);
      setValidated(false);
    }
  };

  const handleBackToSender = () => {
    setShowSender(true);
    setShowReceiver(false);
    setValidated(false);
    setIsFormSenderValid(false);
    setSelectedFile(null);
  };

  const handleGoToReceiver = () => {
    setShowSender(false);
    setShowReceiver(true);
    setValidated(false);
    setIsFormSenderValid(true);
  };

  const handleBackToReceiver = () => {
    setShowSender(false);
    setShowReceiver(true);
    setValidated(false);
    setIsFormReceiverValid(false);
  };

  const handleGoToResult = () => {
    setShowSender(false);
    setShowReceiver(false);
    setValidated(false);
    setIsFormSenderValid(true);
    setIsFormReceiverValid(true);
  };

  const handleOwnerInfoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    let invalid = false;

    if (selectedRadio === "หมายเลขบัตรประชาชนของผู้ส่ง") {
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
    } else if (selectedRadio === "หมายเลขพาสปอร์ตของผู้ส่ง") {
      const passportPattern = /^[A-Za-z0-9]{8,9}$/; // Passport pattern
      invalid = value.length > 0 && !passportPattern.test(value);
    }

    setOwnerData(value);
    setInvalidOwnerInfo(invalid);
  };

  const handleCCsizeInputChange = (value: string) => {
    setCCsizeCar(value);
    const invalidNum = value.length > 0 && isNaN(Number(value));
    setIsInvalidCCsizeCar(invalidNum);
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
                  selectedFile={selectedFile}
                  setSelectedFile={setSelectedFile}
                  setIsFormValid={setIsFormSenderValid}
                  onValidateUserInfo={handleUserValidation}
                  showSender={showSender}
                />
              </Col>
            </Row>

            <Row>
              {/* เลือดประเภทข้อมูลของเจ้าของรถล่าสุด */}
              <Col className="mb-4" xs={12} sm={12} md={12} lg={8} xl={6}>
                <RadioButton
                  options={[
                    "หมายเลขบัตรประชาชนของผู้ส่ง",
                    "หมายเลขพาสปอร์ตของผู้ส่ง",
                  ]}
                  name="radioOptions"
                  label="ประเภทข้อมูลของผู้ส่ง"
                  selectedValue={selectedRadio}
                  onChange={handleRadioChange}
                  isInvalid={validated} // จะเป็น true เมื่อไม่มีการเลือกค่า
                  alertText="กรุณาเลือกประเภทข้อมูลเจ้าของรถ" // ข้อความแจ้งเตือน
                />
              </Col>
              {/* ช่องกรอกตามประเภทข้อมูลของเจ้าของรถล่าสุด */}
              {selectedRadio && (
                <Col
                  className="date-idNo-carType-Input mb-4"
                  md={12}
                  xs={6}
                  lg={4}
                  xl={6}
                >
                  <TextInput
                    label={
                      selectedRadio === "หมายเลขบัตรประชาชนของผู้ส่ง"
                        ? "กรอกหมายเลขบัตรประชาชน"
                        : selectedRadio === "หมายเลขพาสปอร์ตของผู้ส่ง"
                        ? "กรอกหมายเลขพาสปอร์ต"
                        : "โปรดเลือกประเภทข้อมูลเจ้าของรถ"
                    }
                    placeholder={
                      selectedRadio === "หมายเลขบัตรประชาชนของผู้ส่ง"
                        ? "กรอกหมายเลขบัตรประชาชน"
                        : selectedRadio === "หมายเลขพาสปอร์ตของผู้ส่ง"
                        ? "กรอกหมายเลขพาสปอร์ต"
                        : ""
                    }
                    id="ownerData"
                    value={ownerData}
                    type="numeric"
                    onChange={handleOwnerInfoChange}
                    isInvalid={isInvalidOwnerInfo}
                    alertText={
                      isInvalidOwnerInfo
                        ? selectedRadio === "หมายเลขบัตรประชาชนของผู้ส่ง"
                          ? ownerData.length < 13
                            ? "กรอกหมายเลขบัตรประชาชนให้ครบถ้วน"
                            : "หมายเลขบัตรประชาชนไม่ถูกต้อง"
                          : ownerData.length < 8
                          ? "กรอกหมายเลขพาสปอร์ตให้ครบถ้วน"
                          : "กรอกหมายเลขพาสปอร์ตให้ถูกต้อง"
                        : ""
                    }
                    // disabled={!selectedRadio}
                    required
                  />
                </Col>
              )}
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
              selectedProvinceName={selectedProvinceNameSender}
              setSelectedProvinceName={setSelectedProvinceNameSender}
              selectedDistrictName={selectedDistrictNameSender}
              setSelectedDistrictName={setSelectedDistrictNameSender}
              selectedSubDistrictName={selectedSubDistrictNameSender}
              setSelectedSubDistrictName={setSelectedSubDistrictNameSender}
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
                    onClick={handleGoToReceiver}
                    disabled={!isFormSenderValid}
                  >
                    ถัดไป
                  </Button>
                </Col>
              </Row>
              {!isFormSenderValid && (
                <Alert
                  variant="success"
                  className="d-flex align-items-center mb-4 mt-3"
                >
                  <i className="fas fa-exclamation-triangle me-2"></i>
                  <span>กรุณากรอกข้อมูลและรูปภาพให้ครบถ้วนและถูกต้อง</span>
                </Alert>
              )}
            </footer>
          </>
        ) : showReceiver ? (
          <>
            <h2 className="text-center mb-4 text-success">ข้อมูลผู้รับ</h2>
            <DeliveryUserInfo
              isInvalid={validated}
              username={usernameReceiver}
              setUsername={setUsernameReceiver}
              contactNum={contactNumReceiver}
              setContactNum={setContactNumReceiver}
              selectedFile={selectedFile}
              setSelectedFile={setSelectedFile}
              setIsFormValid={setIsFormReceiverValid}
              onValidateUserInfo={handleUserValidation}
              showSender={showSender}
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
                  selectedProvinceName={selectedProvinceNameReceiver}
                  setSelectedProvinceName={setSelectedProvinceNameReceiver}
                  selectedDistrictName={selectedDistrictNameReceiver}
                  setSelectedDistrictName={setSelectedDistrictNameReceiver}
                  selectedSubDistrictName={selectedSubDistrictNameReceiver}
                  setSelectedSubDistrictName={
                    setSelectedSubDistrictNameReceiver
                  }
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
            {selectDeliveryType == "ส่งรถกลับบ้าน" && (
              <Row>
                <Col
                  className="register-and-contract-number mb-4"
                  xs={12}
                  sm={6}
                  md={6}
                  lg={6}
                  xl={6}
                >
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
                    placeholder="เลือกประเภทรถ"
                    onChange={(value) => {
                      if (value !== null) setSelectedCarType(value);
                    }}
                    required
                    isInvalid={validated}
                    alertText="กรุณาเลือกประเภทรถ"
                  />
                </Col>
                <Col className="mb-4" xs={12} sm={6} md={6} lg={6} xl={6}>
                  <TextInput
                    id="CCsizeCar"
                    label="ขนาดความจุ CC"
                    value={CCsizeCar}
                    placeholder="กรอกขนาดความจุ(CC)"
                    onChange={(e) => handleCCsizeInputChange(e.target.value)}
                    isInvalid={isInvalidCCsizeCar}
                    alertText="กรุณากรอกขนาดความจุ CC ให้ถูกต้อง"
                    required
                  />
                </Col>

                <Col className="mb-4" xs={12} sm={12} md={12} lg={6} xl={6}>
                  <FileInput
                    label="สำเนาภาพเล่มทะเบียนรถ (รองรับ .png, .jpg)"
                    onFileSelect={(file) =>
                      setSelectedRegistrationBookFile(file)
                    }
                    accept=".jpg, .png"
                    isInvalid={!selectedFile}
                    alertText="กรุณาเลือกไฟล์ที่ต้องการปริ้น"
                  />
                </Col>
                <Col className="mb-4" xs={12} sm={12} md={12} lg={6} xl={6}>
                  <FileInput
                    label="สำเนาบัตรประชาชนผู้มีชื่อในสำเนารถ (กรณีเจ้าของไม่ได้ดำเนินการเอง)"
                    onFileSelect={(file) => setSelectedIDcardVehicleFile(file)}
                    accept=".jpg, .png"
                    isInvalid={!selectedFile}
                    alertText="กรุณาเลือกไฟล์ที่ต้องการปริ้น"
                  />
                </Col>
              </Row>
            )}

            <hr className="my-4" />
            <footer>
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
                    onClick={handleGoToResult}
                    disabled={!isFormReceiverValid}
                  >
                    ถัดไป
                  </Button>
                </Col>
              </Row>
              {!isFormReceiverValid && (
                <Alert
                  variant="success"
                  className="d-flex align-items-center mb-4"
                >
                  <i className="fas fa-exclamation-triangle me-2"></i>
                  <span>กรุณากรอกข้อมูลและรูปภาพให้ครบถ้วนและถูกต้อง</span>
                </Alert>
              )}
            </footer>
          </>
        ) : (
          <>
            <h2 className="text-center mb-4 text-success">
              สรุปข้อมูลผู้ส่ง/ผู้รับ
            </h2>
            <ResultDelivery
              deliveryType={selectDeliveryType || ""}
              senderInfo={{
                username: usernameSender,
                contactNumber: contactNumSender,
                ownerData: ownerData,
                dormitory: dormitorySender,
                soi: soiSender,
                houseNo: houseNoSender,
                villageNo: villageNoSender,
                subDistrict: selectedSubDistrictNameSender || "",
                district: selectedDistrictNameSender || "",
                province: selectedProvinceNameSender || "",
                postalCode: postalCodeSender,
                selectedFilePath: selectedFile ? selectedFile.name : "",
              }}
              receiverInfo={{
                username: usernameReceiver,
                contactNumber: contactNumReceiver,
                dormitory: dormitoryReceiver,
                soi: soiReceiver,
                houseNo: houseNoReceiver,
                villageNo: villageNoReceiver,
                subDistrict: selectedSubDistrictNameReceiver || "",
                district: selectedDistrictNameReceiver || "",
                province: selectedProvinceNameReceiver || "",
                postalCode: postalCodeReceiver,
              }}
              vehicleInfo={
                selectDeliveryType === "ส่งรถกลับบ้าน"
                  ? {
                      carType: selectCarType || "",
                      ccSize: CCsizeCar ? parseFloat(CCsizeCar) : 0, // แปลง string เป็น number
                      registrationBookFilePath: selectedRegistrationBookFile
                        ? selectedRegistrationBookFile.name
                        : null, // ใช้ null สำหรับค่าที่ไม่มี
                      idCardFilePath: selectedIDcardVehicleFile
                        ? selectedIDcardVehicleFile.name
                        : null, // ใช้ null สำหรับค่าที่ไม่มี
                    }
                  : undefined
              }
              onBack={handleBackToReceiver} // ฟังก์ชันสำหรับย้อนกลับ
            />
          </>
        )}
      </Form>
    </div>
  );
};

export default Delivery;
