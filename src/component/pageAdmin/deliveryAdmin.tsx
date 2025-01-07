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
import provinces from "../../data/provinces.json";
import { FaCheckCircle, FaExclamationTriangle, FaClock } from "react-icons/fa";

dayjs.locale("th");

dayjs.extend(isBetween);

interface DeliveryData {
  deliveryType: string;
  senderInfo: {
    username: string;
    contactNumber: string;
    ownerData: string;
    passportOrIDnumberFilePath: string | null;
    houseNo: string;
    villageNo: string;
    dormitory: string;
    soi: string;
    subDistrict: string;
    district: string;
    province: string;
    postalCode: string;
  };
  receiverInfo: {
    username: string;
    contactNumber: string;
    houseNo: string;
    villageNo: string;
    dormitory: string;
    soi: string;
    subDistrict: string;
    district: string;
    province: string;
    postalCode: string;
  };
  vehicleInfo?: {
    carType: string;
    ccSize: number;
    registrationBookFilePath: string | null;
    idCardFilePath: string | null;
  };
  deliveryCost: number;
  docId: string;
  uploadTime: string;
  status: "อยู่ระหว่างดำเนินการ" | "สำเร็จแล้ว" | "รอเอกสารเพิ่มเติม";
}

//deliveryAdmin.tsx
const DeliveryAdmin: React.FC = () => {
  const [provinceList] = useState(provinces);

  const [deliveries, setDeliveries] = useState<DeliveryData[]>([]);
  const [filteredDeliveries, setFilteredDeliveries] = useState<DeliveryData[]>(
    []
  );
  const [filterType, setFilterType] = useState<string>("");
  const [filterStatus, setFilterStatus] = useState<string>("");
  const [filterProvinceSender, setFilterProvinceSender] = useState<string>("");
  const [filterProvinceReceiver, setFilterProvinceReceiver] =
    useState<string>("");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedDelivery, setSelectedDelivery] = useState<DeliveryData | null>(
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

  const [totalDeliveries, setTotalDeliveries] = useState(0);
  const [completedDeliveries, setCompletedDeliveries] = useState(0);
  const [inProgressDeliveries, setInProgressDeliveries] = useState(0);
  const [additionalDocsDeliveries, setAdditionalDocsDeliveries] = useState(0);

  const { logout } = useAuth();

  const updateStatus = async (
    deliveryId: string,
    newStatus: "อยู่ระหว่างดำเนินการ" | "สำเร็จแล้ว" | "รอเอกสารเพิ่มเติม"
  ) => {
    try {
      const docRef = doc(db, "delivery", deliveryId);
      await updateDoc(docRef, { status: newStatus });

      // อัปเดต deliverys ใน State
      setDeliveries((prevDeliveries) =>
        prevDeliveries.map((delivery) =>
          delivery.docId === deliveryId
            ? { ...delivery, status: newStatus }
            : delivery
        )
      );

      // อัปเดต selectedVehicle ด้วยสถานะใหม่
      setSelectedDelivery((prevSelectedDelivery) =>
        prevSelectedDelivery?.docId === deliveryId
          ? { ...prevSelectedDelivery, status: newStatus }
          : prevSelectedDelivery
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
          const delivery = deliveries.find((d) => d.docId === id);
          if (delivery) {
            // ลบไฟล์ที่เกี่ยวข้อง
            if (delivery.senderInfo.passportOrIDnumberFilePath) {
              await deleteFile(delivery.senderInfo.passportOrIDnumberFilePath);
            }
            if (delivery.vehicleInfo?.registrationBookFilePath) {
              await deleteFile(delivery.vehicleInfo.registrationBookFilePath);
            }
            if (delivery.vehicleInfo?.idCardFilePath) {
              await deleteFile(delivery.vehicleInfo.idCardFilePath);
            }

            // ลบข้อมูลใน Firestore
            const docRef = doc(db, "delivery", id);
            await deleteDoc(docRef);
          }
        }

        // อัปเดตสถานะ
        setDeliveries(deliveries.filter((d) => !selectedIds.includes(d.docId)));
        setSelectedIds([]);
        alert("ลบรายการที่เลือกทั้งหมดสำเร็จ!");
      } catch (error) {
        console.error("Error deleting selected deliveries:", error);
        alert("เกิดข้อผิดพลาดในการลบรายการที่เลือก กรุณาลองใหม่อีกครั้ง");
      }
    }
  };

  const handleDelete = async (delivery: DeliveryData) => {
    try {
      if (
        window.confirm(
          `คุณต้องการลบข้อมูลและไฟล์ที่เกี่ยวข้องของ ${delivery.senderInfo.username} หรือไม่?`
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

        if (delivery.senderInfo.passportOrIDnumberFilePath) {
          await deleteFile(delivery.senderInfo.passportOrIDnumberFilePath);
        }
        if (delivery.vehicleInfo?.registrationBookFilePath) {
          await deleteFile(delivery.vehicleInfo.registrationBookFilePath);
        }
        if (delivery.vehicleInfo?.idCardFilePath) {
          await deleteFile(delivery.vehicleInfo.idCardFilePath);
        }

        // ลบข้อมูลจาก Firestore
        const docRef = doc(db, "delivery", delivery.docId);
        await deleteDoc(docRef);

        // อัปเดตสถานะใน React State
        setDeliveries(deliveries.filter((v) => v.docId !== delivery.docId));

        alert("ลบข้อมูลและไฟล์สำเร็จ");
      }
    } catch (error) {
      console.error("Error deleting delivery and files:", error);
      alert("ไม่สามารถลบข้อมูลหรือไฟล์ได้ กรุณาลองอีกครั้ง");
    }
  };

  const handleViewDetails = (delivery: DeliveryData) => {
    setSelectedDelivery(delivery);
    setShowModal(true);
  };

  const handleSelectAll = () => {
    if (isAllSelected) {
      setSelectedIds([]); // ยกเลิกการเลือกทั้งหมด
    } else {
      setSelectedIds(deliveries.map((delivery) => delivery.docId)); // เลือกทั้งหมด
    }
    setIsAllSelected(!isAllSelected);
  };

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    setCurrentPage(1); // รีเซ็ตหน้าปัจจุบัน

    const filtered = deliveries.filter(
      (delivery) =>
        delivery.senderInfo.username
          .toLowerCase()
          .includes(term.toLowerCase()) ||
        delivery.receiverInfo.username
          .toLowerCase()
          .includes(term.toLowerCase()) ||
        delivery.senderInfo.ownerData.toLowerCase().includes(term.toLowerCase())
    );

    setFilteredDeliveries(filtered);
  };

  const handleFilterUpdate = useCallback(() => {
    let filtered = [...deliveries];

    if (filterType) {
      filtered = filtered.filter(
        (delivery) => delivery.deliveryType === filterType
      );
    }

    if (filterStatus) {
      filtered = filtered.filter(
        (delivery) => delivery.status === filterStatus
      );
    }

    if (filterProvinceSender) {
      filtered = filtered.filter(
        (delivery) => delivery.senderInfo.province === filterProvinceSender
      );
    }

    if (filterProvinceReceiver) {
      filtered = filtered.filter(
        (delivery) => delivery.receiverInfo.province === filterProvinceReceiver
      );
    }

    if (searchTerm) {
      filtered = filtered.filter(
        (delivery) =>
          delivery.senderInfo.username
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          delivery.receiverInfo.username
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          delivery.senderInfo.ownerData
            .toLowerCase()
            .includes(searchTerm.toLowerCase())
      );
    }

    if (startDate && endDate) {
      filtered = filtered.filter((delivery) => {
        const uploadDate = dayjs(delivery.uploadTime);
        return uploadDate.isBetween(startDate, endDate, "day", "[]");
      });
    }

    setFilteredDeliveries(filtered);
  }, [
    deliveries,
    filterType,
    filterStatus,
    filterProvinceSender,
    filterProvinceReceiver,
    searchTerm,
    startDate,
    endDate,
  ]);

  const handleFilter = (type: string) => {
    setFilterType(type);
  };

  const handleStatusFilter = (status: string) => {
    setFilterStatus(status);
  };

  const handleProvinceSenderFilter = (province: string) => {
    setFilterProvinceSender(province);
  };

  const handleProvinceReceiverFilter = (province: string) => {
    setFilterProvinceReceiver(province);
  };

  const handleSort = (field: string) => {
    const newOrder =
      sortField === field && sortOrder === "asc" ? "desc" : "asc";
    setSortField(field);
    setSortOrder(newOrder);
    filterAndSortDeliveries(searchTerm, filterType, field, newOrder);
  };

  const filterAndSortDeliveries = (
    search: string,
    type: string,
    field: string,
    order: string
  ) => {
    let data = [...deliveries];

    if (search) {
      data = data.filter((delivery) =>
        delivery.senderInfo.username
          .toLowerCase()
          .includes(search.toLowerCase())
      );
    }

    if (type) {
      data = data.filter((delivery) => delivery.deliveryType === type);
    }

    data.sort((a, b) => {
      let valueA: string | number | Dayjs | undefined;
      let valueB: string | number | Dayjs | undefined;

      if (field === "uploadTime") {
        valueA = dayjs(a.uploadTime);
        valueB = dayjs(b.uploadTime);
      } else {
        valueA = a[field as keyof DeliveryData] as string | number | undefined;
        valueB = b[field as keyof DeliveryData] as string | number | undefined;
      }

      if (valueA === undefined || valueB === undefined) return 0;

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

    setFilteredDeliveries(data);
  };

  useEffect(() => {
    const fetchDeliveries = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "delivery"));
        const deliveryData = querySnapshot.docs.map((doc) => {
          const docData = doc.data() as DeliveryData;
          return { ...docData, docId: doc.id };
        });
        setDeliveries(deliveryData);
        setFilteredDeliveries(deliveryData);
      } catch (error) {
        console.error("Error fetching insurances:", error);
      }
    };

    fetchDeliveries();
  }, []);

  // ฟังก์ชัน useEffect สำหรับอัปเดตการกรอง
  useEffect(() => {
    handleFilterUpdate();
  }, [handleFilterUpdate]);

  // ฟังก์ชัน useEffect สำหรับคำนวณสถานะการจัดส่ง
  useEffect(() => {
    setTotalDeliveries(deliveries.length);
    setCompletedDeliveries(
      deliveries.filter((delivery) => delivery.status === "สำเร็จแล้ว").length
    );
    setInProgressDeliveries(
      deliveries.filter(
        (delivery) => delivery.status === "อยู่ระหว่างดำเนินการ"
      ).length
    );
    setAdditionalDocsDeliveries(
      deliveries.filter((delivery) => delivery.status === "รอเอกสารเพิ่มเติม")
        .length
    );
  }, [deliveries]);

  // การแบ่งข้อมูลจัดส่งเป็นหน้า
  const paginatedDeliveries = filteredDeliveries.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // ฟังก์ชันสำหรับเปลี่ยนหน้าปัจจุบัน
  const handlePageChange = (page: number) => setCurrentPage(page);

  // ฟังก์ชันกรองข้อมูลตามช่วงวันที่
  const handleDateRangeFilter = () => {
    if (startDate && endDate) {
      const filtered = deliveries.filter((delivery) => {
        const uploadDate = dayjs(delivery.uploadTime);
        return uploadDate.isBetween(startDate, endDate, "day", "[]");
      });
      setFilteredDeliveries(filtered);
    } else {
      setFilteredDeliveries(deliveries);
    }
  };

  const handleDownload = (url: string, fileName: string) => {
    const link = document.createElement("a");
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="form-container mx-auto mt-1">
      <div
            // xs={2}
            // sm={1}
            // md={1}
            // lg={1}
            // xl={1}
            className="d-flex justify-content-start align-items-end px-0"
          >
            

            {/* Sidebar formAdmin */}
            <SidebarAdmin
              formType="deliveryAdmin"
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
              filterLabel="แสดงประเภทส่งของ"
              filterType={filterType}
              filterOptions={[
                { label: "ส่งของปกติ", value: "ส่งของปกติ" },
                { label: "ส่งรถกลับบ้าน", value: "ส่งรถกลับบ้าน" },
              ]}
              onFilter={handleFilter}
              filterExtraLabel="จังหวัดผู้รับ"
              filterExtra={filterProvinceReceiver}
              filterExtraOptions={provinceList.map((p) => ({
                value: p.provinceNameTh,
                label: p.provinceNameTh,
              }))}
              onFilterExtra={handleProvinceReceiverFilter}
              filterProvinceLabel="จังหวัดผู้ส่ง"
              filterProvince={filterProvinceSender}
              filterProvinceOptions={provinceList.map((p) => ({
                value: p.provinceNameTh,
                label: p.provinceNameTh,
              }))}
              onFilterProvince={handleProvinceSenderFilter}
              onStartDateChange={setStartDate}
              onEndDateChange={setEndDate}
              startDate={startDate}
              endDate={endDate}
              onDateRangeFilter={handleDateRangeFilter}
            />
          </div>
      <h1 className="text-success text-center mb-3">
        แดชบอร์ดแอดมินสำหรับข้อมูลการจัดส่ง
      </h1>

      <AllInfo
        total={totalDeliveries}
        completed={completedDeliveries}
        inProgress={inProgressDeliveries}
        additionalDocs={additionalDocsDeliveries}
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
              placeholder="ค้นหาหมายเลขทะเบียน, หมายเลขบัตรประชาชน, หมายเลขพาสปอร์ต..."
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
            />
          </div>
        </Row>

        <Row className="responsive-container mb-3">
          {deliveries.length === 0 ? (
            <Col>
              <p className="text-center text-muted">ไม่มีข้อมูลให้แสดง</p>
            </Col>
          ) : filteredDeliveries.length === 0 ? (
            <Col>
              <p className="text-center text-muted">ไม่มีข้อมูลที่ค้นหา</p>
            </Col>
          ) : (
            paginatedDeliveries.map((delivery, index) => (
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
                    ? () => toggleSelect(delivery.docId)
                    : () => handleViewDetails(delivery)
                }
              >
                <div className="card">
                  <div
                    className="card-body"
                    style={{
                      cursor: "pointer",
                      border:
                        selectedIds.includes(delivery.docId) &&
                        isMultiSelectMode
                          ? "2px solid #28a745"
                          : "none",
                      borderRadius: "5px",
                    }}
                  >
                    <div
                      className="d-flex justify-content-between"
                      style={{
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                      }}
                    >
                      <h4
                        className="card-title text-success"
                        style={{
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                        }}
                      >
                        ผู้ส่ง: {delivery.senderInfo.username}
                      </h4>
                      {isMultiSelectMode && (
                        <Form.Check
                          className="custom-checkbox"
                          type="checkbox"
                          checked={selectedIds.includes(delivery.docId)}
                          onChange={(e) => {
                            e.stopPropagation();
                            toggleSelect(delivery.docId);
                          }}
                        />
                      )}
                    </div>
                    <p className="card-text">
                      {delivery.senderInfo.ownerData.includes("@")
                        ? "หมายเลขพาสปอร์ต"
                        : "หมายเลขบัตรประชาชน"}
                      : {delivery.senderInfo.ownerData || "-"}
                    </p>
                    <p className="card-text">
                      เบอร์ติดต่อ: {delivery.senderInfo.contactNumber || "-"}
                    </p>

                    <h4 className="card-title text-success mb-3 mt-4">
                      ผู้รับ: {delivery.receiverInfo.username}
                    </h4>

                    <p className="card-text">
                      เบอร์ติดต่อ: {delivery.receiverInfo.contactNumber || "-"}
                    </p>

                    <p className="card-text">
                      ประเภทการจัดส่ง: {delivery.deliveryType}
                    </p>
                    <p className="card-text">
                      เวลาที่อัปโหลด:{" "}
                      {dayjs(delivery.uploadTime).format(
                        "D MMMM YYYY เวลา HH:mm น."
                      )}
                    </p>
                    <p className="card-text">
                      สถานะ: {delivery.status}{" "}
                      {delivery.status === "สำเร็จแล้ว" ? (
                        <FaCheckCircle
                          className="text-success my-3"
                          size={20}
                        />
                      ) : delivery.status === "อยู่ระหว่างดำเนินการ" ? (
                        <FaClock className="text-info my-3" size={20} />
                      ) : (
                        <FaExclamationTriangle
                          className="text-warning my-3"
                          size={20}
                        />
                      )}
                    </p>
                    <div className="d-flex justify-content-end">
                      <Button
                        variant="outline-danger"
                        onClick={() => handleDelete(delivery)}
                      >
                        ลบ
                      </Button>
                      <Button
                        variant="success"
                        onClick={() => handleViewDetails(delivery)}
                        className="mx-2"
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
          <Col className="form-button-container">
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
          totalItems={filteredDeliveries.length}
          itemsPerPage={itemsPerPage}
          currentPage={currentPage}
          onPageChange={handlePageChange}
        />
      </Form>

      {/* Modal for detailed view */}
      {selectedDelivery && (
        <Modal
          show={showModal}
          onHide={() => setShowModal(false)}
          size="xl"
          centered
        >
          <Modal.Header closeButton>
            <Modal.Title>
              <h4>รายละเอียดการจัดส่ง</h4>
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Row>
              <Col md={6}>
                <h5 className="mb-4">✅ ผู้ส่ง</h5>
                <p>ชื่อ: {selectedDelivery.senderInfo.username || "-"}</p>
                <p>
                  เบอร์โทร: {selectedDelivery.senderInfo.contactNumber || "-"}
                </p>
                <p>
                  {selectedDelivery.senderInfo.ownerData.includes("@")
                    ? "หมายเลขพาสปอร์ต"
                    : "หมายเลขบัตรประชาชน"}
                  : {selectedDelivery.senderInfo.ownerData || "-"}
                </p>
                <p>บ้านเลขที่: {selectedDelivery.senderInfo.houseNo || "-"}</p>
                <p>หมู่ที่: {selectedDelivery.senderInfo.villageNo || "-"}</p>
                <p>หอพัก: {selectedDelivery.senderInfo.dormitory || "-"}</p>
                <p>ซอย: {selectedDelivery.senderInfo.soi || "-"}</p>
                <p>ตำบล: {selectedDelivery.senderInfo.subDistrict || "-"}</p>
                <p>อำเภอ: {selectedDelivery.senderInfo.district || "-"}</p>
                <p>จังหวัด: {selectedDelivery.senderInfo.province || "-"}</p>
                <p className="mb-4">
                  รหัสไปรษณีย์: {selectedDelivery.senderInfo.postalCode || "-"}
                </p>
              </Col>
              <Col md={6}>
                <h5 className="mb-4">✅ ผู้รับ</h5>
                <p>ชื่อ: {selectedDelivery.receiverInfo.username || "-"}</p>
                <p>
                  เบอร์โทร: {selectedDelivery.receiverInfo.contactNumber || "-"}
                </p>
                <p>
                  บ้านเลขที่: {selectedDelivery.receiverInfo.houseNo || "-"}
                </p>
                <p>หมู่ที่: {selectedDelivery.receiverInfo.villageNo || "-"}</p>
                <p>หอพัก: {selectedDelivery.receiverInfo.dormitory || "-"}</p>
                <p>ซอย: {selectedDelivery.receiverInfo.soi || "-"}</p>
                <p>ตำบล: {selectedDelivery.receiverInfo.subDistrict || "-"}</p>
                <p>อำเภอ: {selectedDelivery.receiverInfo.district || "-"}</p>
                <p>จังหวัด: {selectedDelivery.receiverInfo.province || "-"}</p>
                <p>
                  รหัสไปรษณีย์:{" "}
                  {selectedDelivery.receiverInfo.postalCode || "-"}
                </p>
                <p>ประเภทการจัดส่ง: {selectedDelivery.deliveryType}</p>
              </Col>
              <p className="mt-5">
                เวลาที่อัปโหลด:{" "}
                {dayjs(selectedDelivery.uploadTime).format("D MMMM YYYY HH:mm")}
              </p>
              <p>
                สถานะ: {selectedDelivery.status}{" "}
                {selectedDelivery.status === "สำเร็จแล้ว" ? (
                  <FaCheckCircle className="text-success" size={20} />
                ) : selectedDelivery.status === "อยู่ระหว่างดำเนินการ" ? (
                  <FaClock className="text-info" size={20} />
                ) : (
                  <FaExclamationTriangle className="text-warning" size={20} />
                )}
              </p>
            </Row>
            <Row>
              {selectedDelivery.deliveryType !== "ส่งของปกติ" && (
                <>
                  <hr />
                  <h5 className="mb-4">🏍️ ข้อมูลรถจักรยารยนต์</h5>
                  <p>
                    ประเภทรถ: {selectedDelivery.vehicleInfo?.carType || "-"}
                  </p>
                  <p>ขนาดซีซี: {selectedDelivery.vehicleInfo?.ccSize || "-"}</p>
                </>
              )}
            </Row>
            <Row>
              {selectedDelivery?.deliveryType === "ส่งรถกลับบ้าน" && (
                <>
                  <div className="image-container text-center col mx-2">
                    {selectedDelivery.senderInfo.passportOrIDnumberFilePath ? (
                      <>
                        <img
                          src={
                            selectedDelivery.senderInfo
                              .passportOrIDnumberFilePath
                          }
                          alt="พาสปอร์ตหรือบัตรประชาชนของผู้ส่ง"
                          className="img-thumbnail"
                          onClick={() =>
                            setModalImage(
                              selectedDelivery.senderInfo
                                .passportOrIDnumberFilePath
                            )
                          }
                        />
                        <p className="mb-2">พาสปอร์ตหรือบัตรประชาชน</p>
                      </>
                    ) : (
                      <p className="text-muted">
                        ไม่พบภาพพาสปอร์ตหรือบัตรประชาชน
                      </p>
                    )}
                  </div>
                  {/* แสดงภาพเล่มทะเบียนรถ */}
                  <div className="image-container text-center col mx-2">
                    {selectedDelivery.vehicleInfo?.registrationBookFilePath ? (
                      <>
                        <img
                          src={
                            selectedDelivery.vehicleInfo
                              .registrationBookFilePath
                          }
                          alt="เล่มทะเบียนรถ"
                          className="img-thumbnail"
                          onClick={() =>
                            setModalImage(
                              selectedDelivery.vehicleInfo
                                ?.registrationBookFilePath || ""
                            )
                          }
                        />
                        <p className="mb-2">เล่มทะเบียนรถ</p>
                      </>
                    ) : (
                      <p className="text-muted">ไม่พบภาพเล่มทะเบียนรถ</p>
                    )}
                  </div>

                  {/* แสดงภาพสำเนาบัตรประชาชน */}
                  <div className="image-container text-center col mx-2">
                    {selectedDelivery.vehicleInfo?.idCardFilePath ? (
                      <>
                        <img
                          src={selectedDelivery.vehicleInfo.idCardFilePath}
                          alt="สำเนาบัตรประชาชน"
                          className="img-thumbnail"
                          onClick={() =>
                            setModalImage(
                              selectedDelivery.vehicleInfo?.idCardFilePath || ""
                            )
                          }
                        />
                        <p className="mb-2">
                          สำเนาบัตรประชาชนผู้มีชื่อในสำเนารถ
                        </p>
                      </>
                    ) : (
                      <p className="text-muted">
                        ไม่พบภาพสำเนาบัตรประชาชนผู้มีชื่อในสำเนารถ
                      </p>
                    )}
                  </div>
                </>
              )}

              {selectedDelivery?.deliveryType === "ส่งของปกติ" && (
                <>
                  {/* แสดงภาพพาสปอร์ตหรือบัตรประชาชน */}
                  <div className="image-container-print text-center ">
                    {selectedDelivery.senderInfo.passportOrIDnumberFilePath ? (
                      <>
                        <img
                          src={
                            selectedDelivery.senderInfo
                              .passportOrIDnumberFilePath
                          }
                          alt="พาสปอร์ตหรือบัตรประชาชน"
                          className="img-thumbnail"
                          onClick={() =>
                            setModalImage(
                              selectedDelivery.senderInfo
                                .passportOrIDnumberFilePath
                            )
                          }
                        />
                        <p className="mb-2">พาสปอร์ตหรือบัตรประชาชน</p>
                      </>
                    ) : (
                      <p className="text-muted">
                        ไม่พบภาพพาสปอร์ตหรือบัตรประชาชน
                      </p>
                    )}
                  </div>
                </>
              )}
            </Row>
          </Modal.Body>
          <Modal.Footer>
            <div>
              <ToggleButton
                type="radio"
                name="update-status"
                id="update-success"
                variant="outline-success"
                value="สำเร็จแล้ว"
                className="responsive-label mb-3 mx-2"
                checked={selectedDelivery?.status === "สำเร็จแล้ว"}
                onClick={() =>
                  updateStatus(selectedDelivery!.docId, "สำเร็จแล้ว")
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
                checked={selectedDelivery?.status === "อยู่ระหว่างดำเนินการ"}
                onClick={() =>
                  updateStatus(selectedDelivery!.docId, "อยู่ระหว่างดำเนินการ")
                }
              >
                อยู่ระหว่างดำเนินการ
              </ToggleButton>
              <ToggleButton
                type="radio"
                name="update-status"
                id="update-moreDoc"
                variant="outline-warning"
                value="รอเอกสารเพิ่มเติม"
                className="responsive-label mb-3 mx-2"
                checked={selectedDelivery?.status === "รอเอกสารเพิ่มเติม"}
                onClick={() =>
                  updateStatus(selectedDelivery!.docId, "รอเอกสารเพิ่มเติม")
                }
              >
                รอเอกสารเพิ่มเติม
              </ToggleButton>
            </div>
          </Modal.Footer>
          <Modal
            show={!!modalImage}
            onHide={() => setModalImage(null)}
            size="xl"
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

export default DeliveryAdmin;
