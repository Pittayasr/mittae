import React, { useEffect, useState } from "react";
import { db } from "../../firebaseConfig";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import { Col, Row, Form, Button, Modal } from "react-bootstrap";

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
}

//deliveryAdmin.tsx
const DeliveryAdmin: React.FC = () => {
  const [deliveries, setDeliveries] = useState<DeliveryData[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedDelivery, setSelectedDelivery] = useState<DeliveryData | null>(
    null
  );
  const [showModal, setShowModal] = useState<boolean>(false);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isMultiSelectMode, setIsMultiSelectMode] = useState<boolean>(false);

  useEffect(() => {
    const fetchDeliveries = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "delivery"));
        const deliveryData = querySnapshot.docs.map((doc) => {
          const docData = doc.data() as DeliveryData;
          return { ...docData, docId: doc.id };
        });
        setDeliveries(deliveryData);
      } catch (error) {
        console.error("Error fetching deliveries:", error);
      }
    };

    fetchDeliveries();
  }, []);

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id)
        ? prev.filter((selectedId) => selectedId !== id)
        : [...prev, id]
    );
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
            "${process.env.VITE_API_BASE_URL}/delete-file",
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
          console.log(`File deleted successfully: ${filePath}`);
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
            "${process.env.VITE_API_BASE_URL}/delete-file",
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
          console.log(`File deleted successfully: ${filePath}`);
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

  const filteredDeliveries = deliveries.filter(
    (delivery) =>
      delivery.senderInfo.ownerData
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      delivery.senderInfo.username
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      delivery.receiverInfo.username
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
  );

  return (
    <div
      className="form-container mx-auto mt-1"
      style={{
        textOverflow: "ellipsis",
        whiteSpace: "nowrap",
        overflow: "hidden",
      }}
    >
      <h1 className="text-success">แดชบอร์ดแอดมินสำหรับข้อมูลการจัดส่ง</h1>
      <Form>
        <Row className="my-3">
          <Col>
            <Form.Control
              type="text"
              placeholder="ค้นหาหมายเลขบัตรประชาชน,พาสปอร์ตของ, ชื่อผู้ส่งหรือผู้รับ"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </Col>
        </Row>
        <Row className="mb-3">
          {filteredDeliveries.map((delivery, index) => (
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
                      selectedIds.includes(delivery.docId) && isMultiSelectMode
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
                    <h5
                      className="card-title text-success"
                      style={{
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                      }}
                    >
                      ✅ผู้ส่ง: {delivery.senderInfo.username}
                    </h5>
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

                  <h5 className="card-title text-success mb-3 mt-4">
                    ✅ผู้รับ: {delivery.receiverInfo.username}
                  </h5>

                  <p className="card-text">
                    เบอร์ติดต่อ: {delivery.receiverInfo.contactNumber || "-"}
                  </p>

                  <p className="card-text">
                    ประเภทการจัดส่ง: {delivery.deliveryType}
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
          ))}
        </Row>
        <Col className="form-button-container">
          <Button
            className="form-button mx-2"
            variant={isMultiSelectMode ? "secondary" : "success"}
            onClick={handleMultiSelectToggle}
          >
            {isMultiSelectMode ? "ยกเลิกเลือกหลายรายการ" : "เลือกหลายรายการ"}
          </Button>
          {selectedIds.length > 0 && (
            <Button
              className="form-button"
              variant="danger"
              onClick={handleDeleteSelected}
            >
              ลบรายการที่เลือก ({selectedIds.length})
            </Button>
          )}
        </Col>
      </Form>

      {/* Modal for detailed view */}
      {selectedDelivery && (
        <Modal
          show={showModal}
          onHide={() => setShowModal(false)}
          size="lg"
          centered
        >
          <Modal.Header closeButton>
            <Modal.Title>รายละเอียดการจัดส่ง</Modal.Title>
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
                <p>
                  รหัสไปรษณีย์: {selectedDelivery.senderInfo.postalCode || "-"}
                </p>
                <p className="mt-5">
                  ประเภทการจัดส่ง: {selectedDelivery.deliveryType}
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
              </Col>
            </Row>
            {selectedDelivery.deliveryType !== "ส่งของปกติ" && (
              <>
                <hr />
                <h5 className="mb-4">🏍️ ข้อมูลรถจักรยารยนต์</h5>
                <p>ประเภทรถ: {selectedDelivery.vehicleInfo?.carType || "-"}</p>
                <p>ขนาดซีซี: {selectedDelivery.vehicleInfo?.ccSize || "-"}</p>
              </>
            )}
          </Modal.Body>
          <Modal.Footer>
            <Button
              variant="success"
              onClick={() =>
                selectedDelivery.senderInfo.passportOrIDnumberFilePath
                  ? window.open(
                      selectedDelivery.senderInfo.passportOrIDnumberFilePath,
                      "_blank"
                    )
                  : alert("ไม่มีภาพ")
              }
            >
              ดูไฟล์บัตรประชาชน/พาสปอร์ต
            </Button>
            {selectedDelivery.vehicleInfo &&
              selectedDelivery.deliveryType !== "ส่งของปกติ" && (
                <>
                  <Button
                    variant="success"
                    onClick={() =>
                      selectedDelivery.vehicleInfo?.registrationBookFilePath
                        ? window.open(
                            selectedDelivery.vehicleInfo
                              .registrationBookFilePath,
                            "_blank"
                          )
                        : alert("ไม่มีภาพ")
                    }
                  >
                    ดูไฟล์เล่มทะเบียนรถ
                  </Button>
                  <Button
                    variant="success"
                    onClick={() =>
                      selectedDelivery.vehicleInfo?.idCardFilePath
                        ? window.open(
                            selectedDelivery.vehicleInfo.idCardFilePath,
                            "_blank"
                          )
                        : alert("ไม่มีภาพ")
                    }
                  >
                    ดูไฟล์สำเนาบัตรประชาชน
                  </Button>
                </>
              )}
          </Modal.Footer>
        </Modal>
      )}
    </div>
  );
};

export default DeliveryAdmin;
