import React, { useState, useEffect } from "react";
import { Carousel, Modal } from "react-bootstrap";
import { useSwipeable } from "react-swipeable";

interface CarouselProps {
  insuranceCompany: string | null;
  insuranceCategory: string | null;
}

const CarouselComponent: React.FC<CarouselProps> = ({
  insuranceCompany,
  insuranceCategory,
}) => {
  const [showModal, setShowModal] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState<number>(0);
  const [carouselKey, setCarouselKey] = useState<number>(0);
  const [prevImages, setPrevImages] = useState<string[]>([]);

  const handleShowModal = (index: number) => {
    setCurrentImageIndex(index);
    setShowModal(true);
    setIsPaused(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setIsPaused(false);
  };

  const handleNext = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  const handlePrevious = () => {
    setCurrentImageIndex(
      (prevIndex) => (prevIndex - 1 + images.length) % images.length
    );
  };

  const handlers = useSwipeable({
    onSwipedLeft: handleNext,
    onSwipedRight: handlePrevious,
  });

  const getImages = (): string[] => {
    if (insuranceCompany === "มิตรแท้ประกันภัย") {
      if (
        insuranceCategory === "ประกันภัยทางทะเลและขนส่ง" ||
        insuranceCategory === "ประกันภัยเบ็ดเตล็ด"
      ) {
        return ["data/etc/1.jpg", "data/etc/2.jpg", "data/etc/3.jpg"];
      }
      return [
        "data/mittare/p1.jpg",
        "data/mittare/p1All.jpg",
        "data/mittare/p2+.jpg",
        "data/mittare/p2+All.jpg",
        "data/mittare/p3.jpg",
        "data/mittare/p3+.jpg",
        "data/mittare/p3+All.jpg",
        "data/mittare/คอนโด.jpg",
        "data/mittare/ชดเชยรายได้.jpg",
        "data/mittare/บาดเจ็บ.jpg",
        "data/mittare/บ้านค้าขาย.jpg",
        "data/mittare/ผู้พักในหอพัก.jpg",
        "data/mittare/ร้านอาหารคาเฟ่.jpg",
      ];
    }
    if (insuranceCompany === "เทเวศ ประกันภัย") {
      return [
        "data/deves/p1.png",
        "data/deves/p2.jpeg",
        "data/deves/p2+.jpeg",
        "data/deves/p3.jpeg",
        "data/deves/p3+.jpeg",
        "data/deves/p3All.jpeg",
        "data/deves/บ้าน.png",
        "data/deves/อุบัติเหตุ.png",
      ];
    }
    if (insuranceCompany === "เออร์โกประกันภัย") {
      return [
        "data/ERGO/p1.png",
        "data/ERGO/p2.png",
        "data/ERGO/p2+.png",
        "data/ERGO/p3.jpeg",
        "data/ERGO/p3.1.jpeg",
        "data/ERGO/p3.2.jpeg",
        "data/ERGO/p3+.webp",
        "data/ERGO/บ้าน.jpeg",
      ];
    }
    if (insuranceCompany === "ทิพยประกันภัย") {
      return [
        "data/dhipaya/p1.jpeg",
        "data/dhipaya/p1.1.png",
        "data/dhipaya/p2+.jpeg",
        "data/dhipaya/p3.jpeg",
        "data/dhipaya/p3+.jpeg",
        "data/dhipaya/p3+.1.png",
        "data/dhipaya/บ้าน.jpg",
        "data/dhipaya/อุบัติเหตุ.jpg",
        "data/dhipaya/อุบัติเหตุ2.jpeg    ",
      ];
    }
    return [];
  };

  const images = getImages();

  useEffect(() => {
    if (JSON.stringify(images) !== JSON.stringify(prevImages)) {
      setCarouselKey((prevKey) => prevKey + 1);
      setPrevImages(images);
    }
  }, [images, prevImages]);

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
          key={carouselKey}
          className="custom-carousel"
          interval={5000}
          pause={isPaused ? "hover" : undefined}
          style={{
            width: "90%",
            maxWidth: "800px",
            borderRadius: "10px",
            backgroundColor: "#f8f9fa",
          }}
        >
          {images.map((image, index) => (
            <Carousel.Item key={index}>
              <div
                style={{
                  position: "absolute",
                  top: "10px",
                  right: "10px",
                  color: "#fff",
                  zIndex: 2,
                  background: "rgba(0, 0, 0, 0.5)",
                  padding: "5px 10px",
                  borderRadius: "5px",
                }}
              >
                {index + 1}/{images.length}
              </div>
              <img
                src={image}
                alt={`Slide ${index}`}
                style={{
                  objectFit: "cover",
                  width: "100%",
                  height: "400px", // Adjust height for consistency
                  cursor: "pointer",
                  borderRadius: "10px",
                  position: "relative", // จัดการลำดับชั้น
                  zIndex: 1, // ทำให้ภาพอยู่ด้านล่าง
                }}
                onClick={() => handleShowModal(index)}
              />
            </Carousel.Item>
          ))}
        </Carousel>
      )}

      {/* Modal for viewing the image */}
      <Modal show={showModal} onHide={handleCloseModal} centered size="lg">
        <Modal.Header closeButton>
          <Modal.Title>ภาพประกัน</Modal.Title>
        </Modal.Header>
        <Modal.Body
          style={{ maxHeight: "80vh", overflowY: "auto", padding: "0" }}
        >
          <div
            {...handlers}
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "100%",
            }}
          >
            <a
              href={images[currentImageIndex]}
              target="_blank"
              rel="noopener noreferrer"
            >
              <img
                src={images[currentImageIndex]}
                alt={`Slide ${currentImageIndex}`}
                style={{
                  width: "100%",
                  maxHeight: "70vh",
                  objectFit: "contain",
                  borderRadius: "10px",
                  cursor: "pointer",
                }}
              />
            </a>
          </div>
          <p className="responsive-label mt-3 d-flex justify-content-center">
            กดรูปภาพเพื่อดูภาพขนาดใหญ่
          </p>
        </Modal.Body>
        <Modal.Footer className="d-flex justify-content-between">
          <button className="btn btn-success" onClick={handlePrevious}>
            ภาพก่อนหน้า
          </button>
          <button className="btn btn-success" onClick={handleNext}>
            ภาพถัดไป
          </button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default CarouselComponent;
