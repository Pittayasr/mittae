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
  docId: string;
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

  const handleDelete = async (docId: string) => {
    try {
      if (window.confirm("คุณต้องการลบข้อมูลนี้หรือไม่?")) {
        const docRef = doc(db, "prbform", docId);
        await deleteDoc(docRef);
        setVehicles(vehicles.filter((vehicle) => vehicle.docId !== docId));
        alert("ลบข้อมูลสำเร็จ");
      }
    } catch (error) {
      console.error("Error deleting vehicle:", error);
      alert("ไม่สามารถลบข้อมูลได้ กรุณาลองอีกครั้ง");
    }
  };

  const handleViewDetails = (vehicle: VehicleData) => {
    setSelectedVehicle(vehicle);
    setShowModal(true);
  };

  const filteredVehicles = vehicles.filter((vehicle) =>
    vehicle.registrationNumber.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="form-container mx-auto mt-1">
      <h1 className="text-success">แดชบอร์ดแอดมินสำหรับฟอร์มพรบ.ต่อภาษีรถ</h1>
      <Form>
        <Row className="my-3">
          <Col>
            <Form.Control
              type="text"
              placeholder="ค้นหาหมายเลขทะเบียน..."
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
                    เบอร์ติดต่อ: {vehicle.contactNumber}
                  </p>
                  <p className="card-text">ประเภทรถ: {vehicle.vehicleType}</p>
                  <p className="card-text">
                    วันสิ้นอายุ: {vehicle.expirationDate}
                  </p>
                  <div className="d-flex justify-content-end">
                    <Button
                      variant="outline-danger"
                      onClick={() => handleDelete(vehicle.docId)}
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
              หมายเลขบัตรประชาชน / หมายเลขพาสปอร์ต : {selectedVehicle.ownerData}
            </p>
            <p>ประเภทรถ: {selectedVehicle.vehicleType}</p>
            <p>
              จำนวนประตูรถ / ประเภทของรถจักรยานยนต์:{" "}
              {selectedVehicle.bikeTypeOrDoorCount}
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
          {/* <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowModal(false)}>
              ปิด
            </Button>
          </Modal.Footer> */}
        </Modal>
      )}
    </div>
  );
};

export default FormAdmin;
