// calculateTax.ts
interface CarDetails {
    isTwoDoor: boolean; // ถ้าเป็นรถยนต์ 2 ประตู
    cc: number; // ขนาด CC
    age: number; // อายุรถ (ปี)
    isInChiangRai: boolean; // ถ้าอยู่ในจังหวัดเชียงราย
  }
  
  const calculateTax = (car: CarDetails): number => {
    const basePrb = car.isTwoDoor ? 975 : 675; // ค่าพรบ.ตามประเภท
    let tax = 0;
  
    // คำนวณภาษีตามขนาด CC
    if (car.cc >= 601 && car.cc <= 1800) {
      tax = car.cc * 0.015; // อัตราภาษี 1.5%
    } else if (car.cc > 1800) {
      tax = car.cc * 0.04; // อัตราภาษี 4%
    } else {
      tax = car.cc * 0.005; // อัตราภาษี 0.5%  
    }
  
    const inspectionFee = 400; //ค่าตรวจสภาพ
    const processingFee = 400; //ค่าบริการ
  
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
        lateFee += car.isInChiangRai ? 2500 : 3500; // ค่าจดทะเบียนใหม่
      }
    }
  
    // ส่วนลดตามอายุรถ
    let discount = 0;
    if (car.age >= 6 && car.age < 10) {
      discount = 0.1; // ส่วนลด 10%
    } else if (car.age >= 10) {
      discount = 0.5; // ส่วนลดสูงสุด 50%
    }
  
    // คำนวณผลรวม
    const total = basePrb + tax + lateFee + inspectionFee + processingFee;
    return total * (1 - discount); // นำส่วนลดไปคำนวณ
  };
  
  // ตัวอย่างการเรียกใช้งาน
  const carDetails: CarDetails = {
    isTwoDoor: true,
    cc: 1200,
    age: 5,
    isInChiangRai: true,
  };
  
  const totalCost = calculateTax(carDetails);
  console.log(`Total Cost: ${totalCost}`);
  