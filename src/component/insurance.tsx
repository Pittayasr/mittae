import React, { useState, useEffect, useCallback, ReactNode } from "react";
import InsuranceUserInfo from "../component/insuranceComponent/insuranceUserInfo";
import InsuranceInfo from "../component/insuranceComponent/insuranceInfo";
import InsuranceVehicleInfo from "../component/insuranceComponent/insuranceVehicleInfo";
import CarouselComponent from "../component/insuranceComponent/carousel";
import ScrollToTopAndBottomButton from "./ScrollToTopAndBottomButton";
import SidebarUser from "./textFillComponent/sidebarUser";
import AlertModal from "./textFillComponent/alertModal";
import { Form, Button, Row, Col, Alert, Modal, Spinner } from "react-bootstrap";
import "@fortawesome/fontawesome-free/css/all.min.css";
import { db } from "../../firebaseConfig";
import { collection, addDoc } from "firebase/firestore";
import { FaCheckCircle, FaExclamationTriangle } from "react-icons/fa";
import { VscError } from "react-icons/vsc";
import dayjs from "dayjs";

const InsuranceForm: React.FC = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState<ReactNode>(null);
  const [success, setSuccess] = useState(false);
  const [isError, setIsError] = useState(false);

  const [registrationNumber, setRegistrationNumber] = useState<string>("");
  const [contactNumber, setContactNumber] = useState<string>("");
  const [houseNumber, setHouseNumber] = useState<string>("");
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
  const [customGender, setCustomGender] = useState<string>("");
  const [maritalStatus, setMaritalStatus] = useState<string>("");
  const [occupation, setOccupation] = useState<string>("");
  const [licenseAge, setLicenseAge] = useState<string>("");
  const [propertyValue, setPropertyValue] = useState<string>("");
  const [
    registrationBookInsuranceCarFile,
    setRegistrationBookInsuranceCarFile,
  ] = useState<File | null>(null);
  const [
    registrationBookInsuranceMotorcycleFile,
    setRegistrationBookInsuranceMotorcycleFile,
  ] = useState<File | null>(null);
  const [titleDeedFile, setTitleDeedFile] = useState<File | null>(null);
  const [voluntaryInsuranceCarFile, setVoluntaryInsuranceCarFile] =
    useState<File | null>(null);
  const [
    voluntaryInsuranceMotorcycleFile,
    setVoluntaryInsuranceMotorcycleFile,
  ] = useState<File | null>(null);
  const [voluntaryInsuranceHouseFile, setVoluntaryInsuranceHouseFile] =
    useState<File | null>(null);
  const [noIDcardFile, setNoIDcardFile] = useState<File | null>(null);

  const [isInvalid, setIsInvalid] = useState(false);

  // const [vehicleInfoInvalid, setVehicleInfoInvalid] = useState(false);

  // const [isSubmitted, setIsSubmitted] = useState(false);
  // const [invalidFields, setInvalidFields] = useState<boolean[]>([]);
  const [isSubmitDisabled, setIsSubmitDisabled] = useState<boolean>(true);

  // const [isShowRegistrationNumber, setIsShowRegistrationNumber] =
  //   useState<boolean>(false);

  // const handleValidateVehicleInfo = (validations: { isInvalid: boolean }) => {
  //   setVehicleInfoInvalid(validations.isInvalid);
  // };

  const validateFields = useCallback(() => {
    let isInvalid = false;
    const validationSteps = [];

    // ตรวจสอบ registrationNumber
    if (!registrationNumber || !/^[ก-ฮ0-9]+$/.test(registrationNumber)) {
      console.log("Invalid registrationNumber:", registrationNumber);
      isInvalid = true;
      validationSteps.push("registrationNumber");
    }

    // ตรวจสอบ contactNumber
    if (!contactNumber || !/^(06|08|09)\d{8}$/.test(contactNumber)) {
      console.log("Invalid contactNumber:", contactNumber);
      isInvalid = true;
      validationSteps.push("contactNumber");
    }

    // ตรวจสอบ insuranceType, insuranceCompany, insuranceCategory
    if (!insuranceType || !insuranceCompany || !insuranceCategory) {
      console.log("Missing insurance details:", {
        insuranceType,
        insuranceCompany,
        insuranceCategory,
      });
      isInvalid = true;
      validationSteps.push("insuranceDetails");
    }

    // ตรวจสอบกรณี "รถยนต์"
    if (insuranceCategory === "รถยนต์") {
      if (
        !vehicleBrand ||
        !/^(?![่-๋])[เ-ไก-ฮa-zA-Z0-9]{1}[\u0E01-\u0E4C\u0E4E-\u0E4F\u0E30-\u0E3Aเ-ไก-ฮa-zA-Z0-9\s\-/]*$/.test(
          vehicleBrand
        ) ||
        !vehicleModel ||
        !engineSize ||
        !/^\d+$/.test(engineSize) ||
        !vehicleYear ||
        !/^\d{4}$/.test(vehicleYear) ||
        !selectedProvinceRegistered ||
        !vehiclePurpose ||
        !hasDashCam ||
        !selectedProvinceDriver ||
        !gender ||
        !maritalStatus ||
        !occupation ||
        !hasVoluntaryInsurance ||
        !registrationBookInsuranceCarFile ||
        (hasVoluntaryInsurance === "ยังมีประกันภัยภาคสมัครใจ" &&
          !voluntaryInsuranceCarFile)
      ) {
        console.log("Missing required fields for รถยนต์");
        isInvalid = true;
        validationSteps.push("vehicleCarDetails");
      }
    }
    // ตรวจสอบกรณี "รถยนต์"
    if (insuranceCategory === "รถจักรยานยนต์") {
      if (
        !vehicleBrand ||
        !vehicleModel ||
        !engineSize ||
        !vehicleYear ||
        !selectedProvinceRegistered ||
        !vehiclePurpose ||
        !/^[ก-ฮ0-9]+$/.test(vehiclePurpose) ||
        !hasVoluntaryInsurance ||
        !registrationBookInsuranceMotorcycleFile ||
        (hasVoluntaryInsurance === "ยังมีประกันภัยภาคสมัครใจ" &&
          !voluntaryInsuranceMotorcycleFile)
      ) {
        console.log("Missing required fields for รถจักรยานยนต์");
        isInvalid = true;
        validationSteps.push("vehicleMotorcycleDetails");
      }
    }

    // ตรวจสอบกรณี "หอพัก บ้าน"
    if (insuranceCategory === "หอพัก บ้าน") {
      if (
        !propertyType ||
        !selectedProvinceLocation ||
        !propertyValue ||
        !titleDeedFile ||
        !noIDcardFile ||
        !hasVoluntaryInsurance ||
        (hasVoluntaryInsurance === "ยังมีประกันภัยภาคสมัครใจ" &&
          !voluntaryInsuranceHouseFile)
      ) {
        console.log("Missing required fields for หอพัก บ้าน");
        isInvalid = true;
        validationSteps.push("propertyDetails");
      }
    }

    // ตรวจสอบ gender
    if (gender === "อื่นๆ") {
      if (
        !customGender ||
        !/^(?![่-๋])[เ-ไก-ฮa-zA-Z0-9]{1}[\u0E01-\u0E4C\u0E4E-\u0E4F\u0E30-\u0E3Aเ-ไก-ฮa-zA-Z0-9\s\-/]*$/.test(
          customGender
        )
      ) {
        console.log("Invalid custom gender:", customGender);
        isInvalid = true;
        validationSteps.push("customGender");
      }
    }
    console.log("Validation steps:", validationSteps);
    setIsSubmitDisabled(isInvalid);
  }, [
    registrationNumber,
    contactNumber,
    insuranceType,
    insuranceCompany,
    insuranceCategory,
    vehicleBrand,
    vehicleModel,
    engineSize,
    vehicleYear,
    selectedProvinceRegistered,
    selectedProvinceDriver,
    selectedProvinceLocation,
    vehiclePurpose,
    hasDashCam,
    propertyType,
    gender,
    customGender,
    maritalStatus,
    occupation,
    propertyValue,
    hasVoluntaryInsurance,
    noIDcardFile,
    registrationBookInsuranceCarFile,
    registrationBookInsuranceMotorcycleFile,
    titleDeedFile,
    voluntaryInsuranceCarFile,
    voluntaryInsuranceHouseFile,
    voluntaryInsuranceMotorcycleFile,
  ]);

  useEffect(() => {
    validateFields();
  }, [validateFields]);

  const handleOpenModal = () => {
    setModalMessage(
      <div className="d-flex flex-column align-items-center text-center">
        <FaExclamationTriangle className="text-warning my-3" size={50} />
        <p className="px-2">คุณต้องการยืนยันว่า ข้อมูลทั้งหมดถูกต้องใช่ไหม?</p>
      </div>
    );
    setShowModal(true);
  };

  // const handleShowRegistrationNumber = () => {
  //   if (insuranceCategory === "") {
  //     setIsShowRegistrationNumber(false);
  //   } else {
  //     setIsShowRegistrationNumber(true);
  //   }
  // };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // setIsSubmitted(true);

    // ตรวจสอบ newInvalidFields อีกครั้งเมื่อกดปุ่มส่ง
    // const isAnyFieldInvalid = invalidFields.some((field) => field);
    // if (isAnyFieldInvalid) {
    //   setIsInvalid(true);
    //   return;
    // }

    // setIsInvalid(false);
    handleOpenModal();
  };

  const handleSubmitData = async () => {
    setIsSubmitting(true);
    try {
      const formData = new FormData();

      // เพิ่มไฟล์สำหรับ Insurance
      if (
        insuranceCategory !== "ประกันภัยทางทะเลและขนส่ง" &&
        insuranceCategory !== "ประกันภัยเบ็ดเตล็ด"
      ) {
        if (registrationBookInsuranceCarFile) {
          formData.append(
            "registrationBookInsuranceCarFile",
            registrationBookInsuranceCarFile
          );
        }
        if (registrationBookInsuranceMotorcycleFile) {
          formData.append(
            "registrationBookInsuranceMotorcycleFile",
            registrationBookInsuranceMotorcycleFile
          );
        }
        if (titleDeedFile) {
          formData.append("titleDeedFile", titleDeedFile);
        }
        if (voluntaryInsuranceCarFile) {
          formData.append(
            "voluntaryInsuranceCarFile",
            voluntaryInsuranceCarFile
          );
        }
        if (voluntaryInsuranceMotorcycleFile) {
          formData.append(
            "voluntaryInsuranceMotorcycleFile",
            voluntaryInsuranceMotorcycleFile
          );
        }
        if (voluntaryInsuranceHouseFile) {
          formData.append(
            "voluntaryInsuranceHouseFile",
            voluntaryInsuranceHouseFile
          );
        }
        if (noIDcardFile) {
          formData.append("noIDcardFile", noIDcardFile);
        }
      }

      // เพิ่มประเภท request
      formData.append("type", "Insurance");
      formData.append("vehicleType", insuranceCategory || "");
      formData.append("hasVoluntaryInsurance", hasVoluntaryInsurance);

      const response = await fetch(
        "https://api.mittaemaefahlung88.com/upload-multiple",
        {
          method: "POST",
          body: formData,
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to upload files to server");
      }

      const responseData = await response.json();
      console.log("Response Data:", responseData);

      const insuranceData = responseData.insurances;
      if (!insuranceData) {
        throw new Error("insuranceData is undefined");
      }

      const getFileData = (
        key: string
      ): { storedFileName: string | null; filePath: string | null } | null => {
        const file = insuranceData[key];
        return file
          ? {
              storedFileName: file.storedFileName || null,
              filePath: file.filePath || null,
            }
          : null;
      };

      const uploadTime = dayjs().toISOString();

      let data: Partial<{
        registrationNumber: string;
        contactNumber: string;
        insuranceType: string | null;
        insuranceCompany: string | null;
        insuranceCategory: string | null;
        hasVoluntaryInsurance: string;
        uploadTime: string;
        status: string;
        vehicleBrand?: string;
        vehicleModel?: string;
        engineSize?: string;
        vehicleYear?: string;
        selectedProvinceRegistered?: string | null;
        selectedProvinceDriver?: string | null;
        vehiclePurpose?: string;
        hasDashCam?: string;
        gender?: string;
        maritalStatus?: string;
        occupation?: string;
        licenseAge?: string;
        registrationBookInsuranceCar?: {
          storedFileName: string | null;
          filePath: string | null;
        } | null;
        voluntaryInsuranceCar?: {
          storedFileName: string | null;
          filePath: string | null;
        } | null;
        registrationBookInsuranceMotorcycle?: {
          storedFileName: string | null;
          filePath: string | null;
        } | null;
        voluntaryInsuranceMotorcycle?: {
          storedFileName: string | null;
          filePath: string | null;
        } | null;
        propertyType?: string;
        selectedProvinceLocation?: string | null;
        propertyValue?: string;
        titleDeed?: {
          storedFileName: string | null;
          filePath: string | null;
        } | null;
        noIDcard?: {
          storedFileName: string | null;
          filePath: string | null;
        } | null;
        voluntaryInsuranceHouse?: {
          storedFileName: string | null;
          filePath: string | null;
        } | null;
      }> = {
        registrationNumber,
        contactNumber,
        insuranceType,
        insuranceCompany,
        insuranceCategory,
        hasVoluntaryInsurance,
        uploadTime,
        status: "อยู่ระหว่างดำเนินการ",
      };

      if (insuranceCategory === "รถยนต์") {
        data = {
          ...data,
          vehicleBrand,
          vehicleModel,
          engineSize,
          vehicleYear,
          selectedProvinceRegistered,
          selectedProvinceDriver,
          vehiclePurpose,
          hasDashCam,
          gender,
          maritalStatus,
          occupation,
          licenseAge,
          registrationBookInsuranceCar: getFileData(
            "registrationBookInsuranceCarFile"
          ),
          voluntaryInsuranceCar: getFileData("voluntaryInsuranceCarFile"),
        };
      } else if (insuranceCategory === "รถจักรยานยนต์") {
        data = {
          ...data,
          vehicleBrand,
          vehicleModel,
          engineSize,
          vehicleYear,
          selectedProvinceRegistered,
          vehiclePurpose,
          registrationBookInsuranceMotorcycle: getFileData(
            "registrationBookInsuranceMotorcycleFile"
          ),
          voluntaryInsuranceMotorcycle: getFileData(
            "voluntaryInsuranceMotorcycleFile"
          ),
        };
      } else if (insuranceCategory === "หอพัก บ้าน") {
        data = {
          ...data,
          propertyType,
          selectedProvinceLocation,
          propertyValue,
          titleDeed: getFileData("titleDeedFile"),
          noIDcard: getFileData("noIDcardFile"),
          voluntaryInsuranceHouse: getFileData("voluntaryInsuranceHouseFile"),
        };
      }

      console.log("Data sent to Firestore:", data);
      await addDoc(collection(db, "insurances"), data);

      setModalMessage(
        <div className="d-flex flex-column align-items-center text-center">
          <FaCheckCircle className="text-success my-3" size={50} />
          <p className="px-2">
            ข้อมูลถูกส่งสำเร็จแล้ว! ✅<br />
            ขอขอบพระคุณที่ใช้บริการกับทางเราตลอดไป 🙏❤️
          </p>
        </div>
      );
      setSuccess(true);
    } catch (error) {
      console.error("Error during submission:", error);

      setModalMessage(
        <div className="d-flex flex-column align-items-center text-center">
          <VscError className="text-danger my-3" size={50} />
          <p className="px-2">การส่งข้อมูลล้มเหลว กรุณาลองอีกครั้ง</p>
        </div>
      );
      setIsError(true);
      setSuccess(false);
    } finally {
      setIsSubmitting(false);
      setShowModal(true);
    }
  };

  return (
    <body>
      <Row>
        <Col lg={1} md={2} xl={1}>
          <aside className="d-flex justify-content-center">
            <SidebarUser />
          </aside>
        </Col>
        <Col lg={11} md={10} xl={11}>
          <div className="form-container mx-auto ">
            <Form onSubmit={handleSubmit}>
              <h2 className="text-success text-center mb-4">
                ประกันภัย ป1 ป2 ป3 ป4 ป5
              </h2>
              <InsuranceInfo
                insuranceType={insuranceType}
                setInsuranceType={setInsuranceType}
                insuranceCompany={insuranceCompany}
                setInsuranceCompany={setInsuranceCompany}
                insuranceCategory={insuranceCategory}
                setInsuranceCategory={setInsuranceCategory}
                isInvalid={isInvalid}
                setIsInvalid={setIsInvalid}
              />
              <InsuranceUserInfo
                label={
                  insuranceCategory === "รถยนต์" ||
                  insuranceCategory === "รถจักรยานยนต์"
                    ? "หมายเลขทะเบียนรถ"
                    : insuranceCategory === "หอพัก บ้าน"
                    ? "หมายเลขที่โฉนด"
                    : insuranceCategory === "ประกันภัยทางทะเลและขนส่ง" ||
                      insuranceCategory === "ประกันภัยเบ็ดเตล็ด"
                    ? "หมายเลขบัตรประชาชน"
                    : "โปรดเลือกประเภท"
                }
                isShowRegistrationNumber={
                  insuranceCategory === null ||
                  ["ประกันภัยทางทะเลและขนส่ง", "ประกันภัยเบ็ดเตล็ด"].includes(
                    insuranceCategory
                  )
                    ? false
                    : true
                }
                registrationNumber={registrationNumber}
                setRegistrationNumber={setRegistrationNumber}
                contactNumber={contactNumber}
                setContactNumber={setContactNumber}
                isShowHouseNumber={
                  insuranceCategory === "หอพัก บ้าน" ? true : false
                }
                houseNumber={houseNumber}
                setHouseNumber={setHouseNumber}
                isInvalid={isInvalid}
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
                customGender={customGender}
                setCustomGender={setCustomGender}
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
                registrationBookInsuranceCarFile={
                  registrationBookInsuranceCarFile
                }
                setRegistrationBookInsuranceCarFile={
                  setRegistrationBookInsuranceCarFile
                }
                registrationBookInsuranceMotorcycleFile={
                  registrationBookInsuranceMotorcycleFile
                }
                setRegistrationBookInsuranceMotorcycleFile={
                  setRegistrationBookInsuranceMotorcycleFile
                }
                titleDeedFile={titleDeedFile}
                setTitleDeedFile={setTitleDeedFile}
                voluntaryInsuranceCarFile={voluntaryInsuranceCarFile}
                setVoluntaryInsuranceCarFile={setVoluntaryInsuranceCarFile}
                voluntaryInsuranceMotorcycleFile={
                  voluntaryInsuranceMotorcycleFile
                }
                setVoluntaryInsuranceMotorcycleFile={
                  setVoluntaryInsuranceMotorcycleFile
                }
                voluntaryInsuranceHouseFile={voluntaryInsuranceHouseFile}
                setVoluntaryInsuranceHouseFile={setVoluntaryInsuranceHouseFile}
                noIDcardFile={noIDcardFile}
                setNoIDcardFile={setNoIDcardFile}
                isInvalid={isInvalid}
              />

              <CarouselComponent
                insuranceCompany={insuranceCompany}
                insuranceCategory={insuranceCategory}
              />

              <hr className="my-3"></hr>
              {/* Alert */}
              {isSubmitDisabled && (
                <Alert
                  variant="success"
                  className="d-flex align-items-center mb-4"
                >
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
                    disabled={isSubmitDisabled}
                  >
                    ส่ง
                  </Button>
                </Col>
              </Row>
            </Form>
            <Modal show={isSubmitting} centered>
              <Modal.Body className="text-center">
                <Spinner
                  animation="border"
                  variant="success"
                  role="status"
                  className="my-3"
                />
                <p>กำลังส่งข้อมูล...</p>
              </Modal.Body>
            </Modal>
            <AlertModal
              show={showModal}
              onBack={() => {
                // console.log("Cancel clicked, closing modal...");
                setShowModal(false);
                setIsError(false);
                // onBack();
              }}
              onSuccess={() => {
                // console.log("Cancel clicked, closing modal...");
                // window.location.reload();

                setSuccess(false);
                setShowModal(false);
              }}
              onConfirm={handleSubmitData}
              message={modalMessage}
              success={success}
              isError={isError}
            />
            <ScrollToTopAndBottomButton />
          </div>
        </Col>
      </Row>
    </body>
  );
};

export default InsuranceForm;
