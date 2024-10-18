// calculateTax.ts
// ประกาศ interface สำหรับ CarDetails
interface CarDetails {
  isTwoDoor: boolean; // ถ้าเป็นรถยนต์ 2 ประตู
  isTrailer: boolean; // ถ้าเป็นจักรยานยนต์พ่วง
  weight: number; // น้ำหนักรถ
  cc: number; // ขนาด CC
  age: number; // อายุรถ (ปี)
  isInChiangRai: boolean; // ถ้าอยู่ในจังหวัดเชียงราย
  isMotorcycle: boolean; // เพิ่มเพื่อระบุว่ารถเป็นจักรยานยนต์หรือไม่
}

// ฟังก์ชันคำนวณภาษี
export const calculateTax = (car: CarDetails): number => {
  // คำนวณค่าภาษีพื้นฐาน
  const basePrb = car.isMotorcycle
    ? (car.isTrailer ? 50 : 100) // ถ้าเป็นจักรยานยนต์และมีพ่วงหรือไม่
    : (car.isTwoDoor ? 975 : 675); // ถ้าเป็นรถยนต์ 2 ประตูหรือประเภทอื่น
  
  console.log("Base PRB:", basePrb);

  // คำนวณภาษีตามขนาด CC
  const tax = car.cc * (car.cc > 1800 ? 0.04 : car.cc >= 601 ? 0.015 : 0.005);
  console.log("Engine CC:", car.cc, "Tax based on CC:", tax);

  // คำนวณภาษีตามน้ำหนัก
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

  console.log("Weight:", car.weight, "Tax based on weight:", taxWeight);

  const inspectionFee = 400; // ค่าตรวจสภาพ
  const processingFee = 400; // ค่าบริการ

  // ค่าปรับสำหรับการล่าช้า
  let lateFee = 0;

  if (car.age > 3) {
    const monthsLate = (car.age - 3) * 12; // คำนวณเดือนที่ล่าช้า
    lateFee += monthsLate; // ค่าปรับ 1 บาทต่อเดือน
    console.log("Months late:", monthsLate, "Late fee (before penalty):", lateFee);

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

      lateFee += car.isInChiangRai ? registrationFeeRates.chiangRai : registrationFeeRates.other;
      console.log("Late fee (after Chiang Rai check):", lateFee);
    }
  }

  // ส่วนลดจะเพิ่ม 10% ต่อปีตั้งแต่อายุ 6 ปีขึ้นไป และจำกัดส่วนลดที่ 50%
  const discountMap: { [key: number]: number } = {
    6: 0.1,
    7: 0.2,
    8: 0.3,
    9: 0.4,
  };
  const discount = discountMap[car.age] || (car.age >= 10 ? 0.5 : 0);
  console.log("Car age:", car.age, "Discount:", discount);

  // คำนวณผลรวม
  const total = basePrb + tax + taxWeight + lateFee + inspectionFee + processingFee;
  console.log("Total before discount:", total);

  // Return ค่าที่คำนวณ
  const finalTotal = total * (1 - discount);
  console.log("Total after discount:", finalTotal);

  return finalTotal;
};


// // ตัวอย่างการเรียกใช้งาน
// const carDetails: CarDetails = {
//   isTwoDoor: false, // ไม่ใช่รถยนต์ 2 ประตู
//   isTrailer: false, // ไม่ใช่มอเตอร์ไซค์พ่วง
//   cc: 1200,
//   weight: 2000,
//   age: 5,
//   isInChiangRai: true,
//   isMotorcycle: false, // ไม่ใช่จักรยานยนต์
// };

// console.log();

// const totalCost = calculateTax(carDetails);

// console.log(`Total Cost: ${totalCost}`);
