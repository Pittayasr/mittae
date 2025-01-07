//insuranceAdmin.tsx
import React, { useEffect, useState, useCallback } from "react";
import TextInput from "../textFillComponent/textInput";
import AllInfo from "./pageAdminComponent/allInfo";
import { db } from "../../../firebaseConfig";
import {
  collection,
  getDocs,
  deleteDoc,
  doc,
  updateDoc,
} from "firebase/firestore";
import { Col, Row, Form, Button, Modal, ToggleButton } from "react-bootstrap";
import useAuth from "../useAuth";
import ScrollToTopAndBottomButton from "../ScrollToTopAndBottomButton";
import PaginationControls from "./pageAdminComponent/paginationControls";
import SidebarAdmin from "./pageAdminComponent/sidebarAdmin";
import dayjs, { Dayjs } from "dayjs";
import "dayjs/locale/th";
import isBetween from "dayjs/plugin/isBetween";
import { FaCheckCircle, FaExclamationTriangle, FaClock } from "react-icons/fa";

dayjs.locale("th");

dayjs.extend(isBetween);

interface InsuranceData {
  registrationNumber: string;
  contactNumber: string;
  insuranceType: string;
  insuranceCompany: string;
  insuranceCategory: string;
  vehicleBrand?: string;
  vehicleModel?: string;
  engineSize?: string;
  vehicleYear?: string;
  selectedProvinceRegistered?: string;
  selectedProvinceDriver?: string;
  vehiclePurpose?: string;
  hasDashCam?: boolean;
  gender?: string;
  maritalStatus?: string;
  occupation?: string;
  propertyType?: string;
  selectedProvinceLocation?: string;
  propertyValue?: string;
  uploadTime: string;
  status: "อยู่ระหว่างดำเนินการ" | "สำเร็จแล้ว" | "รอเอกสารเพิ่มเติม";
  docId: string;
  registrationBookInsuranceCar: {
    filePath: string;
    storeFileName: string;
  };
  registrationBookInsuranceMotorcycle: {
    filePath: string;
    storeFileName: string;
  };
  titleDeed: {
    filePath: string;
    storeFileName: string;
  };
  voluntaryInsuranceCar: {
    filePath: string;
    storeFileName: string;
  };
  voluntaryInsuranceMotorcycle: {
    filePath: string;
    storeFileName: string;
  };
  voluntaryInsuranceHouse: {
    filePath: string;
    storeFileName: string;
  };
  noIDcard: {
    filePath: string;
    storeFileName: string;
  };
}

const InsuranceAdmin: React.FC = () => {
  const [insurances, setInsurances] = useState<InsuranceData[]>([]);
  const [filteredInsurances, setFilteredInsurances] = useState<InsuranceData[]>(
    []
  );
  const [filterType, setFilterType] = useState<string>("");
  const [filterStatus, setFilterStatus] = useState<string>("");
  const [filterCompany, setFilterCompany] = useState<string>("");
  const [filterExtra, setFilterExtra] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedInsurance, setSelectedInsurance] =
    useState<InsuranceData | null>(null);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isMultiSelectMode, setIsMultiSelectMode] = useState<boolean>(false);
  const [isAllSelected, setIsAllSelected] = useState<boolean>(false);
  const [modalImage, setModalImage] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 6;

  const [sortField, setSortField] = useState<string>("uploadTime");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [startDate, setStartDate] = useState<Dayjs | null>(null);
  const [endDate, setEndDate] = useState<Dayjs | null>(null);

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const [totalInsurances, setTotalInsurances] = useState(0);
  const [completedInsurances, setCompletedInsurances] = useState(0);
  const [inProgressInsurances, setInProgressInsurances] = useState(0);
  const [additionalDocsInsurances, setAdditionalDocsInsurances] = useState(0);

  const { logout } = useAuth();

  const updateStatus = async (
    insuranceId: string,
    newStatus: "อยู่ระหว่างดำเนินการ" | "สำเร็จแล้ว" | "รอเอกสารเพิ่มเติม"
  ) => {
    try {
      const docRef = doc(db, "insurances", insuranceId);
      await updateDoc(docRef, { status: newStatus });

      // อัปเดต insurances ใน State
      setInsurances((prevInsurances) =>
        prevInsurances.map((insurance) =>
          insurance.docId === insuranceId
            ? { ...insurance, status: newStatus }
            : insurance
        )
      );

      // อัปเดต selectedVehicle ด้วยสถานะใหม่
      setSelectedInsurance((prevSelectedInsurance) =>
        prevSelectedInsurance?.docId === insuranceId
          ? { ...prevSelectedInsurance, status: newStatus }
          : prevSelectedInsurance
      );
    } catch (error) {
      console.error("Error updating status:", error);
      alert("เกิดข้อผิดพลาดในการเปลี่ยนสถานะ");
    }
  };

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id)
        ? prev.filter((selectedId) => selectedId !== id)
        : [...prev, id]
    );
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleMultiSelectToggle = () => {
    setIsMultiSelectMode((prev) => !prev);
    setSelectedIds([]); // Reset selections when toggling mode
  };

  const handleDeleteSelected = async () => {
    if (
      window.confirm(
        `คุณต้องการลบรายการที่เลือกทั้งหมด (${selectedIds.length} รายการ) หรือไม่?`
      )
    ) {
      try {
        // เรียก API เพื่อลบไฟล์ที่เกี่ยวข้อง
        const deleteFile = async (filePath: string) => {
          if (!filePath) return;

          const response = await fetch(
            "https://api.mittaemaefahlung88.com/delete-file",
            {
              method: "DELETE",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                fileName: filePath.replace(/.*\/uploads\//, ""), // เอาเฉพาะ path ภายในโฟลเดอร์ uploads
              }),
            }
          );

          if (!response.ok) {
            const error = await response.json();
            console.error(`Error deleting file: ${filePath}`, error);
            throw new Error(`Failed to delete file: ${filePath}`);
          }
          // console.log(`File deleted successfully: ${filePath}`);
        };
        for (const id of selectedIds) {
          const insurance = insurances.find((v) => v.docId === id);
          if (insurance) {
            // ลบไฟล์ที่เกี่ยวข้อง
            await deleteFile(insurance.registrationBookInsuranceCar.filePath);
            await deleteFile(
              insurance.registrationBookInsuranceMotorcycle.filePath
            );
            await deleteFile(insurance.titleDeed.filePath);
            await deleteFile(insurance.voluntaryInsuranceCar.filePath);
            await deleteFile(insurance.voluntaryInsuranceMotorcycle.filePath);
            await deleteFile(insurance.voluntaryInsuranceHouse.filePath);
            await deleteFile(insurance.noIDcard.filePath);

            // ลบข้อมูลใน Firestore
            const docRef = doc(db, "insurances", id);
            await deleteDoc(docRef);
          }
        }
        // อัปเดต state
        setInsurances(insurances.filter((v) => !selectedIds.includes(v.docId)));
        setSelectedIds([]); // รีเซ็ตรายการที่เลือก
        alert("ลบรายการที่เลือกทั้งหมดสำเร็จ!");
      } catch (error) {
        console.error("Error deleting selected vehicles:", error);
        alert("เกิดข้อผิดพลาดในการลบรายการที่เลือก กรุณาลองใหม่อีกครั้ง");
      }
    }
  };

  const handleDownload = async (
    filePath: string | null,
    fileName: string | null
  ) => {
    if (!filePath || !fileName) {
      alert("ไม่พบภาพสำหรับดาวน์โหลด");
      return;
    }

    try {
      const response = await fetch(filePath);
      if (!response.ok) {
        throw new Error("ไม่สามารถดาวน์โหลดภาพได้");
      }

      const blob = await response.blob();
      const link = document.createElement("a");
      const url = window.URL.createObjectURL(blob);
      link.href = url;
      link.download = fileName || "image_download"; // ใช้ชื่อไฟล์ที่ระบุ
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error downloading image:", error);
      alert("เกิดข้อผิดพลาดในการดาวน์โหลดไฟล์ กรุณาลองใหม่อีกครั้ง");
    }
  };

  const handleDelete = async (insurance: InsuranceData) => {
    try {
      if (
        window.confirm(
          `คุณต้องการลบข้อมูลและไฟล์ที่เกี่ยวข้องของ ${insurance.registrationNumber} หรือไม่?`
        )
      ) {
        // เรียก API เพื่อลบไฟล์ที่เกี่ยวข้อง
        const deleteFile = async (filePath: string) => {
          if (!filePath) return;

          const response = await fetch(
            "https://api.mittaemaefahlung88.com/delete-file",
            {
              method: "DELETE",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                fileName: filePath.replace(/.*\/uploads\//, ""), // เอาเฉพาะ path ภายในโฟลเดอร์ uploads
              }),
            }
          );

          if (!response.ok) {
            const error = await response.json();
            console.error(`Error deleting file: ${filePath}`, error);
            throw new Error(`Failed to delete file: ${filePath}`);
          }
          // console.log(`File deleted successfully: ${filePath}`);
        };

        // ลบไฟล์รูป
        await deleteFile(insurance.registrationBookInsuranceCar.filePath);
        await deleteFile(
          insurance.registrationBookInsuranceMotorcycle.filePath
        );
        await deleteFile(insurance.titleDeed.filePath);
        await deleteFile(insurance.voluntaryInsuranceCar.filePath);
        await deleteFile(insurance.voluntaryInsuranceMotorcycle.filePath);
        await deleteFile(insurance.voluntaryInsuranceHouse.filePath);
        await deleteFile(insurance.noIDcard.filePath);

        // ลบข้อมูลจาก Firestore
        const docRef = doc(db, "insurances", insurance.docId);
        await deleteDoc(docRef);

        // อัปเดตสถานะใน React State
        setInsurances(insurances.filter((v) => v.docId !== insurance.docId));

        alert("ลบข้อมูลและไฟล์สำเร็จ");
      }
    } catch (error) {
      console.error("Error deleting insurance and files:", error);
      alert("ไม่สามารถลบข้อมูลหรือไฟล์ได้ กรุณาลองอีกครั้ง");
    }
  };

  const handleViewDetails = (insurance: InsuranceData) => {
    setSelectedInsurance(insurance);
    setShowModal(true);
  };

  const handleSelectAll = () => {
    if (isAllSelected) {
      setSelectedIds([]); // ยกเลิกการเลือกทั้งหมด
    } else {
      setSelectedIds(filteredInsurances.map((insurance) => insurance.docId)); // เลือกทั้งหมด
    }
    setIsAllSelected(!isAllSelected);
  };

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    setCurrentPage(1); // รีเซ็ตหน้าปัจจุบัน

    const filtered = insurances.filter(
      (insurance) =>
        insurance.registrationNumber
          .toLowerCase()
          .includes(term.toLowerCase()) ||
        insurance.registrationNumber.toLowerCase().includes(term.toLowerCase())
    );

    setFilteredInsurances(filtered);
  };

  const handleFilterUpdate = useCallback(() => {
    let filtered = [...insurances];

    if (filterType) {
      filtered = filtered.filter(
        (insurance) => insurance.insuranceType === filterType
      );
    }

    if (filterStatus) {
      filtered = filtered.filter(
        (insurance) => insurance.status === filterStatus
      );
    }

    if (filterCompany) {
      filtered = filtered.filter(
        (insurance) => insurance.insuranceCompany === filterCompany
      );
    }

    if (filterExtra) {
      filtered = filtered.filter(
        (insurance) => insurance.insuranceCategory === filterExtra
      );
    }

    if (searchTerm) {
      filtered = filtered.filter(
        (insurance) =>
          insurance.registrationNumber
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          insurance.registrationNumber
            .toLowerCase()
            .includes(searchTerm.toLowerCase())
      );
    }

    if (startDate && endDate) {
      filtered = filtered.filter((insurance) => {
        const uploadDate = dayjs(insurance.uploadTime);
        return uploadDate.isBetween(startDate, endDate, "day", "[]");
      });
    }

    setFilteredInsurances(filtered);
  }, [
    insurances,
    filterType,
    filterStatus,
    filterCompany,
    filterExtra,
    searchTerm,
    startDate,
    endDate,
  ]);

  // ฟังก์ชันกรองเมื่อค่า filterType เปลี่ยน
  const handleFilter = (type: string) => {
    setFilterType(type);
  };

  // ฟังก์ชันกรองเมื่อค่า filterStatus เปลี่ยน
  const handleStatusFilter = (status: string) => {
    setFilterStatus(status);
  };

  // ฟังก์ชันกรองเมื่อค่า filterProvince เปลี่ยน
  const handleCompanyFilter = (company: string) => {
    setFilterCompany(company);
  };

  // ฟังก์ชันกรองเมื่อค่า filterProvince เปลี่ยน
  const handleExtraFilter = (extra: string) => {
    setFilterExtra(extra);
  };

  const handleSort = (field: string) => {
    const newOrder =
      sortField === field && sortOrder === "asc" ? "desc" : "asc";
    setSortField(field);
    setSortOrder(newOrder);
    filterAndSortVehicles(searchTerm, filterType, field, newOrder);
  };

  const filterAndSortVehicles = (
    search: string,
    type: string,
    field: string,
    order: string
  ) => {
    let data = [...insurances];

    if (search) {
      data = data.filter((v) =>
        v.registrationNumber.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (type) {
      data = data.filter((v) => v.insuranceType === type);
    }

    data.sort((a, b) => {
      let valueA: string | number | Dayjs | undefined;
      let valueB: string | number | Dayjs | undefined;

      // ใช้ field เป็นคีย์สำหรับเลือก property ที่จะจัดเรียง
      if (field === "uploadTime") {
        valueA = dayjs(a.uploadTime);
        valueB = dayjs(b.uploadTime);
      } else {
        valueA = a[field as keyof InsuranceData] as string | number | undefined;
        valueB = b[field as keyof InsuranceData] as string | number | undefined;
      }

      // ตรวจสอบกรณีที่ valueA หรือ valueB เป็น undefined
      if (valueA === undefined || valueB === undefined) return 0;

      // จัดการกรณีที่ valueA และ valueB เป็น string หรือ number
      if (dayjs.isDayjs(valueA) && dayjs.isDayjs(valueB)) {
        return order === "asc"
          ? valueA.valueOf() - valueB.valueOf()
          : valueB.valueOf() - valueA.valueOf();
      }

      if (typeof valueA === "string" && typeof valueB === "string") {
        return order === "asc"
          ? valueA.localeCompare(valueB)
          : valueB.localeCompare(valueA);
      }

      if (typeof valueA === "number" && typeof valueB === "number") {
        return order === "asc" ? valueA - valueB : valueB - valueA;
      }

      return 0;
    });

    setFilteredInsurances(data);
  };

  useEffect(() => {
    const fetchInsurances = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "insurances"));
        const insuranceData = querySnapshot.docs.map((doc) => {
          const docData = doc.data() as InsuranceData;
          return { ...docData, docId: doc.id };
        });
        setInsurances(insuranceData);
        setFilteredInsurances(insuranceData);
      } catch (error) {
        console.error("Error fetching insurances:", error);
      }
    };

    fetchInsurances();
  }, []);

  useEffect(() => {
    handleFilterUpdate();
  }, [handleFilterUpdate]);

  useEffect(() => {
    setTotalInsurances(insurances.length);
    setCompletedInsurances(
      insurances.filter((v) => v.status === "สำเร็จแล้ว").length
    );
    setInProgressInsurances(
      insurances.filter((v) => v.status === "อยู่ระหว่างดำเนินการ").length
    );
    setAdditionalDocsInsurances(
      insurances.filter((v) => v.status === "รอเอกสารเพิ่มเติม").length
    );
  }, [insurances]);

  const paginatedInsurances = filteredInsurances.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (page: number) => setCurrentPage(page);

  // ฟังก์ชันสำหรับกรองตามช่วงเวลา
  const handleDateRangeFilter = () => {
    if (startDate && endDate) {
      const filtered = insurances.filter((insurance) => {
        const uploadDate = dayjs(insurance.uploadTime);
        return uploadDate.isBetween(startDate, endDate, "day", "[]");
      });
      setFilteredInsurances(filtered);
    } else {
      setFilteredInsurances(insurances);
    }
  };

  return (
    <div className="form-container page-container mx-auto mt-1">
      <div
        // xs={2}
        // sm={1}
        // md={1}
        // lg={1}
        // xl={1}
        className="d-flex justify-content-start align-items-end px-0"
      >
        {/* Sidebar insurance */}
        <SidebarAdmin
          formType="insuranceAdmin"
          isOpen={isSidebarOpen}
          onClose={toggleSidebar}
          onFilterStatus={handleStatusFilter}
          filterStatus={filterStatus}
          onSort={handleSort}
          sortField={sortField}
          sortOrder={sortOrder}
          onMultiSelect={handleMultiSelectToggle}
          onSelectAll={handleSelectAll}
          isMultiSelectMode={isMultiSelectMode}
          isAllSelected={isAllSelected}
          onLogout={() => {
            if (window.confirm("คุณต้องการออกจากระบบหรือไม่?")) {
              logout();
            }
          }}
          filterLabel="แสดงประเภทประกัน "
          filterType={filterType}
          filterOptions={[
            { label: "ประเภท 1", value: "ประเภท 1" },
            { label: "ประเภท 2", value: "ประเภท 2" },
            { label: "ประเภท 2+", value: "ประเภท 2+" },
            { label: "ประเภท 3+", value: "ประเภท 3+" },
            { label: "ประเภท 3", value: "ประเภท 3" },
            { label: "ประกันบ้าน หอพัก", value: "ประกันบ้าน หอพัก" },
            { label: "อุบัติเหตุ", value: "อุบัติเหตุ" },
          ]}
          onFilter={handleFilter}
          filterExtraLabel="แสดงบริษัทประกัน"
          filterExtra={filterExtra}
          filterExtraOptions={[
            { label: "มิตรแท้ประกันภัย", value: "มิตรแท้ประกันภัย" },
            { label: "เทเวศ ประกันภัย", value: "เทเวศ ประกันภัย" },
            { label: "เออร์โกประกันภัย", value: "เออร์โกประกันภัย" },
            { label: "ทิพยประกันภัย", value: "ทิพยประกันภัย" },
          ]}
          onFilterExtra={handleCompanyFilter}
          filterProvinceLabel="แสดงประเภท"
          filterProvince={filterCompany}
          filterProvinceOptions={[
            { label: "รถยนต์", value: "รถยนต์" },
            { label: "รถจักรยานยนต์", value: "รถจักรยานยนต์" },
            { label: "หอพัก บ้าน", value: "หอพัก บ้าน" },
            {
              label: "ประกันภัยทางทะเลและขนส่ง",
              value: "ประกันภัยทางทะเลและขนส่ง",
            },
            { label: "ประกันภัยเบ็ดเตล็ด", value: "ประกันภัยเบ็ดเตล็ด" },
          ]}
          onFilterProvince={handleExtraFilter}
          onStartDateChange={setStartDate}
          onEndDateChange={setEndDate}
          startDate={startDate}
          endDate={endDate}
          onDateRangeFilter={handleDateRangeFilter}
        />
      </div>
      <h1 className="text-success text-center mb-3">
        แดชบอร์ดแอดมินสำหรับประกัน ป1 ป2 ป3 ป4 ป5
      </h1>

      <AllInfo
        total={totalInsurances}
        completed={completedInsurances}
        inProgress={inProgressInsurances}
        additionalDocs={additionalDocsInsurances}
      />

      <Form>
        <Row>
          <div
            // xs={10}
            // sm={11}
            // md={11}
            // lg={11}
            // xl={11}
            className="mb-3"
            // style={{ padding: "0px 0px 0px 12px" }}
          >
            <TextInput
              label="ค้นหา"
              id="searchInput"
              placeholder="ค้นหาหมายเลขทะเบียน..."
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
            />
          </div>
        </Row>
        <Row className="responsive-container mb-3">
          {insurances.length === 0 ? (
            <Col>
              <p className="text-center text-muted">ไม่มีข้อมูลให้แสดง</p>
            </Col>
          ) : filteredInsurances.length === 0 ? (
            <Col>
              <p className="text-center text-muted">ไม่มีข้อมูลที่ค้นหา</p>
            </Col>
          ) : (
            paginatedInsurances.map((insurance, index) => (
              <Col
                xs={12}
                sm={12}
                md={6}
                lg={4}
                xl={4}
                key={index}
                className={`mb-3 ${isMultiSelectMode ? "selectable-card" : ""}`}
                onClick={
                  isMultiSelectMode
                    ? () => toggleSelect(insurance.docId)
                    : () => handleViewDetails(insurance)
                }
              >
                <div className="card">
                  <div
                    className="card-body"
                    style={{
                      cursor: "pointer",
                      border:
                        selectedIds.includes(insurance.docId) &&
                        isMultiSelectMode
                          ? "2px solid #28a745"
                          : "none",
                      borderRadius: "5px",
                    }}
                  >
                    <div
                      className="d-flex align-items-center justify-content-between"
                      style={{
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                      }}
                    >
                      <h4
                        className="card-title text-success mb-0"
                        style={{
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                        }}
                      >
                        {insurance.registrationNumber}
                      </h4>
                      {isMultiSelectMode && (
                        <Form.Check
                          className="custom-checkbox"
                          type="checkbox"
                          checked={selectedIds.includes(insurance.docId)}
                          onClick={(e) => e.stopPropagation()}
                          onChange={() => toggleSelect(insurance.docId)}
                        />
                      )}
                    </div>
                    <p className="card-text mt-4">
                      เบอร์ติดต่อ: {insurance.contactNumber}
                    </p>
                    <p className="card-text">
                      ประเภทประกัน: {insurance.insuranceType}
                    </p>
                    <p className="card-text">
                      บริษัทประกัน: {insurance.insuranceCompany}
                    </p>
                    <p className="card-text">
                      ประเภท: {insurance.insuranceCategory}
                    </p>
                    <p className="card-text">
                      เวลาที่อัปโหลด:{" "}
                      {dayjs(insurance.uploadTime).format(
                        "D MMMM YYYY เวลา HH:mm น."
                      )}
                    </p>
                    <p className="card-text">
                      สถานะ: {insurance.status}{" "}
                      {insurance.status === "สำเร็จแล้ว" ? (
                        <FaCheckCircle
                          className="text-success my-3"
                          size={20}
                        />
                      ) : insurance.status === "อยู่ระหว่างดำเนินการ" ? (
                        <FaClock className="text-info my-3" size={20} />
                      ) : (
                        <FaExclamationTriangle
                          className="text-warning my-3"
                          size={20}
                        />
                      )}
                    </p>

                    <div className="d-flex justify-content-end ">
                      <Button
                        className="mx-3"
                        variant="outline-danger"
                        onClick={(e) => {
                          e.stopPropagation(); // หยุดการกระจายเหตุการณ์ไปยังการ์ด
                          handleDelete(insurance);
                        }}
                      >
                        ลบ
                      </Button>
                      <Button
                        variant="success"
                        onClick={(e) => {
                          e.stopPropagation(); // หยุดการกระจายเหตุการณ์ไปยังการ์ด
                          handleViewDetails(insurance);
                        }}
                      >
                        ดูรายละเอียด
                      </Button>
                    </div>
                  </div>
                </div>
              </Col>
            ))
          )}
        </Row>

        <Row>
          <Col>
            {selectedIds.length > 0 && (
              <Button
                className=" mx-2 mb-3"
                variant="danger"
                onClick={handleDeleteSelected}
              >
                ลบ ({selectedIds.length}) รายการ
              </Button>
            )}

            {isMultiSelectMode && (
              <Button
                className=" mx-2 mb-3"
                variant="outline-success"
                onClick={handleSelectAll}
              >
                {isAllSelected ? "ยกเลิกการเลือกทั้งหมด" : "เลือกทั้งหมด"}
              </Button>
            )}
          </Col>
        </Row>
        <PaginationControls
          totalItems={filteredInsurances.length}
          itemsPerPage={itemsPerPage}
          currentPage={currentPage}
          onPageChange={handlePageChange}
        />
      </Form>

      {/* Modal for detailed view */}
      {selectedInsurance && (
        <Modal
          show={showModal}
          onHide={() => setShowModal(false)}
          size="xl"
          centered
        >
          <Modal.Header closeButton>
            <Modal.Title>
              <h4 className="my-0">รายละเอียด</h4>
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Row>
              <Col md={6}>
                <h5 className="mb-3">ข้อมูลทั่วไป</h5>
                <p>หมายเลขทะเบียน: {selectedInsurance.registrationNumber}</p>
                <p>เบอร์ติดต่อ: {selectedInsurance.contactNumber}</p>
                <p>ประเภทประกัน: {selectedInsurance.insuranceType}</p>
                <p>บริษัทประกัน: {selectedInsurance.insuranceCompany}</p>
                <p>หมวดหมู่: {selectedInsurance.insuranceCategory}</p>
                <p className="mb-4">
                  เวลาที่อัปโหลด:{" "}
                  {dayjs(selectedInsurance.uploadTime).format(
                    "D MMMM YYYY เวลา HH:mm น."
                  )}
                </p>
              </Col>
              <Col md={6}>
                {selectedInsurance.insuranceCategory === "รถยนต์" && (
                  <>
                    <h5 className="mb-3">ข้อมูลรถยนต์</h5>
                    <p>ยี่ห้อรถ: {selectedInsurance.vehicleBrand}</p>
                    <p>รุ่นรถ: {selectedInsurance.vehicleModel}</p>
                    <p>ขนาดเครื่องยนต์: {selectedInsurance.engineSize}</p>
                    <p>ปีรถ: {selectedInsurance.vehicleYear}</p>
                    <p>
                      จังหวัดจดทะเบียน:{" "}
                      {selectedInsurance.selectedProvinceRegistered}
                    </p>
                    <p>การใช้งานรถ: {selectedInsurance.vehiclePurpose}</p>
                    <p>
                      มีกล้องหน้ารถ:{" "}
                      {selectedInsurance.hasDashCam ? "ใช่" : "ไม่ใช่"}
                    </p>
                    <p>
                      จังหวัดผู้ขับขี่:{" "}
                      {selectedInsurance.selectedProvinceDriver}
                    </p>
                    <p>
                      เพศ:{" "}
                      {selectedInsurance.gender === "อื่นๆ"
                        ? `อื่นๆ (${selectedInsurance.gender})`
                        : selectedInsurance.gender}
                    </p>
                    <p>สถานภาพสมรส: {selectedInsurance.maritalStatus}</p>
                    <p className="mb-4">
                      อาชีพ: {selectedInsurance.occupation}
                    </p>
                  </>
                )}

                {selectedInsurance.insuranceCategory === "รถจักรยานยนต์" && (
                  <>
                    <h5 className="mb-3">ข้อมูลรถจักรยานยนต์</h5>
                    <p>ยี่ห้อรถ: {selectedInsurance.vehicleBrand}</p>
                    <p>รุ่นรถ: {selectedInsurance.vehicleModel}</p>
                    <p>ขนาดเครื่องยนต์: {selectedInsurance.engineSize}</p>
                    <p>ปีรถ: {selectedInsurance.vehicleYear}</p>
                    <p>
                      จังหวัดจดทะเบียน:{" "}
                      {selectedInsurance.selectedProvinceRegistered}
                    </p>
                    <p className="mb-4">
                      การใช้งานรถ: {selectedInsurance.vehiclePurpose}
                    </p>
                  </>
                )}

                {selectedInsurance.insuranceCategory === "หอพัก บ้าน" && (
                  <>
                    <h5 className="mb-3">ข้อมูลหอพัก/บ้าน</h5>
                    <p>ประเภททรัพย์สิน: {selectedInsurance.propertyType}</p>
                    <p>จังหวัด: {selectedInsurance.selectedProvinceLocation}</p>
                    <p className="mb-4">
                      มูลค่าทรัพย์สิน: {selectedInsurance.propertyValue} บาท
                    </p>
                  </>
                )}
              </Col>
              {/* <Col>
                <p>รวมค่าใช้จ่ายทั้งหมด: {selectedVehicle.totalCost} บาท</p>
              </Col> */}
            </Row>
            <Row>
              {/* ภาพทะเบียนรถยนต์ */}
              {selectedInsurance.insuranceCategory === "รถยนต์" && (
                <>
                  <div className="image-container text-center col mx-2">
                    {selectedInsurance?.registrationBookInsuranceCar
                      .filePath ? (
                      <>
                        <img
                          src={
                            selectedInsurance.registrationBookInsuranceCar
                              .filePath
                          }
                          alt="ภาพทะเบียนรถยนต์"
                          className="img-thumbnail"
                          onClick={() =>
                            setModalImage(
                              selectedInsurance.registrationBookInsuranceCar
                                .filePath
                            )
                          }
                        />
                        <p className="mb-2">ทะเบียนรถยนต์</p>
                      </>
                    ) : (
                      <p className="text-muted">ไม่พบภาพทะเบียนรถยนต์</p>
                    )}
                  </div>

                  {/* ภาพกรมธรรม์รถยนต์ */}
                  <div className="image-container text-center col mx-2">
                    {selectedInsurance?.voluntaryInsuranceCar.filePath ? (
                      <>
                        <img
                          src={selectedInsurance.voluntaryInsuranceCar.filePath}
                          alt="ภาพกรมธรรม์รถยนต์"
                          className="img-thumbnail "
                          onClick={() =>
                            setModalImage(
                              selectedInsurance.voluntaryInsuranceCar.filePath
                            )
                          }
                        />
                        <p className="mb-2">กรมธรรม์รถยนต์</p>
                      </>
                    ) : (
                      <p className="text-muted">ไม่พบภาพกรมธรรม์รถยนต์</p>
                    )}
                  </div>
                </>
              )}

              {/* ภาพทะเบียนรถจักรยานยนต์ */}
              {selectedInsurance.insuranceCategory === "รถจักรยานยนต์" && (
                <>
                  <div className="image-container text-center col mx-2">
                    {selectedInsurance?.registrationBookInsuranceMotorcycle
                      .filePath ? (
                      <>
                        <img
                          src={
                            selectedInsurance
                              .registrationBookInsuranceMotorcycle.filePath
                          }
                          alt="ภาพทะเบียนรถจักรยานยนต์"
                          className="img-thumbnail"
                          onClick={() =>
                            setModalImage(
                              selectedInsurance
                                .registrationBookInsuranceMotorcycle.filePath
                            )
                          }
                        />
                        <p className="mb-2">ทะเบียนรถจักรยานยนต์</p>
                      </>
                    ) : (
                      <p className="text-muted">ไม่พบภาพทะเบียนรถจักรยานยนต์</p>
                    )}
                  </div>

                  <div className="image-container text-center col mx-2">
                    {selectedInsurance?.voluntaryInsuranceMotorcycle
                      .filePath ? (
                      <>
                        <img
                          src={
                            selectedInsurance.voluntaryInsuranceMotorcycle
                              .filePath
                          }
                          alt="ภาพกรมธรรม์รถจักรยานยนต์"
                          className="img-thumbnail "
                          onClick={() =>
                            setModalImage(
                              selectedInsurance.voluntaryInsuranceMotorcycle
                                .filePath
                            )
                          }
                        />
                        <p className="mb-2">กรมธรรม์รถจักรยานยนต์</p>
                      </>
                    ) : (
                      <p className="text-muted">
                        ไม่พบภาพกรมธรรม์รถจักรยานยนต์
                      </p>
                    )}
                  </div>
                </>
              )}

              {/* ภาพโฉนด */}
              {selectedInsurance.insuranceCategory === "หอพัก บ้าน" && (
                <>
                  <div className="image-container text-center col mx-2">
                    {selectedInsurance?.titleDeed.filePath ? (
                      <>
                        <img
                          src={selectedInsurance.titleDeed.filePath}
                          alt="ภาพโฉนด"
                          className="img-thumbnail "
                          onClick={() =>
                            setModalImage(selectedInsurance.titleDeed.filePath)
                          }
                        />
                        <p className="mb-2">โฉนด</p>
                      </>
                    ) : (
                      <p className="text-muted">ไม่พบภาพโฉนด</p>
                    )}
                  </div>
                  <div className="image-container text-center col mx-2">
                    {selectedInsurance?.noIDcard.filePath ? (
                      <>
                        <img
                          src={selectedInsurance.noIDcard.filePath}
                          alt="ภาพบัตรประชาชน"
                          className="img-thumbnail "
                          onClick={() =>
                            setModalImage(selectedInsurance.noIDcard.filePath)
                          }
                        />
                        <p className="mb-2">บัตรประชาชน</p>
                      </>
                    ) : (
                      <p className="text-muted">ไม่พบภาพบัตรประชาชน</p>
                    )}
                  </div>

                  <div className="image-container text-center col mx-2">
                    {selectedInsurance?.voluntaryInsuranceHouse.filePath ? (
                      <>
                        <img
                          src={
                            selectedInsurance.voluntaryInsuranceHouse.filePath
                          }
                          alt="ภาพกรมธรรม์ที่ดิน"
                          className="img-thumbnail "
                          onClick={() =>
                            setModalImage(
                              selectedInsurance.voluntaryInsuranceHouse.filePath
                            )
                          }
                        />
                        <p className="mb-2">กรมธรรม์ที่ดิน</p>
                      </>
                    ) : (
                      <p className="text-muted">ไม่พบภาพกรมธรรม์ที่ดิน</p>
                    )}
                  </div>
                </>
              )}

              {/* ภาพกรมธรรม์รถยนต์ */}
              {/* <div className="image-container text-center col mx-2"></div> */}

              {/* ภาพกรมธรรม์รถจักรยานยนต์ */}
              {/* <div className="image-container text-center col mx-2"></div> */}

              {/* ภาพกรมธรรม์ที่ดิน */}
              {/* */}

              {/* ภาพบัตรประชาชน */}
              {/*  */}
            </Row>

            {/* <p >ค่าพรบ.: {selectedInsurance.prbCost} บาท</p>
            <p>ค่าภาษีประจำปี: {selectedInsurance.taxCost} บาท</p>
            <p>ค่าปรับล่าช้า: {selectedInsurance.lateFee} บาท</p>
            <p>
              ค่าตรวจสภาพรถเอกชน: {selectedInsurance.inspectionCost} บาท
            </p>
            <p>
              ค่าบริการและดำเนินการ: {selectedInsurance.processingCost} บาท
            </p> */}
          </Modal.Body>
          <Modal.Footer className="text-center align-items-end">
            <div>
              <ToggleButton
                type="radio"
                name="update-status"
                id="update-success"
                variant="outline-success"
                value="สำเร็จแล้ว"
                className="responsive-label mb-3 mx-2"
                checked={selectedInsurance?.status === "สำเร็จแล้ว"}
                onClick={() =>
                  updateStatus(selectedInsurance!.docId, "สำเร็จแล้ว")
                }
              >
                สำเร็จแล้ว
              </ToggleButton>
              <ToggleButton
                type="radio"
                name="update-status"
                id="update-ongoing"
                variant="outline-info"
                value="อยู่ระหว่างดำเนินการ"
                className="responsive-label mb-3 mx-2"
                onClick={() =>
                  updateStatus(selectedInsurance!.docId, "อยู่ระหว่างดำเนินการ")
                }
                checked={selectedInsurance?.status === "อยู่ระหว่างดำเนินการ"}
              >
                อยู่ระหว่างดำเนินการ
              </ToggleButton>
              <ToggleButton
                type="radio"
                name="update-status"
                id="update-moreDoc"
                variant="outline-warning"
                value="รอเอกสารเพิ่มเติม"
                className="responsive-label mb-3 mx-2 "
                checked={selectedInsurance?.status === "รอเอกสารเพิ่มเติม"}
                onClick={() =>
                  updateStatus(selectedInsurance!.docId, "รอเอกสารเพิ่มเติม")
                }
              >
                รอเอกสารเพิ่มเติม
              </ToggleButton>
            </div>
          </Modal.Footer>

          {/* Modal สำหรับดูภาพขยาย */}
          <Modal
            show={!!modalImage}
            onHide={() => setModalImage(null)}
            size="lg"
            centered
          >
            <Modal.Header closeButton>
              <Modal.Title>ดูภาพขยาย</Modal.Title>
            </Modal.Header>
            <Modal.Body className="text-center">
              {modalImage ? (
                <img
                  src={modalImage}
                  alt="ภาพขยาย"
                  style={{ maxWidth: "100%", maxHeight: "80vh" }}
                />
              ) : (
                <p className="text-muted">ไม่พบภาพ</p>
              )}
            </Modal.Body>
            <Modal.Footer>
              <Button
                variant="outline-success"
                className="responsive-label"
                onClick={() => {
                  if (modalImage && selectedInsurance) {
                    const matchingFile = Object.values(selectedInsurance).find(
                      (file) => {
                        if (
                          typeof file === "object" &&
                          file !== null &&
                          "filePath" in file &&
                          "storeFileName" in file &&
                          (file as { filePath: string }).filePath === modalImage
                        ) {
                          return true;
                        }
                        return false;
                      }
                    );

                    const fileName =
                      matchingFile && "storeFileName" in matchingFile
                        ? (matchingFile as { storeFileName: string })
                            .storeFileName || "image_download"
                        : "image_download";

                    handleDownload(modalImage, fileName);
                    console.log("modalImage:", modalImage);
                    console.log("matchingFile:", matchingFile);
                    console.log("selectedInsurance:", selectedInsurance);
                  } else {
                    alert("ไม่พบภาพสำหรับดาวน์โหลด");
                  }
                }}
              >
                ดาวน์โหลดไฟล์
              </Button>
            </Modal.Footer>
          </Modal>
        </Modal>
      )}
      <ScrollToTopAndBottomButton />
    </div>
  );
};

export default InsuranceAdmin;
