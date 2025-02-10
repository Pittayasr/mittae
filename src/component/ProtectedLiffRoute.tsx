import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useLiffAuth } from "./lineLiffAuthContext";

const ProtectedLiffRoute = ({ children }: { children: React.ReactNode }) => {
  const { userId, isLoading, login } = useLiffAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && !userId) {
      login();
    }
  }, [isLoading, userId, login]);

  useEffect(() => {
    // หลังจาก login เสร็จแล้ว ตรวจสอบ query parameter "liff.state"
    const params = new URLSearchParams(window.location.search);
    const liffState = params.get("liff.state");
    if (liffState) {
      navigate(liffState, { replace: true });
    }
  }, [userId, navigate]);

  if (isLoading) {
    return <div>กำลังโหลด...</div>;
  }

  if (!userId) {
    return <div>กำลังเข้าสู่ระบบ...</div>;
  }

  return <>{children}</>;
};

export default ProtectedLiffRoute;
