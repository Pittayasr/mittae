interface CarDetails {
  isTwoDoor: boolean; // ถ้าเป็นรถยนต์ 2 ประตู
  isTrailer: boolean; // ถ้าเป็นจักรยานยนต์พ่วง
  weight: number; // น้ำหนักรถ
  cc: number; // ขนาด CC
  age: number; // อายุรถ (ปี)
  isInChiangRai: boolean; // ถ้าอยู่ในจังหวัดเชียงราย
  isMotorcycle: boolean; // เพิ่มเพื่อระบุว่ารถเป็นจักรยานยนต์หรือไม่
}

const calculateTax = (car: CarDetails): number => {
  const basePrb = car.isMotorcycle
    ? car.isTrailer
      ? 50 // ถ้าเป็นจักรยานยนต์และรถพ่วง
      : 100 // ถ้าเป็นจักรยานยนต์แต่ไม่ใช่รถพ่วง
    : car.isTwoDoor
    ? 975 // ถ้าเป็นรถยนต์ 2 ประตู
    : 675; // ถ้าเป็นรถยนต์ประเภทอื่น

  let tax = 0;
  let newRegistrationFee = 0;

  // คำนวณภาษีตามขนาด CC
  tax = car.cc * (car.cc > 1800 ? 0.04 : car.cc >= 601 ? 0.015 : 0.005);

  // คำนวณภาษีตามน้ำหนัก (taxWeight)
  let taxWeight = 0;
  if (car.weight <= 500) {
    taxWeight = 150;
  } else if (car.weight <= 750) {
    taxWeight = 300;
  } else if (car.weight <= 1000) {
    taxWeight = 450;
  } else if (car.weight <= 1250) {
    taxWeight = 800;
  } else if (car.weight <= 1500) {
    taxWeight = 1000;
  } else if (car.weight <= 1750) {
    taxWeight = 1300;
  } else if (car.weight <= 2000) {
    taxWeight = 1600;
  } else if (car.weight <= 2500) {
    taxWeight = 1900;
  } else if (car.weight <= 3000) {
    taxWeight = 2200;
  } else if (car.weight <= 3500) {
    taxWeight = 2400;
  } else if (car.weight <= 4000) {
    taxWeight = 2600;
  } else if (car.weight <= 4500) {
    taxWeight = 2800;
  } else if (car.weight <= 5000) {
    taxWeight = 3000;
  } else if (car.weight <= 6000) {
    taxWeight = 3200;
  } else if (car.weight <= 7000) {
    taxWeight = 3400;
  } else {
    taxWeight = 3600;
  }

  const inspectionFee = 400; // ค่าตรวจสภาพ
  const processingFee = 400; // ค่าบริการ

  // ค่าปรับสำหรับการล่าช้า
  let lateFee = 0;

  if (car.age > 3) {
    const monthsLate = car.age * 12; // เปลี่ยนปีเป็นเดือน
    lateFee += monthsLate; // ค่าปรับ 1 บาทต่อเดือน

    if (monthsLate >= 13 && monthsLate <= 24) {
      lateFee += 0.2 * tax; // ปีแรกเพิ่ม 20%
    } else if (monthsLate > 24 && monthsLate <= 36) {
      lateFee += 0.4 * tax; // ปีที่สองเพิ่ม 40%
    } else if (monthsLate > 36) {
      lateFee += 300; // ค่าปรับส่งมอบแผ่นป้ายล่าช้า

      // เงื่อนไขค่าจดทะเบียนใหม่
      const registrationFeeRates = car.isMotorcycle
        ? { chiangRai: 1500, other: 2500 }
        : { chiangRai: 2500, other: 3500 };

      newRegistrationFee = car.isInChiangRai
        ? registrationFeeRates.chiangRai
        : registrationFeeRates.other;

      lateFee += newRegistrationFee; // เพิ่มค่าจดทะเบียนใหม่ไปที่ lateFee
    }
  }

  // ส่วนลดจะเพิ่ม 10% ต่อปีตั้งแต่อายุ 6 ปีขึ้นไป และจำกัดส่วนลดที่ 50%
  const discountMap: { [key: number]: number } = {
    6: 0.1,
    7: 0.2,
    8: 0.3,
    9: 0.4,
  };
  let discount = discountMap[car.age] || (car.age >= 10 ? 0.5 : 0);

  // คำนวณผลรวม
  const total = basePrb + tax + lateFee + inspectionFee + processingFee;
  return total * (1 - discount); // นำส่วนลดไปคำนวณ
};

// ตัวอย่างการเรียกใช้งาน
const carDetails: CarDetails = {
  isTwoDoor: true,
  cc: 1200,
  weight: 2000,
  age: 5,
  isInChiangRai: true,
  isMotorcycle: false, // ไม่ใช่จักรยานยนต์
  isTrailer: true, //
};

const totalCost = calculateTax(carDetails);

console.log(`Total Cost: ${totalCost}`);
