//formAdmin.tsx
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
import { IoMdMore } from "react-icons/io";
import dayjs, { Dayjs } from "dayjs";
import "dayjs/locale/th";
import isBetween from "dayjs/plugin/isBetween";
import provinces from "../../data/provinces.json";
import {
  FaCheckCircle,
  FaExclamationTriangle,
  FaSpinner,
} from "react-icons/fa";

dayjs.locale("th");

dayjs.extend(isBetween);

interface VehicleData {
  bikeTypeOrDoorCount: string;
  contactNumber: string;
  expirationDate: string;
  inspectionCost: number;
  lateFee: number;
  latestTaxPaymentDate: string;
  ownerData: string;
  prbCost: number;
  processingCost: number;
  province: string;
  registrationDate: string;
  registrationNumber: string;
  taxCost: number;
  totalCost: number;
  usernameData: string;
  selectedProvince: string;
  vehicleAge: {
    days: number;
    months: number;
    years: number;
  };
  vehicleType: string;
  weightOrCC: string;
  CCorWeight: string;
  carOrMotorcycleLabel: string;
  engineSize: string | null;
  selectedRadio: string | null;
  docId: string;
  registrationBookFilePath: string;
  licensePlateFilePath: string;
  formSlipQRcodeFilePath: string;
  uploadTime: string;
  status: "อยู่ระหว่างดำเนินการ" | "สำเร็จแล้ว" | "รอเอกสารเพิ่มเติม";
}

const FormAdmin: React.FC = () => {
  const [provinceList] = useState(provinces);

  const [vehicles, setVehicles] = useState<VehicleData[]>([]);
  const [filteredVehicles, setFilteredVehicles] = useState<VehicleData[]>([]);
  const [filterType, setFilterType] = useState<string>("");
  const [filterStatus, setFilterStatus] = useState<string>("");
  const [filterProvince, setFilterProvince] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedVehicle, setSelectedVehicle] = useState<VehicleData | null>(
    null
  );
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

  const [totalVehicles, setTotalVehicles] = useState(0);
  const [completedVehicles, setCompletedVehicles] = useState(0);
  const [inProgressVehicles, setInProgressVehicles] = useState(0);
  const [additionalDocsVehicles, setAdditionalDocsVehicles] = useState(0);

  const { logout } = useAuth();

  const updateStatus = async (
    vehicleId: string,
    newStatus: "อยู่ระหว่างดำเนินการ" | "สำเร็จแล้ว" | "รอเอกสารเพิ่มเติม"
  ) => {
    try {
      const docRef = doc(db, "prbform", vehicleId);
      await updateDoc(docRef, { status: newStatus });

      // อัปเดต vehicles ใน State
      setVehicles((prevVehicles) =>
        prevVehicles.map((vehicle) =>
          vehicle.docId === vehicleId
            ? { ...vehicle, status: newStatus }
            : vehicle
        )
      );

      // อัปเดต selectedVehicle ด้วยสถานะใหม่
      setSelectedVehicle((prevSelectedVehicle) =>
        prevSelectedVehicle?.docId === vehicleId
          ? { ...prevSelectedVehicle, status: newStatus }
          : prevSelectedVehicle
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
          const vehicle = vehicles.find((v) => v.docId === id);
          if (vehicle) {
            // ลบไฟล์ที่เกี่ยวข้อง
            await deleteFile(vehicle.registrationBookFilePath);
            await deleteFile(vehicle.licensePlateFilePath);

            // ลบข้อมูลใน Firestore
            const docRef = doc(db, "prbform", id);
            await deleteDoc(docRef);
          }
        }
        // อัปเดต state
        setVehicles(vehicles.filter((v) => !selectedIds.includes(v.docId)));
        setSelectedIds([]); // รีเซ็ตรายการที่เลือก
        alert("ลบรายการที่เลือกทั้งหมดสำเร็จ!");
      } catch (error) {
        console.error("Error deleting selected vehicles:", error);
        alert("เกิดข้อผิดพลาดในการลบรายการที่เลือก กรุณาลองใหม่อีกครั้ง");
      }
    }
  };

  const handleDownload = async (filePath: string | null, fileName: string) => {
    if (!filePath) {
      alert("ไม่พบภาพสำหรับดาวน์โหลด");
      return;
    }

    try {
      // ตรวจสอบว่าภาพนั้นเป็น URL จากเซิร์ฟเวอร์ หรือเป็น Blob URL
      const response = await fetch(filePath);
      if (!response.ok) {
        throw new Error("ไม่สามารถดาวน์โหลดภาพได้");
      }

      // สร้าง Blob จาก response
      const blob = await response.blob();

      // สร้างลิงก์ดาวน์โหลด
      const link = document.createElement("a");
      const url = window.URL.createObjectURL(blob);
      link.href = url;
      link.download = fileName || "downloaded_image";
      document.body.appendChild(link);

      // เรียกดาวน์โหลด
      link.click();

      // ลบลิงก์และ URL หลังการใช้งาน
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error downloading image:", error);
      alert("เกิดข้อผิดพลาดในการดาวน์โหลดไฟล์ กรุณาลองใหม่อีกครั้ง");
    }
  };

  const handleDelete = async (vehicle: VehicleData) => {
    try {
      if (
        window.confirm(
          `คุณต้องการลบข้อมูลและไฟล์ที่เกี่ยวข้องของ ${vehicle.registrationNumber} หรือไม่?`
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

        // ลบไฟล์ทั้งสองรูป
        await deleteFile(vehicle.registrationBookFilePath);
        await deleteFile(vehicle.licensePlateFilePath);

        // ลบข้อมูลจาก Firestore
        const docRef = doc(db, "prbform", vehicle.docId);
        await deleteDoc(docRef);

        // อัปเดตสถานะใน React State
        setVehicles(vehicles.filter((v) => v.docId !== vehicle.docId));

        alert("ลบข้อมูลและไฟล์สำเร็จ");
      }
    } catch (error) {
      console.error("Error deleting vehicle and files:", error);
      alert("ไม่สามารถลบข้อมูลหรือไฟล์ได้ กรุณาลองอีกครั้ง");
    }
  };

  const handleViewDetails = (vehicle: VehicleData) => {
    setSelectedVehicle(vehicle);
    setShowModal(true);
  };

  const handleSelectAll = () => {
    if (isAllSelected) {
      setSelectedIds([]); // ยกเลิกการเลือกทั้งหมด
    } else {
      setSelectedIds(filteredVehicles.map((vehicle) => vehicle.docId)); // เลือกทั้งหมด
    }
    setIsAllSelected(!isAllSelected);
  };

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    setCurrentPage(1); // รีเซ็ตหน้าปัจจุบัน

    const filtered = vehicles.filter(
      (vehicle) =>
        vehicle.registrationNumber.toLowerCase().includes(term.toLowerCase()) ||
        vehicle.ownerData.toLowerCase().includes(term.toLowerCase())
    );

    setFilteredVehicles(filtered);
  };

  const handleFilterUpdate = useCallback(() => {
    let filtered = [...vehicles];

    if (filterType) {
      filtered = filtered.filter(
        (vehicle) => vehicle.vehicleType === filterType
      );
    }

    if (filterStatus) {
      filtered = filtered.filter((vehicle) => vehicle.status === filterStatus);
    }

    if (filterProvince) {
      filtered = filtered.filter(
        (vehicle) => vehicle.province === filterProvince
      );
    }

    if (searchTerm) {
      filtered = filtered.filter(
        (vehicle) =>
          vehicle.registrationNumber
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          vehicle.ownerData.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (startDate && endDate) {
      filtered = filtered.filter((vehicle) => {
        const uploadDate = dayjs(vehicle.uploadTime);
        return uploadDate.isBetween(startDate, endDate, "day", "[]");
      });
    }

    setFilteredVehicles(filtered);
  }, [
    vehicles,
    filterType,
    filterStatus,
    filterProvince,
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
  const handleProvinceFilter = (province: string) => {
    setFilterProvince(province);
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
    let data = [...vehicles];

    if (search) {
      data = data.filter((v) =>
        v.registrationNumber.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (type) {
      data = data.filter((v) => v.vehicleType === type);
    }

    data.sort((a, b) => {
      let valueA: string | number | Dayjs | undefined;
      let valueB: string | number | Dayjs | undefined;

      // ใช้ field เป็นคีย์สำหรับเลือก property ที่จะจัดเรียง
      if (field === "uploadTime") {
        valueA = dayjs(a.uploadTime);
        valueB = dayjs(b.uploadTime);
      } else {
        valueA = a[field as keyof VehicleData] as string | number | undefined;
        valueB = b[field as keyof VehicleData] as string | number | undefined;
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

    setFilteredVehicles(data);
  };

  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "prbform"));
        const vehicleData = querySnapshot.docs.map((doc) => {
          const docData = doc.data() as VehicleData;
          return { ...docData, docId: doc.id };
        });
        setVehicles(vehicleData);
        setFilteredVehicles(vehicleData);
      } catch (error) {
        console.error("Error fetching vehicles:", error);
      }
    };

    fetchVehicles();
  }, []);

  useEffect(() => {
    handleFilterUpdate();
  }, [handleFilterUpdate]);

  useEffect(() => {
    setTotalVehicles(vehicles.length);
    setCompletedVehicles(
      vehicles.filter((v) => v.status === "สำเร็จแล้ว").length
    );
    setInProgressVehicles(
      vehicles.filter((v) => v.status === "อยู่ระหว่างดำเนินการ").length
    );
    setAdditionalDocsVehicles(
      vehicles.filter((v) => v.status === "รอเอกสารเพิ่มเติม").length
    );
  }, [vehicles]);

  const paginatedVehicles = filteredVehicles.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (page: number) => setCurrentPage(page);

  // ฟังก์ชันสำหรับกรองตามช่วงเวลา
  const handleDateRangeFilter = () => {
    if (startDate && endDate) {
      const filtered = vehicles.filter((vehicle) => {
        const uploadDate = dayjs(vehicle.uploadTime);
        return uploadDate.isBetween(startDate, endDate, "day", "[]");
      });
      setFilteredVehicles(filtered);
    } else {
      setFilteredVehicles(vehicles);
    }
  };

  return (
    <div className="form-container page-container mx-auto mt-1">
      <h1 className="text-success text-center">
        แดชบอร์ดแอดมินสำหรับฟอร์มพรบ.ต่อภาษีรถ
      </h1>

      <AllInfo
        total={totalVehicles}
        completed={completedVehicles}
        inProgress={inProgressVehicles}
        additionalDocs={additionalDocsVehicles}
      />

      <Form>
        <Row>
          <Col
            xs={10}
            sm={11}
            md={11}
            lg={11}
            xl={11}
            className="mb-3"
            style={{ padding: "0px 0px 0px 12px" }}
          >
            <TextInput
              label="ค้นหา"
              id="searchInput"
              placeholder="ค้นหาหมายเลขทะเบียน, หมายเลขบัตรประชาชน, หมายเลขพาสปอร์ต..."
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
            />
          </Col>

          <Col
            xs={2}
            sm={1}
            md={1}
            lg={1}
            xl={1}
            className="d-flex justify-content-center align-items-end px-0"
          >
            {/* ปุ่มเปิด Sidebar */}
            <IoMdMore
              size={40}
              onClick={toggleSidebar}
              className="menuIcon"
              style={{
                cursor: "pointer",
                padding: "5px",
                margin: "10px 5px 15px 0px",
                borderBlockColor: "black",
                borderRadius: "10px",
              }}
            />

            {/* Sidebar formAdmin */}
            <SidebarAdmin
              formType="other"
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
              filterLabel="แสดงประเภทรถ"
              filterType={filterType}
              filterOptions={[
                { value: "", label: "แสดงทั้งหมด" },
                { label: "รถยนต์", value: "รถยนต์" },
                { label: "รถจักรยานยนต์", value: "รถจักรยานยนต์" },
                { label: "รถบรรทุก", value: "รถบรรทุก" },
                {
                  label: "รถบรรทุก(เกิน7ที่นั่ง)",
                  value: "รถบรรทุก(เกิน7ที่นั่ง)",
                },
                { label: "รถไฮบริด", value: "รถไฮบริด" },
                { label: "รถไฟฟ้า", value: "รถไฟฟ้า" },
                { label: "รถบดถนน", value: "รถบดถนน" },
                { label: "รถพ่วง", value: "รถพ่วง" },
                { label: "รถแทรกเตอร์", value: "รถแทรกเตอร์" },
                { label: "รถแก๊ส", value: "รถแก๊ส" },
              ]}
              onFilter={handleFilter}
              filterExtraLabel=""
              filterExtra={filterType}
              filterExtraOptions={[{ label: "", value: "" }]}
              onFilterExtra={handleFilter}
              filterProvinceLabel="จังหวัด"
              filterProvince={filterProvince}
              filterProvinceOptions={provinceList.map((p) => ({
                value: p.provinceNameTh,
                label: p.provinceNameTh,
              }))}
              onFilterProvince={handleProvinceFilter}
              onStartDateChange={setStartDate}
              onEndDateChange={setEndDate}
              startDate={startDate}
              endDate={endDate}
              onDateRangeFilter={handleDateRangeFilter}
            />
          </Col>
        </Row>
        <Row className="responsive-container mb-3">
          {vehicles.length === 0 ? (
            <Col>
              <p className="text-center text-muted">ไม่มีข้อมูลให้แสดง</p>
            </Col>
          ) : filteredVehicles.length === 0 ? (
            <Col>
              <p className="text-center text-muted">ไม่มีข้อมูลที่ค้นหา</p>
            </Col>
          ) : (
            paginatedVehicles.map((vehicle, index) => (
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
                    ? () => toggleSelect(vehicle.docId)
                    : () => handleViewDetails(vehicle)
                }
              >
                <div className="card">
                  <div
                    className="card-body"
                    style={{
                      cursor: "pointer",
                      border:
                        selectedIds.includes(vehicle.docId) && isMultiSelectMode
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
                        {vehicle.registrationNumber}
                      </h4>
                      {isMultiSelectMode && (
                        <Form.Check
                          className="custom-checkbox"
                          type="checkbox"
                          checked={selectedIds.includes(vehicle.docId)}
                          onClick={(e) => e.stopPropagation()}
                          onChange={() => toggleSelect(vehicle.docId)}
                        />
                      )}
                    </div>
                    <p className="card-text mt-4">
                      ชื่อเจ้าของรถ: {vehicle.usernameData}
                    </p>
                    <p className="card-text">
                      {vehicle.selectedRadio}: {vehicle.ownerData}
                    </p>
                    <p className="card-text">
                      เบอร์ติดต่อ: {vehicle.contactNumber}
                    </p>
                    <p className="card-text">ประเภทรถ: {vehicle.vehicleType}</p>
                    <p className="card-text">
                      วันสิ้นอายุ: {vehicle.expirationDate}
                    </p>
                    <p className="card-text">
                      เวลาที่อัปโหลด:{" "}
                      {dayjs(vehicle.uploadTime).format(
                        "D MMMM YYYY เวลา HH:mm น."
                      )}
                    </p>
                    <p className="card-text">
                      สถานะ: {vehicle.status}{" "}
                      {vehicle.status === "สำเร็จแล้ว" ? (
                        <FaCheckCircle
                          className="text-success my-3"
                          size={20}
                        />
                      ) : vehicle.status === "อยู่ระหว่างดำเนินการ" ? (
                        <FaSpinner className="text-info my-3" size={20} />
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
                          handleDelete(vehicle);
                        }}
                      >
                        ลบ
                      </Button>
                      <Button
                        variant="success"
                        onClick={(e) => {
                          e.stopPropagation(); // หยุดการกระจายเหตุการณ์ไปยังการ์ด
                          handleViewDetails(vehicle);
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
          totalItems={filteredVehicles.length}
          itemsPerPage={itemsPerPage}
          currentPage={currentPage}
          onPageChange={handlePageChange}
        />
      </Form>

      {/* Modal for detailed view */}
      {selectedVehicle && (
        <Modal
          show={showModal}
          onHide={() => setShowModal(false)}
          size="lg"
          centered
        >
          <Modal.Header closeButton>
            <Modal.Title>
              <h4 className="my-0">รายละเอียดยานพาหนะ</h4>
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Row>
              <Col md={6}>
                <p>หมายเลขทะเบียน: {selectedVehicle.registrationNumber}</p>
                <p>จังหวัด: {selectedVehicle.province}</p>
                <p>ชื่อเจ้าของรถ: {selectedVehicle.usernameData}</p>
                <p>เบอร์ติดต่อ: {selectedVehicle.contactNumber}</p>
                <p>
                  {selectedVehicle.selectedRadio} : {selectedVehicle.ownerData}
                </p>
                <p className="mb-4">
                  เวลาที่อัปโหลด:{" "}
                  {dayjs(selectedVehicle.uploadTime).format(
                    "D MMMM YYYY เวลา HH:mm น."
                  )}
                </p>
              </Col>
              <Col md={6}>
                <p>ประเภทรถ: {selectedVehicle.vehicleType}</p>
                <p>
                  {selectedVehicle.carOrMotorcycleLabel}:{" "}
                  {selectedVehicle.bikeTypeOrDoorCount}
                </p>
                <p>
                  {selectedVehicle.CCorWeight}: {selectedVehicle.engineSize}
                </p>
                <p>วันที่จดทะเบียน: {selectedVehicle.registrationDate}</p>
                <p>วันสิ้นอายุ : {selectedVehicle.expirationDate}</p>
                <p>วันต่อภาษีล่าสุด: {selectedVehicle.latestTaxPaymentDate}</p>
                <p className="mb-4">
                  อายุรถ:
                  {selectedVehicle.vehicleAge.years > 0 &&
                    `${selectedVehicle.vehicleAge.years} ปี `}{" "}
                  {selectedVehicle.vehicleAge.months > 0 &&
                    `${selectedVehicle.vehicleAge.months} เดือน `}{" "}
                  {selectedVehicle.vehicleAge.days > 0 &&
                    `${selectedVehicle.vehicleAge.days} วัน`}
                </p>
              </Col>
              <Col>
                <p>รวมค่าใช้จ่ายทั้งหมด: {selectedVehicle.totalCost} บาท</p>
              </Col>
            </Row>
            <Row>
              {/* ภาพเล่มทะเบียนรถ */}
              <div className="image-container text-center col mx-2">
                {selectedVehicle?.registrationBookFilePath ? (
                  <>
                    <img
                      src={selectedVehicle.registrationBookFilePath}
                      alt="ภาพเล่มทะเบียนรถ"
                      className="img-thumbnail"
                      onClick={() =>
                        setModalImage(selectedVehicle.registrationBookFilePath)
                      }
                    />
                    <p className="mb-2">เล่มทะเบียนรถ</p>
                    {/* <Button
                    size="sm"
                    variant="outline-primary"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDownload(
                        selectedVehicle.formSlipQRcodeFilePath,
                        "สลิปชำระเงิน"
                      );
                    }}
                  >
                    ดาวน์โหลดภาพ
                  </Button> */}
                  </>
                ) : (
                  <p className="text-muted">ไม่พบภาพเล่มทะเบียนรถ</p>
                )}
              </div>

              {/* ภาพแผ่นป้ายทะเบียน */}
              <div className="image-container text-center col mx-2">
                {selectedVehicle?.licensePlateFilePath ? (
                  <>
                    <img
                      src={selectedVehicle.licensePlateFilePath}
                      alt="ภาพแผ่นป้ายทะเบียน"
                      className="img-thumbnail"
                      onClick={() =>
                        setModalImage(selectedVehicle.licensePlateFilePath)
                      }
                    />
                    <p className="mb-2">แผ่นป้ายทะเบียน</p>
                  </>
                ) : (
                  <p className="text-muted">ไม่พบภาพแผ่นป้ายทะเบียน</p>
                )}
              </div>

              {/* ภาพสลิปชำระเงิน */}
              <div className="image-container text-center col mx-2">
                {selectedVehicle?.formSlipQRcodeFilePath ? (
                  <>
                    <img
                      src={selectedVehicle.formSlipQRcodeFilePath}
                      alt="ภาพสลิปชำระเงิน"
                      className="img-thumbnail "
                      onClick={() =>
                        setModalImage(selectedVehicle.formSlipQRcodeFilePath)
                      }
                    />
                    <p className="mb-2">สลิปชำระเงิน</p>
                  </>
                ) : (
                  <p className="text-muted">ไม่พบภาพสลิปชำระเงิน</p>
                )}
              </div>
            </Row>

            {/* <p className="mt-4">ค่าพรบ.: {selectedVehicle.prbCost} บาท</p>
            <p>ค่าภาษีประจำปี: {selectedVehicle.taxCost} บาท</p>
            <p>ค่าปรับล่าช้า: {selectedVehicle.lateFee} บาท</p>
            <p>
              ค่าตรวจสภาพรถเอกชน: {selectedVehicle.inspectionCost} บาท
            </p>
            <p>
              ค่าบริการและดำเนินการ: {selectedVehicle.processingCost} บาท
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
                checked={selectedVehicle?.status === "สำเร็จแล้ว"}
                onClick={() =>
                  updateStatus(selectedVehicle!.docId, "สำเร็จแล้ว")
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
                  updateStatus(selectedVehicle!.docId, "อยู่ระหว่างดำเนินการ")
                }
                checked={selectedVehicle?.status === "อยู่ระหว่างดำเนินการ"}
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
                checked={selectedVehicle?.status === "รอเอกสารเพิ่มเติม"}
                onClick={() =>
                  updateStatus(selectedVehicle!.docId, "รอเอกสารเพิ่มเติม")
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
                  if (modalImage) {
                    handleDownload(modalImage, "image_download");
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

export default FormAdmin;
