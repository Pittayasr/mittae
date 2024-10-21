// calculateTax.ts
import dayjs, { Dayjs } from "dayjs";
// ประกาศ interface สำหรับ CarDetails
interface CarDetails {
  isCar: boolean; //ถ้าเป็นรถยนต์
  isTwoDoor: boolean; // ถ้าเป็นรถยนต์ 2 ประตู
  isMotorcycleTrailer: boolean; // ถ้าเป็นจักรยานยนต์พ่วง
  weight: number; // น้ำหนักรถ
  cc: number; // ขนาด CC
  age: number; // อายุรถ (ปี)
  expiryDate: Date | null; // วันที่หมดอายุภาษี
  lastTaxDate: Date | null; // วันที่จ่ายภาษีครั้งล่าสุด
  isInChiangRai: boolean; // ถ้าอยู่ในจังหวัดเชียงราย
  isMotorcycle: boolean; // เพิ่มเพื่อระบุว่ารถเป็นจักรยานยนต์หรือไม่
  isCarTruck: boolean; // เพิ่มเพื่อระบุว่ารถเป็นรถบรรทุกหรือไม่
  isElectric: boolean; // เพิ่มเพื่อระบุว่ารถเป็นรถไฟฟ้าหรือไม่
  isHybrid: boolean; // เพิ่มเพื่อระบุว่ารถเป็นรถไฮบริดหรือไม่
  hasMoreThanSevenSeats: boolean; // เพิ่มเพื่อระบุว่ารถเป็นรถบรรทุกเกิน7ที่นั่งหรือไม่
  isRoadroller: boolean; // เพิ่มเพื่อระบุว่ารถเป็นรถบรรทุกเกิน7ที่นั่งหรือไม่
  isTractor: boolean; // เพิ่มเพื่อระบุว่ารถเป็นรถบรรทุกเกิน7ที่นั่งหรือไม่
  isCarTrailer: boolean; // ถ้าเป็นจักรยานยนต์พ่วง
}

// ฟังก์ชันสำหรับเช็คว่าเกิน 3 ปีไหม
const isMoreThanThreeYears = (
  lastTaxDate: Dayjs | null,
  expirationDate: Dayjs | null
): boolean => {
  if (lastTaxDate && expirationDate) {
    const yearDiff = expirationDate.diff(lastTaxDate, "year");
    return yearDiff > 3;
  }
  return false;
};

// ฟังก์ชันคำนวณภาษี
export const calculateTax = (car: CarDetails): number => {
  // คำนวณค่าภาษีพื้นฐาน
  const basePrbCar =
    // ตรวจสอบว่าประเภทรถเป็นรถยนต์, รถบรรทุก, รถบรรทุก (เกิน 7 ที่นั่ง), รถไฟฟ้า, รถไฮบริด
    (car.isCar ||
      car.isCarTruck ||
      car.isElectric ||
      car.isHybrid ||
      car.hasMoreThanSevenSeats) &&
    car.isTwoDoor // ตรวจสอบว่ารถมีเกิน 7 ที่นั่งหรือไม่ (ต้องเพิ่มพรอพเพอร์ตี้นี้ใน CarDetails)
      ? 975 // ถ้าเป็นรถ 2 ประตู หรือเข้าเงื่อนไขอื่นๆ ที่ระบุ
      : 675; // ถ้าไม่ใช่ 2 ประตูและไม่เข้าเงื่อนไขอื่น
  console.log("ค่าพรบ.รถยนต์   =", basePrbCar);

  // ภาษีตามCCของรถจักรยานยนต์
  const basePrbMotorcycle = car.isMotorcycle
    ? car.cc > 150
      ? 695
      : car.cc >= 125
      ? 480
      : car.cc >= 75
      ? 350
      : 211
    : 0;
  console.log("CC ของจักรยานยนต์:", car.cc);
  console.log("ค่าพรบ.รถจักรยานยนต์ที่คำนวณ:", basePrbMotorcycle);

  // พรบ.ประจำปีตามชนิดรถ
  const finalPrb = car.isMotorcycle ? basePrbMotorcycle : basePrbCar;
  console.log("ค่าพรบ.สุทธิ =", finalPrb);

  console.log("ค่าCC =", car.cc);

  // ภาษีตามCCของรถยนต์
  const taxCarCC =
    car.cc > 1800
      ? car.cc * 0.04
      : car.cc >= 601
      ? car.cc * 0.015
      : car.cc * 0.005;

  console.log("ค่าCCก่อนคำนวณ =", taxCarCC);

  const totalTaxCarCC =
    car.cc > 1800
      ? 5100 - (taxCarCC + car.cc)
      : car.cc >= 601
      ? taxCarCC + car.cc - 600
      : taxCarCC + car.cc;

  console.log("ค่าภาษีตามน้ำหนักรถยนต์ =", totalTaxCarCC);

  // ภาษีตามCCของรถจักรยานยนต์
  const taxMotorcycleCC = car.isMotorcycle
    ? car.isMotorcycleTrailer
      ? 50
      : 100
    : 0;
  console.log("ค่าภาษีตามน้ำหนักรถจักรยานยนต์ =", taxMotorcycleCC);

  // คำนวณภาษีตามน้ำหนัก
  const calculateTaxByCarWeight = (weight: number): number => {
    if (weight <= 500) return 150;
    if (weight <= 750) return 300;
    if (weight <= 1000) return 450;
    if (weight <= 1250) return 800;
    if (weight <= 1500) return 1000;
    if (weight <= 1750) return 1300;
    if (weight <= 2000) return 1600;
    if (weight <= 2500) return 1900;
    if (weight <= 3000) return 2200;
    if (weight <= 3500) return 2400;
    if (weight <= 4000) return 2600;
    if (weight <= 4500) return 2800;
    if (weight <= 5000) return 3000;
    if (weight <= 6000) return 3200;
    if (weight <= 7000) return 3400;
    return 3600;
  };
  // นำไปใช้ในโค้ดหลัก
  const taxCarWeight = calculateTaxByCarWeight(car.weight);
  console.log("ค่าภาษีตามน้ำหนัก =", taxCarWeight);

  // ภาษีตามชนิดรถ
  const finalTax = car.isMotorcycle
    ? isMoreThanThreeYears(dayjs(car.lastTaxDate), dayjs(car.expiryDate))
      ? 372
      : taxMotorcycleCC // ภาษีตาม CC ของจักรยานยนต์
    : car.isCarTruck ||
      car.isElectric ||
      car.isHybrid ||
      car.hasMoreThanSevenSeats
    ? taxCarWeight // ถ้าเป็นรถบรรทุก, รถไฟฟ้า, รถไฮบริด หรือรถบรรทุกเกิน 7 ที่นั่ง จะใช้คำนวณตามน้ำหนัก
    : car.isCar
    ? totalTaxCarCC // ถ้าเป็นรถยนต์ 2 ประตู ใช้ภาษีตาม CC ของรถยนต์
    : car.isRoadroller
    ? 200 // ถ้าเป็นรถบดถนน ใช้ภาษีคงที่ 200
    : car.isCarTrailer
    ? 100 // ถ้าเป็นรถจักรยานยนต์พ่วง ใช้ภาษีคงที่ 100
    : 50; // ค่าเริ่มต้นถ้าไม่เข้าเงื่อนไขอื่นๆ

  console.log("ค่าภาษีสุทธิ =", finalTax);

  const inspectionFee = car.isMotorcycle ? 100 : 400; // ค่าตรวจสภาพ
  const processingFee = car.isMotorcycle ? 300 : 400; // ค่าบริการ
  console.log("ค่าตรวจสภาพ =", inspectionFee);
  console.log("ค่าดำเนินการ =", processingFee);

  // ค่าปรับสำหรับการล่าช้า
  let lateFee = 0;
  if (car.age > 3) {
    const monthsLate = (car.age - 3) * 12; // คำนวณเดือนที่ล่าช้า
    lateFee += monthsLate; // ค่าปรับ 1 บาทต่อเดือน

    if (monthsLate >= 13 && monthsLate <= 24) {
      lateFee += finalTax * 0.2; // ปีแรกเพิ่ม 20%
    } else if (monthsLate > 24 && monthsLate <= 36) {
      lateFee += finalTax * 0.4; // ปีที่สองเพิ่ม 40%
    } else if (monthsLate > 36) {
      lateFee += 300; // ค่าปรับส่งมอบแผ่นป้ายล่าช้า

      // เงื่อนไขค่าจดทะเบียนใหม่
      const registrationFeeRates = car.isMotorcycle
        ? { chiangRai: 1500, other: 2500 }
        : { chiangRai: 2500, other: 3500 };
      console.log("ค้าจดทะเบียนใหม่ = ", registrationFeeRates);

      lateFee += car.isInChiangRai
        ? registrationFeeRates.chiangRai
        : registrationFeeRates.other;
      console.log("ค้าปรับล่าช้าเมื่อคิดตามจังหวัด = ", lateFee);
    }
  }

  lateFee =
    car.isMotorcycle &&
    isMoreThanThreeYears(dayjs(car.lastTaxDate), dayjs(car.expiryDate))
      ? 0
      : lateFee;
  console.log("ค่าปรับล่าช้า = ", lateFee);

  // ส่วนลดจะเพิ่ม 10% ต่อปีตั้งแต่อายุ 6 ปีขึ้นไป และจำกัดส่วนลดที่ 50%
  const discount = car.age >= 10 ? 0.5 : car.age >= 6 ? (car.age - 5) * 0.1 : 0;

  // คำนวณผลรวม
  console.log(
    "ค่าพรบ.สุทธิ: ",
    finalPrb,
    "+ ค่าภาษีสุทธิ: ",
    finalTax,
    "+ ค่าปรับล่าช้า: ",
    lateFee,
    "+ ค่าปรับล่าช้า: ",
    inspectionFee,
    "+ ค่าดำเนินการ: ",
    processingFee
  );
  const total = finalPrb + finalTax + lateFee + inspectionFee + processingFee;

  // Return ค่าที่คำนวณ
  const finalTotal = total * (1 - discount);
  console.log("คำนวณทั้งหมด = ", finalTotal);
  return Math.max(finalTotal, 0); // Ensure the total is not negative
};
