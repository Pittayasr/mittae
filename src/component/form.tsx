//form.tsx
import React, { useState, useEffect } from "react";
import UserInfo from "./formComponent/UserInfo";
import DateSection from "./formComponent/DateSection";
import VehicleInfo from "./formComponent/VehicleInfo";
import OwnerInfo from "./formComponent/OwnerInfo";
import ReadMe from "./formComponent/formReadME";
import { Form, Row, Col, Button, Alert } from "react-bootstrap";
import { Dayjs } from "dayjs";
import { calculateTax, calculateCarAge } from "../data/calculateTax";
import Summary from "./formComponent/summary";
import "@fortawesome/fontawesome-free/css/all.min.css";
import FileInput from "./textFillComponent/fileInput";
import ScrollToTopAndBottomButton from "./ScrollToTopAndBottomButton";
import SidebarUser from "./textFillComponent/sidebarUser";
import useNavigationBlocker from "./useNavigationBlocker";

const FormComponent: React.FC = () => {
  const [usernameData, setUsernameData] = useState<string>("ทดสอบ");
  const [selectedProvince, setSelectedProvince] = useState<string | null>(null);
  const [selectedProvinceName, setSelectedProvinceName] = useState<
    string | null
  >(null);
  const [selectedCarType, setSelectedCarType] = useState<string | null>(null);
  const [selectedFuelType, setSelectedFuelType] = useState<string | null>(null);
  const [selectedCarSeat, setSelectedCarSeat] = useState<string | null>(null);
  const [registrationDate, setRegistrationDate] = useState<Dayjs | null>(null);
  const [expirationDate, setExpirationDate] = useState<Dayjs | null>(null);
  const [latestTaxPaymentDate, setLatestTaxPaymentDate] =
    useState<Dayjs | null>(null);
  const [missedTaxPayment, setMissedTaxPayment] = useState<string | null>(null);
  const [carMoreThan5Years, setCarMoreThan5Years] = useState(false);
  const [isRegistrationCancelled, setIsRegistrationCancelled] = useState(false);
  const [selectedRadio, setSelectedRadio] = useState<string | null>(
    "หมายเลขบัตรประชาชนเจ้าของรถล่าสุด"
  );
  const [ownerData, setOwnerData] = useState<string>("11111111111");
  const [registrationNumber, setRegistrationNumber] =
    useState<string>("กก1234");
  const [contactNumber, setContactNumber] = useState<string>("0666666666");
  const [engineSize, setEngineSize] = useState<string>("");
  const [totalCost, setTotalCost] = useState<number | null>(null);
  const [finalPrb, setFinalPrb] = useState<number | null>(null);
  const [finalTax, setFinalTax] = useState<number | null>(null);
  const [lateFee, setLateFee] = useState<number | null>(null);
  const [inspectionFee, setInspectionFee] = useState<number | null>(null);
  const [processingFee, setProcessingFee] = useState<number | null>(null);
  const [registrationFee, setRegistrationFee] = useState<number | null>(null);
  const [taxAnotherYear, setTaxAnotherYear] = useState<number | null>(null);
  const [bikeTypeOrDoorCount, setBikeTypeOrDoorCount] = useState<string | null>(
    null
  );
  const [selectedRegistrationBookFile, setSelectedRegistrationBookFile] =
    useState<File | null>(null);
  const [selectedLicenseFile, setSelectedLicenseFile] = useState<File | null>(
    null
  );

  const [ownerLabel, setOwnerLabel] = useState<string>("");

  const [isInvalidUserInfo, setIsInvalidUserInfo] = useState(false);
  const [isInvalidOwnerInfo, setIsInvalidOwnerInfo] = useState(false);
  const [isInvalidVehicleInfo, setIsInvalidVehicleInfo] = useState(false);

  const [validated, setValidated] = useState(false);
  const [isFormValid, setIsFormValid] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [showForm, setShowForm] = useState(true);
  const [showReadME, setShowReadME] = useState(true);
  const [CCorWeightLabel, setCCorWeightLabel] = useState<string>("");

  const { NavigationBlockerModal } = useNavigationBlocker(true);

  useEffect(() => {
    if (registrationDate) {
      const age = calculateCarAge(registrationDate);
      setCarAge(age);
      // console.log("Car Age Calculated:", age);
    }

    if (
      selectedCarType === "รถพ่วงทั่วไป" ||
      selectedCarType === "รถแทรกเตอร์"
    ) {
      setEngineSize("ไม่ต้องใส่"); // ล็อคให้เป็น "-"
    } else if (engineSize === "ไม่ต้องใส่") {
      // ถ้าค่าเดิมเป็น "-" ให้ตั้งเป็นค่าว่าง
      setEngineSize("");
    }

    // console.log("วันจดทะเบียน: ", registrationDate);
    // console.log("วันต่อทะเบียนล่าสุด: ", latestTaxPaymentDate);
    // console.log("วันสิ้นอายุ: ", expirationDate);

    const formIsValid =
      !!(
        ownerData &&
        usernameData &&
        selectedProvinceName &&
        engineSize &&
        contactNumber &&
        registrationNumber &&
        registrationDate &&
        expirationDate &&
        (carMoreThan5Years ? missedTaxPayment : true) &&
        selectedRadio &&
        bikeTypeOrDoorCount &&
        selectedCarType &&
        selectedRegistrationBookFile &&
        selectedLicenseFile
      ) &&
      isInvalidUserInfo &&
      isInvalidOwnerInfo &&
      isInvalidVehicleInfo;

    setIsFormValid(formIsValid);
  }, [
    ownerData,
    usernameData,
    selectedProvinceName,
    engineSize,
    contactNumber,
    registrationNumber,
    registrationDate,
    expirationDate,
    latestTaxPaymentDate,
    missedTaxPayment,
    carMoreThan5Years,
    selectedRadio,
    bikeTypeOrDoorCount,
    selectedCarType,
    selectedRegistrationBookFile,
    selectedLicenseFile,
    isInvalidUserInfo,
    isInvalidOwnerInfo,
    isInvalidVehicleInfo,
  ]);

  const [carAge, setCarAge] = useState<{
    years: number;
    months: number;
    days: number;
  }>({ years: 0, months: 0, days: 0 });

  const handleDateChange = (
    date: Dayjs | null,
    type: "registration" | "expiration" | "latestTaxPayment"
  ) => {
    switch (type) {
      case "registration":
        setRegistrationDate(date);

        break;
      case "expiration":
        setExpirationDate(date);
        break;
      case "latestTaxPayment":
        setLatestTaxPaymentDate(date);
        break;
    }
  };

  const handleRadioChange = (value: string) => {
    setSelectedRadio(value);
    setOwnerData("");
    setValidated(false);
  };

  const handleUserInfoValidation = (validations: {
    isInvalidName: boolean;
  }) => {
    const isValid = !Object.values(validations).includes(true);
    setIsInvalidUserInfo(isValid);
  };

  const handleOwnerInfoValidation = (validations: {
    isInvalidOwnerInfo: boolean;
  }) => {
    const isValid = !Object.values(validations).includes(true);
    setIsInvalidOwnerInfo(isValid);
  };

  const handleVehicleInfoValidation = (validations: {
    isInvalidContact: boolean;
    isInvalidLicense: boolean;
    isInvalidEngineSize: boolean;
  }) => {
    const isValid = !Object.values(validations).includes(true); // ถ้ามี false หมายถึงฟอร์ม valid
    setIsInvalidVehicleInfo(isValid);
  };

  const handleCarTypeChange = (value: string | null) => {
    if (value !== selectedCarType) {
      setSelectedCarType(value);
      setBikeTypeOrDoorCount(null); // รีเซ็ตประเภทของมอเตอร์ไซค์หรือจำนวนประตู
      setEngineSize(""); // รีเซ็ตขนาดเครื่องยนต์
      setSelectedFuelType(null);
      setSelectedCarSeat(null);
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setValidated(true);

    if (isFormValid) {
      const carDetails = {
        isCar: selectedCarType === "รถยนต์",
        isTwoDoor: bikeTypeOrDoorCount === "2 ประตู",
        isMotorcycleTrailer:
          selectedCarType === "รถจักรยานยนต์" &&
          bikeTypeOrDoorCount === "รถจักรยานยนต์พร้อมพ่วง",
        isMotorcycle: selectedCarType === "รถจักรยานยนต์",
        // isCarTruck: selectedCarType == "รถบรรทุกส่วนบุคคล",
        // isSpecializedTrucks:
        //   selectedCarType == "รถบรรทุกเฉพาะทาง (น้ำมัน, เครน)",
        isPickupTruck: selectedCarType == "รถกระบะ",
        // isVan: selectedCarType == "รถตู้",
        isCarTrailer: selectedCarType == "รถพ่วงทั่วไป",
        isTractor:
          selectedCarType == "รถแทรกเตอร์" &&
          selectedFuelType == "ใช้งานทั่วไป",
        isTractorFarmer:
          selectedCarType == "รถแทรกเตอร์" &&
          selectedFuelType == "สำหรับการเกษตร",
        hasMoreThanSevenSeats: selectedCarSeat == "เกิน 7 ที่นั่ง",
        weight: parseFloat(engineSize) || 0,
        cc: parseFloat(engineSize) || 0,
        age: carAge.years,

        isInChiangRai: selectedProvinceName === "เชียงราย",

        isElectric: selectedFuelType == "ไฟฟ้า",
        isHybrid: selectedFuelType == "ไฮบริด",
        isOil: selectedFuelType == "เบนซิน" || selectedFuelType == "ดีเซล",
        isGas: selectedFuelType == "แก๊ส",

        registerDate: registrationDate!, // เปลี่ยนชื่อเป็น registerDate และใช้ `!` เพื่อยืนยันว่ามีค่า
        expiryDate: expirationDate,
        lastTaxDate: latestTaxPaymentDate,

        missedTaxPayment: missedTaxPayment,

        finalTotal: 0,
        finalPrb: 0,
        finalTax: 0,
        lateFee: 0,
        inspectionFee: 0,
        processingFee: 0,
        registrationFee: 0,
        taxAnotherYear: 0,

        isRegistrationCancelled: false,
      };

      // console.log("Car Details:", carDetails);
      const {
        finalTotal,
        finalPrb,
        finalTax,
        lateFee,
        inspectionFee,
        processingFee,
        registrationFee,
        taxAnotherYear,
      } = calculateTax(carDetails);

      setTotalCost(finalTotal);
      setFinalPrb(finalPrb);
      setFinalTax(finalTax);
      setLateFee(lateFee);
      setInspectionFee(inspectionFee);
      setProcessingFee(processingFee);
      setRegistrationFee(registrationFee);
      setIsRegistrationCancelled(isRegistrationCancelled);
      setTaxAnotherYear(taxAnotherYear);

      carDetails.finalTotal = finalTotal;
      carDetails.finalPrb = finalPrb;
      carDetails.finalTax = finalTax;
      carDetails.lateFee = lateFee;
      carDetails.inspectionFee = inspectionFee;
      carDetails.processingFee = processingFee;
      carDetails.registrationFee = registrationFee;
      carDetails.isRegistrationCancelled = isRegistrationCancelled;
      carDetails.taxAnotherYear = taxAnotherYear;

      setShowForm(false); // ซ่อน Form
      setShowResult(true); // แสดงหน้าสรุป
    }
  };

  const handleBack = () => {
    // setSelectedRegistrationBookFile(null);
    // setSelectedLicenseFile(null);
    setShowForm(true);
    setShowResult(false);
    setValidated(false);
  };

  const handleNextPage = () => setShowReadME(false);
  const handleBackToReadMe = () => {
    setShowReadME(true);
  };

  const handleConfirm = () => {
    // ส่งข้อมูลไปยังเซิร์ฟเวอร์หรือดำเนินการที่คุณต้องการ
    // console.log("ข้อมูลที่ถูกส่ง:", {
    //   ownerData,
    //   usernameData,
    //   selectedProvinceName,
    //   engineSize,
    //   contactNumber,
    //   registrationNumber,
    //   registrationDate,
    //   expirationDate,
    //   latestTaxPaymentDate,
    //   bikeTypeOrDoorCount,
    //   selectedCarType,
    //   totalCost,
    // });
    // ถ้าต้องการให้ผู้ใช้ได้รับข้อมูลหรือเปลี่ยนหน้าหลังจากส่งข้อมูล
  };

  return (
    <div>
      <Row>
        <Col lg={1} md={2} xl={1}>
          <aside className="d-flex justify-content-center">
            <SidebarUser />
          </aside>
        </Col>
        <Col lg={11} md={10} xl={11}>
          <div className="form-container mx-auto ">
            {showReadME ? (
              <ReadMe onAgree={handleNextPage} />
            ) : showForm ? (
              <Form
                className="form"
                noValidate
                validated={validated}
                onSubmit={handleSubmit}
              >
                <h2 className="text-success text-center mb-4">
                  พรบ. ต่อภาษีรถ
                </h2>
                <small className="text-danger">
                  * ระบุว่าจำเป็นต้องกรอกข้อมูล
                </small>
                {/* UserInfo */}
                <UserInfo
                  isInvalid={validated && !usernameData}
                  usernameData={usernameData}
                  setUsernameData={setUsernameData}
                  selectedProvince={selectedProvince}
                  setSelectedProvince={setSelectedProvince}
                  selectedProvinceName={selectedProvinceName}
                  setSelectedProvinceName={setSelectedProvinceName}
                  selectedCarType={selectedCarType}
                  setSelectedCarType={(value) => {
                    handleCarTypeChange(value); // เรียกใช้ฟังก์ชัน handleCarTypeChange เมื่อมีการเปลี่ยนค่า
                  }}
                  selectedFuelType={selectedFuelType}
                  setSelectedFuelType={setSelectedFuelType}
                  selectedCarSeat={selectedCarSeat}
                  setSelectedCarSeat={setSelectedCarSeat}
                  setIsFormValid={setIsFormValid} // ส่ง prop นี้ไปที่ VehicleInfo
                  onValidateUserInfo={handleUserInfoValidation}
                />

                {/* DateSection with callback for different dates */}
                <DateSection
                  isInvalid={
                    validated &&
                    (!registrationDate ||
                      !expirationDate ||
                      !latestTaxPaymentDate)
                  }
                  handleDateChange={handleDateChange} // Callback to handle date changes
                  registrationDate={registrationDate} // ส่งค่า registrationDate
                  expirationDate={expirationDate} // ส่งค่า expirationDate
                  latestTaxPaymentDate={latestTaxPaymentDate} // ส่งค่า latestTaxPaymentDate
                  missedTaxPayment={missedTaxPayment}
                  setMissedTaxPayment={setMissedTaxPayment}
                  setIsFormValid={setIsFormValid}
                  setCarMoreThan5Years={setCarMoreThan5Years}
                />

                {/* Integrate OwnerInfo */}
                <OwnerInfo
                  isInvalid={validated && (!ownerData || !selectedRadio)}
                  selectedRadio={selectedRadio}
                  setSelectedRadio={handleRadioChange}
                  ownerData={ownerData}
                  setOwnerData={setOwnerData}
                  selectedCarType={selectedCarType}
                  setBikeTypeOrDoorCount={setBikeTypeOrDoorCount}
                  bikeTypeOrDoorCount={bikeTypeOrDoorCount}
                  setIsFormValid={setIsFormValid}
                  carOrMotorcycleLabel={ownerLabel} // ส่ง ownerLabel
                  setCarOrMotorcycleLabel={setOwnerLabel} // ใช้ setOwnerLabel สำหรับ OwnerInfo
                  onValidateOwnerInfo={handleOwnerInfoValidation}
                />

                {/* Integrate VehicleInfo */}
                <VehicleInfo
                  isInvalid={
                    validated &&
                    (!registrationNumber || !contactNumber || !engineSize)
                  }
                  registrationNumber={registrationNumber}
                  setRegistrationNumber={setRegistrationNumber}
                  contactNumber={contactNumber}
                  setContactNumber={setContactNumber}
                  engineSize={engineSize}
                  setEngineSize={setEngineSize}
                  selectedCarType={selectedCarType}
                  selectedFuelType={selectedFuelType}
                  CCorWeight={CCorWeightLabel} // ส่ง vehicleLabel
                  setCCorWeight={setCCorWeightLabel}
                  setIsFormValid={setIsFormValid} // ส่ง prop นี้ไปที่ VehicleInfo
                  onValidateVehicleInfo={handleVehicleInfoValidation}
                />
                <Row>
                  <Col className="mb-4" xs={12} sm={12} md={6} lg={6} xl={6}>
                    <FileInput
                      label="ภาพเล่มทะเบียนรถหน้าแรก (รองรับ .png, .jpg)"
                      onFileSelect={(file) =>
                        setSelectedRegistrationBookFile(file)
                      }
                      accept=".jpg, .png"
                      alertText="กรุณาเลือกภาพสำเนาภาพเล่มทะเบียนรถ"
                      initialFile={selectedRegistrationBookFile}
                      required
                    />
                  </Col>
                  <Col className="mb-4" xs={12} sm={12} md={6} lg={6} xl={6}>
                    <FileInput
                      label="ภาพแผ่นป้ายทะเบียนรถ (รองรับ .png, .jpg)"
                      onFileSelect={(file) => setSelectedLicenseFile(file)}
                      accept=".jpg, .png"
                      alertText="กรุณาเลือกภาพแผ่นป้ายทะเบียนรถ"
                      initialFile={selectedLicenseFile}
                      required
                    />
                  </Col>
                </Row>

                <hr className="my-4" />

                <footer>
                  {/* Alert */}
                  {!isFormValid && (
                    <Alert
                      variant="success"
                      className="d-flex align-items-center mb-4"
                    >
                      <i className="fas fa-exclamation-triangle me-2"></i>
                      <span>
                        กรุณากรอกข้อมูล
                        {!selectedRegistrationBookFile || !selectedLicenseFile
                          ? " และรูปภาพ"
                          : ""}
                        ให้ครบถ้วนและถูกต้อง
                      </span>
                    </Alert>
                  )}

                  <Row className="mb-2 ">
                    <Col className="mb-2 form-button-container">
                      <Button
                        // label="ย้อนกลับ"
                        className="form-button mx-3"
                        type="button"
                        variant="outline-success"
                        onClick={handleBackToReadMe}
                      >
                        ย้อนกลับ
                      </Button>
                      <Button
                        // label="ถัดไป"
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
              </Form>
            ) : (
              showResult && (
                <Summary
                  carOrMotorcycleLabel={ownerLabel}
                  CCorWeight={CCorWeightLabel}
                  ownerData={ownerData}
                  usernameData={usernameData}
                  selectedProvince={selectedProvinceName}
                  engineSize={engineSize}
                  contactNumber={contactNumber}
                  registrationNumber={registrationNumber}
                  registrationDate={
                    registrationDate ? registrationDate.toDate() : null
                  }
                  expirationDate={
                    expirationDate ? expirationDate.toDate() : null
                  }
                  latestTaxPaymentDate={
                    latestTaxPaymentDate ? latestTaxPaymentDate.toDate() : null
                  }
                  missedTaxPayment={missedTaxPayment}
                  carMoreThan5Years={carMoreThan5Years}
                  selectedRadio={selectedRadio}
                  bikeTypeOrDoorCount={bikeTypeOrDoorCount}
                  selectedCarType={selectedCarType}
                  selectedFuelType={selectedFuelType}
                  selectedCarSeat={selectedCarSeat}
                  totalCost={totalCost}
                  prbCost={finalPrb}
                  taxCost={finalTax}
                  lateFee={lateFee}
                  inspectionCost={inspectionFee}
                  processingCost={processingFee}
                  registrationFee={registrationFee}
                  taxAnotherYear={taxAnotherYear}
                  carAge={carAge}
                  selectedRegistrationBookFile={selectedRegistrationBookFile}
                  selectedLicenseFile={selectedLicenseFile}
                  isRegistrationCancelled={isRegistrationCancelled}
                  onBack={handleBack}
                  onConfirm={handleConfirm}
                />
              )
            )}
            <ScrollToTopAndBottomButton />
          </div>
        </Col>
      </Row>
      <NavigationBlockerModal />
    </div>
  );
};

export default FormComponent;
