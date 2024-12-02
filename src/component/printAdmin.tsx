import React, { useEffect, useState } from "react";
import { db } from "../../firebaseConfig"; // ตั้งค่า Firestore ที่ config ไว้
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import { Col, Row, Form, Button } from "react-bootstrap";

// PrintAdmin.tsx
interface UploadData {
  fileName: string;
  fileType: string;
  numPages: number;
  numCopies: number;
  colorType: string;
  colorPercentage: number;
  totalPrice: number;
  uploadTime: string;
  filePath: string;
  docId: string;
  storedFileName: string;
}

const PrintAdmin: React.FC = () => {
  const [uploads, setUploads] = useState<UploadData[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");

  useEffect(() => {
    const fetchUploads = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "uploads"));
        const uploadData = querySnapshot.docs.map((doc) => {
          const docData = doc.data() as UploadData; // ดึงข้อมูลจาก Firestore
          return {
            ...docData, // spread ข้อมูลที่เหลือ
            docId: doc.id, // เพิ่ม docId
          };
        });
        setUploads(uploadData);
      } catch (error) {
        console.error("Error fetching uploads:", error);
      }
    };

    fetchUploads();
  }, []);

  const handleViewFile = (storedFileName: string) => {
    const fileUrl = `http://localhost:3000/uploads/${storedFileName}`;
    if (!storedFileName) {
      alert("ไม่พบไฟล์ที่ต้องการดู");
      console.log("ลองเปิด:", fileUrl);
      return;
    }

    console.log("Opening file at:", fileUrl);
    window.open(fileUrl, "_blank");
  };

  // const handleDownload = (filePath: string) => {
  //   if (!filePath) {
  //     alert("ไม่พบไฟล์ที่ต้องการดาวน์โหลด");
  //     return;
  //   }
  //   const fileName = decodeURIComponent(
  //     filePath.split("/").pop() || "download"
  //   );
  //   const link = document.createElement("a");
  //   link.href = filePath;
  //   link.download = fileName; // ตั้งชื่อไฟล์ตรงกับชื่อภาษาไทย
  //   link.click();
  // };

  // ฟังก์ชันลบข้อมูล
  const handleDelete = async (storedFileName: string, docId: string) => {
    try {
      if (window.confirm(`คุณต้องการลบไฟล์: ${storedFileName}?`)) {
        // ลบเอกสารจาก Firestore
        const docRef = doc(db, "uploads", docId);
        await deleteDoc(docRef);

        // ส่งคำขอลบไฟล์ไปที่เซิร์ฟเวอร์
        const response = await fetch("http://localhost:3000/delete-file", {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ fileName: storedFileName }), // ใช้ storedFileName
        });

        if (response.ok) {
          setUploads(
            uploads.filter((upload) => upload.storedFileName !== storedFileName)
          );
          alert("ลบไฟล์สำเร็จ");
          console.log(`File deleted successfully: ${storedFileName}`);
        } else {
          throw new Error("Failed to delete file on server");
        }
      }
    } catch (error) {
      console.error("Error deleting file:", error);
      alert("ไม่สามารถลบไฟล์ได้ กรุณาลองอีกครั้ง");
    }
  };

  // ฟังก์ชันค้นหา
  const filteredUploads = uploads.filter((upload) =>
    upload.fileName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="form-container mx-auto mt-1">
      <h1>แดชบอร์ดแอดมินสำหรับปริ้นเอกสาร</h1>
      <Form>
        <Row className="my-3">
          <Col xs={12} md={12} xl={12} className="mb-3">
            <Form.Control
              type="text"
              placeholder="ค้นหาชื่อไฟล์..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </Col>
        </Row>
        <Row className="mb-3">
          {filteredUploads.map((upload, index) => (
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
                  <h5 className="card-title">{upload.fileName}</h5>
                  <p className="card-text">ประเภทไฟล์: {upload.fileType}</p>
                  <p className="card-text">
                    จำนวนหน้าเอกสาร: {upload.numPages}
                  </p>
                  <p className="card-text">
                    จำนวนชุดที่ต้องการปริ้น: {upload.numCopies}
                  </p>
                  <p className="card-text">
                    ประเภทการปริ้น: {upload.colorType}
                  </p>
                  {/* <p className="card-text">
                    เปอร์เซ็นต์สีเฉลี่ย: {upload.colorPercentage.toFixed(2)}%
                  </p> */}
                  <p className="card-text">
                    ราคาทั้งหมด: {upload.totalPrice} บาท
                  </p>
                  <p className="card-text">
                    เวลาที่อัปโหลด:{" "}
                    {new Date(upload.uploadTime).toLocaleString()}
                  </p>
                  <div className="d-flex justify-content-end">
                    <div>
                      {/* <Button
                        className="ms-2"
                        variant="success"
                        onClick={() => handleDownload(upload.storedFileName)} // ใช้ storedFileName
                      >
                        ดาวน์โหลด
                      </Button> */}
                    </div>
                    <Button
                      className="mx-2"
                      variant="outline-danger"
                      onClick={() =>
                        handleDelete(upload.storedFileName, upload.docId)
                      }
                    >
                      ลบ
                    </Button>
                    <Button
                      variant="success"
                      onClick={() => handleViewFile(upload.storedFileName)}
                    >
                      ดูไฟล์
                    </Button>
                  </div>
                </div>
              </div>
            </Col>
          ))}
        </Row>
      </Form>
    </div>
  );
};

export default PrintAdmin;
