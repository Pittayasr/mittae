import React, { useState } from "react";
import InsuranceUserInfo from "../component/insuranceComponent/insuranceUserInfo";
import InsuranceInfo from "../component/insuranceComponent/insuranceInfo";
import InsuranceVehicleInfo from "../component/insuranceComponent/insuranceVehicleInfo";
import CarouselComponent from "../component/insuranceComponent/carousel";
import ScrollToTopAndBottomButton from "./ScrollToTopAndBottomButton";
import { Form, Button, Row, Col, Alert } from "react-bootstrap";
import "@fortawesome/fontawesome-free/css/all.min.css";
// import { db } from "../../firebaseConfig";
// import { collection, addDoc } from "firebase/firestore";
// import { FaCheckCircle, FaExclamationTriangle } from "react-icons/fa";
// import { VscError } from "react-icons/vsc";

const InsuranceForm: React.FC = () => {
  const [registrationNumber, setRegistrationNumber] = useState<string>("");
  const [contactNumber, setContactNumber] = useState<string>("");
  const [insuranceType, setInsuranceType] = useState<string | null>(null);
  const [insuranceCompany, setInsuranceCompany] = useState<string | null>(null);
  const [insuranceCategory, setInsuranceCategory] = useState<string | null>(
    null
  );

  // State for InsuranceVehicleInfo
  const [vehicleBrand, setVehicleBrand] = useState<string>("");
  const [vehicleModel, setVehicleModel] = useState<string>("");
  const [engineSize, setEngineSize] = useState<string>("");
  const [vehicleYear, setVehicleYear] = useState<string>("");
  const [selectedProvinceRegistered, setSelectedProvinceRegistered] = useState<
    string | null
  >(null);
  const [selectedProvinceDriver, setSelectedProvinceDriver] = useState<
    string | null
  >(null);
  const [selectedProvinceLocation, setSelectedProvinceLocation] = useState<
    string | null
  >(null);
  const [vehiclePurpose, setVehiclePurpose] = useState<string>("");
  const [hasDashCam, setHasDashCam] = useState<string>("");
  const [hasVoluntaryInsurance, setHasVoluntaryInsurance] =
    useState<string>("");
  const [propertyType, setPropertyType] = useState<string>("");
  const [gender, setGender] = useState<string>("");
  const [maritalStatus, setMaritalStatus] = useState<string>("");
  const [occupation, setOccupation] = useState<string>("");
  const [licenseAge, setLicenseAge] = useState<string>("");
  const [propertyValue, setPropertyValue] = useState<string>("");

  const [isInvalid, setIsInvalid] = useState(false);

  const [vehicleInfoInvalid, setVehicleInfoInvalid] = useState(false);

  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleValidateVehicleInfo = (validations: { isInvalid: boolean }) => {
    setVehicleInfoInvalid(validations.isInvalid);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
    if (
      !registrationNumber ||
      !contactNumber ||
      !insuranceType ||
      vehicleInfoInvalid
    ) {
      setIsInvalid(true);
      return;
    }
    alert("Form Submitted!");
  };

  return (
    <div className="form-container page-container mx-auto mt-1">
      <h1 className="text-success text-center">ประกันภัย ป1 ป2 ป3 ป4 ป5</h1>
      <Form onSubmit={handleSubmit}>
        <InsuranceUserInfo
          registrationNumber={registrationNumber}
          setRegistrationNumber={setRegistrationNumber}
          contactNumber={contactNumber}
          setContactNumber={setContactNumber}
          isInvalid={isSubmitted && isInvalid}
          setIsInvalid={setIsInvalid}
        />
        <InsuranceInfo
          insuranceType={insuranceType}
          setInsuranceType={setInsuranceType}
          insuranceCompany={insuranceCompany}
          setInsuranceCompany={setInsuranceCompany}
          insuranceCategory={insuranceCategory}
          setInsuranceCategory={setInsuranceCategory}
          isInvalid={isSubmitted && isInvalid}
          setIsInvalid={setIsInvalid}
        />
        {/* Add Vehicle Info and Carousel */}
        <InsuranceVehicleInfo
          vehicleType={insuranceCategory || ""}
          selectedProvinceRegistered={selectedProvinceRegistered}
          setSelectedProvinceRegistered={setSelectedProvinceRegistered}
          selectedProvinceDriver={selectedProvinceDriver}
          setSelectedProvinceDriver={setSelectedProvinceDriver}
          selectedProvinceLocation={selectedProvinceLocation}
          setSelectedProvinceLocation={setSelectedProvinceLocation}
          propertyType={propertyType}
          setPropertyType={setPropertyType}
          gender={gender}
          setGender={setGender}
          maritalStatus={maritalStatus}
          setMaritalStatus={setMaritalStatus}
          occupation={occupation}
          setOccupation={setOccupation}
          licenseAge={licenseAge}
          setLicenseAge={setLicenseAge}
          vehicleBrand={vehicleBrand}
          setVehicleBrand={setVehicleBrand}
          vehicleModel={vehicleModel}
          setVehicleModel={setVehicleModel}
          engineSize={engineSize}
          setEngineSize={setEngineSize}
          vehicleYear={vehicleYear}
          setVehicleYear={setVehicleYear}
          vehiclePurpose={vehiclePurpose}
          setVehiclePurpose={setVehiclePurpose}
          hasDashCam={hasDashCam}
          setHasDashCam={setHasDashCam}
          hasVoluntaryInsurance={hasVoluntaryInsurance}
          setHasVoluntaryInsurance={setHasVoluntaryInsurance}
          propertyValue={propertyValue}
          setPropertyValue={setPropertyValue}
          isInvalid={isSubmitted && (isInvalid || vehicleInfoInvalid)}
          onValidateInsuranceVehicleInfo={handleValidateVehicleInfo}
        />

        <CarouselComponent
          insuranceCompany={insuranceCompany}
          insuranceCategory={insuranceCategory}
        />
        <hr className="my-3"></hr>
        {/* Alert */}
        {isInvalid && (
          <Alert variant="success" className="d-flex align-items-center mb-4">
            <i className="fas fa-exclamation-triangle me-2"></i>
            <span>กรุณากรอกข้อมูลให้ครบถ้วน</span>
          </Alert>
        )}
        <Row>
          <Col className="text-center">
            <Button
              type="submit"
              variant="success"
              onClick={handleSubmit}
              className="w-50 my-3"
              disabled={isInvalid}
            >
              ส่ง
            </Button>
          </Col>
        </Row>
      </Form>
      <ScrollToTopAndBottomButton />
    </div>
  );
};

export default InsuranceForm;
