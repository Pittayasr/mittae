import React, { useState, useEffect } from "react";
import { Button } from "react-bootstrap";
import "@fortawesome/fontawesome-free/css/all.min.css";

const ScrollToTopAndBottomButton: React.FC = () => {
  const [showButton, setShowButton] = useState(false);
  const [isAtTop, setIsAtTop] = useState(true);

  const togglePosition = () => {
    const scrollPosition = window.scrollY;
    const windowHeight = window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight;

    // แสดงปุ่มเมื่อเลื่อนเกิน 500px
    if (scrollPosition > 200) {
      setShowButton(true);
    } else {
      setShowButton(false);
    }

    // ตรวจสอบว่าอยู่ด้านบนสุดหรือใกล้ด้านล่างสุด
    if (scrollPosition + windowHeight >= documentHeight - 200) {
      setIsAtTop(false); // อยู่ใกล้ด้านล่าง
    } else if (scrollPosition <= 100) {
      setIsAtTop(true); // อยู่ด้านบน
    }
  };

  const scrollToPosition = () => {
    if (isAtTop) {
      // ถ้าอยู่ด้านบน -> เลื่อนไปด้านล่างสุด
      window.scrollTo({
        top: document.documentElement.scrollHeight,
        behavior: "smooth",
      });
    } else {
      // ถ้าอยู่ด้านล่าง -> เลื่อนไปด้านบนสุด
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", togglePosition);
    return () => {
      window.removeEventListener("scroll", togglePosition);
    };
  }, []);

  return (
    <>
      {showButton && (
        <Button
          variant="success"
          className="scroll-to-top "
          onClick={scrollToPosition}
          style={{
            position: "fixed",
            bottom: "15px",
            right: "15px",
            zIndex: 1000,
            borderRadius: "50%",
            padding: "8px 14px",
            fontSize: "1rem",
            opacity: "0.8",
          }}
        >
          <i className={`fas ${isAtTop ? "fa-arrow-down" : "fa-arrow-up"}`}></i>
        </Button>
      )}
    </>
  );
};

export default ScrollToTopAndBottomButton;
