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

//printAdmin.tsx
const PrintAdmin: React.FC = () => {
  const [uploads, setUploads] = useState<UploadData[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isMultiSelectMode, setIsMultiSelectMode] = useState<boolean>(false);

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

  // const handleViewFile = (filePath: string) => {
  //   if (!filePath) {
  //     alert("ไม่พบไฟล์ที่ต้องการดู");
  //     console.log("ลองเปิด:", filePath);
  //     return;
  //   }

  //   console.log("Opening file at:", filePath);
  //   window.open(filePath, "_blank");
  // };

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

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id)
        ? prev.filter((selectedId) => selectedId !== id)
        : [...prev, id]
    );
  };

  const handleMultiSelectToggle = () => {
    setIsMultiSelectMode((prev) => !prev);
    setSelectedIds([]);
  };

  const handleDeleteSelected = async () => {
    if (
      window.confirm(
        `คุณต้องการลบรายการที่เลือกทั้งหมด (${selectedIds.length} รายการ) หรือไม่?`
      )
    ) {
      try {
        for (const id of selectedIds) {
          const upload = uploads.find((u) => u.docId === id);
          if (upload) {
            await deleteDoc(doc(db, "uploads", id));
            await fetch("http://localhost:3000/delete-file", {
              method: "DELETE",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                fileName: upload.filePath.replace(/.*\/uploads\//, ""),
              }),
            });
          }
        }
        setUploads(uploads.filter((u) => !selectedIds.includes(u.docId)));
        setSelectedIds([]);
        alert("ลบรายการที่เลือกทั้งหมดสำเร็จ!");
      } catch (error) {
        console.error("Error deleting selected uploads:", error);
        alert("เกิดข้อผิดพลาดในการลบรายการที่เลือก กรุณาลองใหม่อีกครั้ง");
      }
    }
  };

  // ฟังก์ชันลบข้อมูล
  const handleDelete = async (
    fileName: string,
    filePath: string,
    docId: string
  ) => {
    try {
      if (window.confirm(`คุณต้องการลบข้อมูลและไฟล์ของ ${fileName} หรือไม่?`)) {
        // ลบเอกสารจาก Firestore
        const docRef = doc(db, "uploads", docId);
        await deleteDoc(docRef);

        // ส่งคำขอลบไฟล์ไปที่เซิร์ฟเวอร์
        const response = await fetch("http://localhost:3000/delete-file", {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            fileName: filePath.replace(/.*\/uploads\//, ""), // เอาเฉพาะ path ภายในโฟลเดอร์ uploads
          }),
        });

        if (response.ok) {
          // ลบข้อมูลออกจาก state
          setUploads(uploads.filter((upload) => upload.filePath !== filePath));
          alert("ลบไฟล์สำเร็จ");
          console.log(`File deleted successfully: ${filePath}`);
        } else {
          const error = await response.json();
          console.error("Error deleting file on server:", error);
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
      <h1 className="text-success">แดชบอร์ดแอดมินสำหรับปริ้นเอกสาร</h1>
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
              className={`mb-3 ${isMultiSelectMode ? "selectable-card" : ""}`}
              onClick={
                isMultiSelectMode
                  ? () => toggleSelect(upload.docId)
                  : () => window.open(upload.filePath, "_blank")
              }
            >
              <div className="card">
                <div
                  className="card-body"
                  style={{
                    cursor: "pointer",
                    border:
                      selectedIds.includes(upload.docId) && isMultiSelectMode
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
                    <h5
                      className="card-title text-success mb-0"
                      style={{
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                      }}
                    >
                      {upload.fileName}
                    </h5>
                    {isMultiSelectMode && (
                      <Form.Check
                        className="custom-checkbox"
                        type="checkbox"
                        checked={selectedIds.includes(upload.docId)}
                        onClick={(e) => e.stopPropagation()}
                        onChange={() => toggleSelect(upload.docId)}
                      />
                    )}
                  </div>
                  <p className="card-text mt-4">
                    ประเภทไฟล์: {upload.fileType}
                  </p>
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
                    เวลาที่อัปโหลด: {upload.uploadTime}
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
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(
                          upload.fileName,
                          upload.filePath,
                          upload.docId
                        );
                      }}
                    >
                      ลบ
                    </Button>
                    <Button
                      variant="success"
                      onClick={(e) => {
                        e.stopPropagation();
                        window.open(upload.filePath, "_blank");
                      }}
                    >
                      ดูไฟล์
                    </Button>
                  </div>
                </div>
              </div>
            </Col>
          ))}
        </Row>
        <Row>
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
        </Row>
      </Form>
    </div>
  );
};

export default PrintAdmin;
