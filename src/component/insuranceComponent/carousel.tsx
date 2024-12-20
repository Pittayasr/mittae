import React, { useState } from "react";
import { Carousel, Modal, Button } from "react-bootstrap";

interface CarouselProps {
  insuranceCompany: string | null;
  insuranceCategory: string | null;
}

const CarouselComponent: React.FC<CarouselProps> = ({
  insuranceCompany,
  insuranceCategory,
}) => {
  const [showModal, setShowModal] = useState(false);
  const [modalImage, setModalImage] = useState<string | null>(null);
  const [isPaused, setIsPaused] = useState(false);

  const handleShowModal = (image: string) => {
    setModalImage(image);
    setShowModal(true);
    setIsPaused(true); // Pause the carousel
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setModalImage(null);
    setIsPaused(false); // Resume the carousel
  };

  const getImages = (): string[] => {
    if (insuranceCompany === "มิตรแท้ประกันภัย") {
      if (
        insuranceCategory === "ประกันภัยทางทะเลและขนส่ง" ||
        insuranceCategory === "ประกันภัยเบ็ดเตล็ด"
      ) {
        return [
          "../../../public/data/etc/1.jpg",
          "../../../public/data/etc/2.jpg",
          "../../../public/data/etc/3.jpg",
        ];
      }
      return [
        "../../../public/data/mittare/p1.jpg",
        "../../../public/data/mittare/p1All.jpg",
        "../../../public/data/mittare/p2+.jpg",
        "../../../public/data/mittare/p2+All.jpg",
        "../../../public/data/mittare/p3.jpg",
        "../../../public/data/mittare/p3+.jpg",
        "../../../public/data/mittare/p3+All.jpg",
        "../../../public/data/mittare/คอนโด.jpg",
        "../../../public/data/mittare/ชดเชยรายได้.jpg",
        "../../../public/data/mittare/บาดเจ็บ.jpg",
        "../../../public/data/mittare/บ้านค้าขาย.jpg",
        "../../../public/data/mittare/ผู้พักในหอพัก.jpg",
        "../../../public/data/mittare/ร้านอาหารคาเฟ่.jpg",
      ];
    }
    if (insuranceCompany === "เทเวศ ประกันภัย") {
      return [
        "../../../public/data/deves/p1.png",
        "../../../public/data/deves/p2.jpeg",
        "../../../public/data/deves/p2+.jpeg",
        "../../../public/data/deves/p3.jpeg",
        "../../../public/data/deves/p3+.jpeg",
        "../../../public/data/deves/p3All.jpeg",
        "../../../public/data/deves/บ้าน.png",
        "../../../public/data/deves/อุบัติเหตุ.png",
      ];
    }
    if (insuranceCompany === "เออร์โกประกันภัย") {
      return [
        "../../../public/data/ERGO/p1.png",
        "../../../public/data/ERGO/p2.png",
        "../../../public/data/ERGO/p2+.png",
        "../../../public/data/ERGO/p3.jpeg",
        "../../../public/data/ERGO/p3.1.jpeg",
        "../../../public/data/ERGO/p3.2.jpeg",
        "../../../public/data/ERGO/p3+.webp",
        "../../../public/data/ERGO/บ้าน.jpeg",
      ];
    }
    if (insuranceCompany === "ทิพยประกันภัย") {
      return [
        "../../../public/data/dhipaya/p1.jpeg",
        "../../../public/data/dhipaya/p1.1.png",
        "../../../public/data/dhipaya/p2+.jpeg",
        "../../../public/data/dhipaya/p3.jpeg",
        "../../../public/data/dhipaya/p3+.jpeg",
        "../../../public/data/dhipaya/p3+.1.png",
        "../../../public/data/dhipaya/บ้าน.jpg",
        "../../../public/data/dhipaya/อุบัติเหตุ.jpg",
        "../../../public/data/dhipaya/อุบัติเหตุ2.jpeg    ",
      ];
    }
    return [];
  };

  const images = getImages();

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        marginTop: "20px",
        width: "100%",
      }}
    >
      {images.length > 0 && (
        <Carousel
          className="custom-carousel"
          interval={5000}
          pause={isPaused ? "hover" : undefined}
          style={{
            width: "90%",
            maxWidth: "800px",
            borderRadius: "10px",
            backgroundColor: "#f8f9fa",
            zIndex: "2",
          }}
        >
          {images.map((image, index) => (
            <Carousel.Item key={index}>
              <img
                src={image}
                alt={`Slide ${index}`}
                style={{
                  objectFit: "contain",
                  width: "100%",
                  height: "400px", // Adjust height for consistency
                  cursor: "pointer",
                  borderRadius: "10px",
                  position: "relative", // จัดการลำดับชั้น
                  zIndex: 1, // ทำให้ภาพอยู่ด้านล่าง
                }}
                onClick={() => handleShowModal(image)}
              />
            </Carousel.Item>
          ))}
        </Carousel>
      )}

      {/* Modal for viewing the image */}
      <Modal show={showModal} onHide={handleCloseModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>ภาพประกัน</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {modalImage && (
            <img
              src={modalImage}
              alt="Full View"
              style={{
                width: "100%",
                height: "auto",
                borderRadius: "10px",
              }}
            />
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            ปิด
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default CarouselComponent;
