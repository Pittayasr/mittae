import React, { useEffect, useState } from "react";
import { db } from "../../firebaseConfig";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import { Col, Row, Form, Button, Modal } from "react-bootstrap";

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
}

const FormAdmin: React.FC = () => {
  const [vehicles, setVehicles] = useState<VehicleData[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedVehicle, setSelectedVehicle] = useState<VehicleData | null>(
    null
  );
  const [showModal, setShowModal] = useState<boolean>(false);

  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "prbform"));
        const vehicleData = querySnapshot.docs.map((doc) => {
          const docData = doc.data() as VehicleData;
          return { ...docData, docId: doc.id };
        });
        setVehicles(vehicleData);
      } catch (error) {
        console.error("Error fetching vehicles:", error);
      }
    };

    fetchVehicles();
  }, []);

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

          const response = await fetch("http://localhost:3000/delete-file", {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              fileName: filePath.replace(/.*\/uploads\//, ""), // เอาเฉพาะ path ภายในโฟลเดอร์ uploads
            }),
          });

          if (!response.ok) {
            const error = await response.json();
            console.error(`Error deleting file: ${filePath}`, error);
            throw new Error(`Failed to delete file: ${filePath}`);
          }
          console.log(`File deleted successfully: ${filePath}`);
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

  const filteredVehicles = vehicles.filter(
    (vehicle) =>
      vehicle.registrationNumber
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      vehicle.ownerData.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="form-container mx-auto mt-1">
      <h1 className="text-success">แดชบอร์ดแอดมินสำหรับฟอร์มพรบ.ต่อภาษีรถ</h1>
      <Form>
        <Row className="my-3">
          <Col>
            <Form.Control
              type="text"
              placeholder="ค้นหาหมายเลขทะเบียน, หมายเลขบัตรประชาชน, หมายเลขพาสปอร์ต..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </Col>
        </Row>
        <Row className="mb-3">
          {filteredVehicles.map((vehicle, index) => (
            <Col
              xs={12}
              sm={12}
              md={6}
              lg={4}
              xl={4}
              key={index}
              className="mb-3"
            >
              <div className="card">
                <div className="card-body">
                  <h5 className="card-title text-success">
                    {vehicle.registrationNumber}
                  </h5>
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
                  <div className="d-flex justify-content-end">
                    <Button
                      variant="outline-danger"
                      onClick={() => handleDelete(vehicle)}
                    >
                      ลบ
                    </Button>
                    <Button
                      variant="success"
                      onClick={() => handleViewDetails(vehicle)}
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
            <Modal.Title>รายละเอียดยานพาหนะ</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p>หมายเลขทะเบียน: {selectedVehicle.registrationNumber}</p>
            <p>จังหวัด: {selectedVehicle.province}</p>
            <p>ชื่อเจ้าของรถ: {selectedVehicle.usernameData}</p>
            <p>เบอร์ติดต่อ: {selectedVehicle.contactNumber}</p>
            <p>
              {selectedVehicle.selectedRadio} : {selectedVehicle.ownerData}
            </p>
            <hr></hr>
            <p className="mt-4">ประเภทรถ: {selectedVehicle.vehicleType}</p>
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
            <p>
              อายุรถ:
              {selectedVehicle.vehicleAge.years > 0 &&
                `${selectedVehicle.vehicleAge.years} ปี `}{" "}
              {selectedVehicle.vehicleAge.months > 0 &&
                `${selectedVehicle.vehicleAge.months} เดือน `}{" "}
              {selectedVehicle.vehicleAge.days > 0 &&
                `${selectedVehicle.vehicleAge.days} วัน`}
            </p>
            <hr></hr>
            <p className="mt-4">✅ ค่าพรบ. 🚘: {selectedVehicle.prbCost} บาท</p>
            <p>✅ ค่าภาษีประจำปี: {selectedVehicle.taxCost} บาท</p>
            <p>➕ ค่าปรับล่าช้า: {selectedVehicle.lateFee} บาท</p>
            <p>
              ✅ ค่าตรวจสภาพรถเอกชน 🛣️: {selectedVehicle.inspectionCost} บาท
            </p>
            <p>
              ✅ ค่าบริการและดำเนินการ ♎: {selectedVehicle.processingCost} บาท
            </p>
            <p>✅ ค่าทั้งหมด: {selectedVehicle.totalCost} บาท</p>
          </Modal.Body>
          <Modal.Footer>
            <Button
              variant="success"
              onClick={() =>
                window.open(selectedVehicle.registrationBookFilePath, "_blank")
              }
            >
              ภาพสำเนาภาพเล่มทะเบียนรถ
            </Button>
            <Button
              variant="success"
              onClick={() =>
                window.open(selectedVehicle.licensePlateFilePath, "_blank")
              }
            >
              ภาพแผ่นป้ายทะเบียนรถ
            </Button>
          </Modal.Footer>
        </Modal>
      )}
    </div>
  );
};

export default FormAdmin;
