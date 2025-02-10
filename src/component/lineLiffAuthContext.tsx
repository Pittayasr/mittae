import { createContext, useContext, useState, useEffect } from "react";
import liff from "@line/liff";
import { useLocation } from "react-router-dom";

interface LiffAuthContextProps {
  userId: string | null;
  isLoading: boolean;
  login: () => void;
}

const LiffAuthContext = createContext<LiffAuthContextProps>({
  userId: null,
  isLoading: true,
  login: () => {},
});

export const LiffAuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [userId, setUserId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    const initializeLiff = async () => {
      console.log("เริ่มต้น LIFF...");
      try {
        await liff.init({ liffId: "2006837252-d37PQvNy" });
        console.log("LIFF Initialized สำเร็จ");
        if (liff.isLoggedIn()) {
          const profile = await liff.getProfile();
          console.log("ผู้ใช้ล็อกอินแล้ว:", profile);
          setUserId(profile.userId);
        } else {
          console.log("ผู้ใช้ยังไม่ได้ล็อกอิน, กำลังเรียก liff.login()");
          const redirectPath = location.hash
            ? `${location.pathname}${location.hash}`
            : location.pathname;
          liff.login({
            redirectUri: `${window.location.origin}${redirectPath}`,
          });
        }
      } catch (error) {
        console.error("LIFF Initialization Failed:", error);
      } finally {
        setIsLoading(false);
      }
    };

    initializeLiff();
  }, [location]);

  const login = () => {
    console.log("เรียกใช้งานฟังก์ชัน login()");
    if (!liff.isLoggedIn()) {
      liff.login({ redirectUri: window.location.href });
    }
  };

  return (
    <LiffAuthContext.Provider value={{ userId, isLoading, login }}>
      {children}
    </LiffAuthContext.Provider>
  );
};

export const useLiffAuth = () => useContext(LiffAuthContext);
