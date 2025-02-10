// calculateTax.ts
import dayjs, { Dayjs } from "dayjs";
import taxByWeight from "../data/taxByWeight.json";

// ประกาศ interface สำหรับ CarDetails
export interface CarDetails {
  isCar: boolean;
  isTwoDoor: boolean;
  isMotorcycleTrailer: boolean;
  isMotorcycle: boolean;
  // isCarTruck: boolean;
  // isSpecializedTrucks: boolean;
  isPickupTruck: boolean;
  // isVan: boolean;
  isCarTrailer: boolean;
  isTractor: boolean;
  isTractorFarmer: boolean;
  hasMoreThanSevenSeats: boolean;
  weight: number;
  cc: number;
  age: number;

  isInChiangRai: boolean;

  isElectric: boolean;
  isHybrid: boolean;
  isOil: boolean;
  isGas: boolean;

  registerDate: Dayjs | null;
  expiryDate: Dayjs | null;
  lastTaxDate: Dayjs | null;
  missedTaxPayment: string | null;
  finalTotal: number;
  finalPrb: number;
  finalTax: number;
  lateFee: number;
  inspectionFee: number;
  processingFee: number;
  registrationFee: number;
  taxAnotherYear: number;

  isRegistrationCancelled: boolean;
}

// ฟังก์ชันโหลด holidaysData
let holidaysData: { Date: string; HolidayDescription: string }[] = [];

const loadHolidays = async (): Promise<void> => {
  try {
    const response = await fetch(
      "https://www.api.mittaemaefahlung88.com/data/holidays.json",
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        credentials: "include", // ✅ เพื่อให้รองรับ Cookies และ Authentication ถ้ามี
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    holidaysData = data.result?.data || [];
    console.log("✅ Holidays data loaded:", holidaysData);
  } catch (error) {
    console.error("❌ Failed to load holidays:", error);
  }
};

// เรียกใช้งานตอนเริ่มต้น
(async () => {
  await loadHolidays();
})();

// ฟังก์ชันตรวจสอบว่าเป็นวันหยุดหรือไม่
const isHoliday = (date: Dayjs): boolean => {
  const formattedMonthDay = date.format("MM-DD");
  const result = holidaysData.some((holiday) => {
    const holidayMonthDay = dayjs(holiday.Date).format("MM-DD");
    return holidayMonthDay === formattedMonthDay;
  });
  console.log(`isHoliday (${date.format("YYYY-MM-DD")}):`, result);
  return result;
};

// ฟังก์ชันปัดวันขึ้นหาวันทำการราชการปกติ
const getNextWorkingDay = (date: Dayjs): Dayjs => {
  let nextDate = date;
  while (isHoliday(nextDate) || nextDate.day() === 0 || nextDate.day() === 6) {
    // ปัดไปวันถัดไป หากเป็นวันหยุดหรือเสาร์-อาทิตย์
    nextDate = nextDate.add(1, "day");
  }
  console.log(
    `Next working day from ${date.format("YYYY-MM-DD")} is ${nextDate.format(
      "YYYY-MM-DD"
    )}`
  );
  return nextDate;
};

// ฟังก์ชันคำนวณอายุรถแบบละเอียด
export const calculateCarAge = (
  registerDate: Dayjs | null
): { years: number; months: number; days: number } => {
  if (!registerDate) return { years: 0, months: 0, days: 0 };

  const now = getNextWorkingDay(dayjs());
  const years = now.diff(registerDate, "year");
  const months = now.diff(registerDate.add(years, "year"), "month");
  const days = now.diff(
    registerDate.add(years, "year").add(months, "month"),
    "day"
  );

  console.log("CalculateCarAge:", {
    registerDate: registerDate.format("YYYY-MM-DD"),
    now: now.format("YYYY-MM-DD"),
    years,
    months,
    days,
  });
  return { years, months, days };
};

const isTaxOverdue = (
  expirationDate: Dayjs | null
): {
  isOverdue: boolean;
  isNotOverdue: boolean;
  overdueMonths: number;
  overdueDays: number;
} => {
  if (!expirationDate)
    return {
      isOverdue: false,
      isNotOverdue: false,
      overdueMonths: 0,
      overdueDays: 0,
    };

  const currentDate = getNextWorkingDay(dayjs());
  if (currentDate.isAfter(expirationDate)) {
    const overdueMonths = currentDate.diff(expirationDate, "month");
    const adjustedDate = expirationDate.add(overdueMonths, "month");
    const overdueDays = currentDate.diff(adjustedDate, "day");
    console.log("isTaxOverdue:", {
      วันสิ้นอายุ: expirationDate.format("YYYY-MM-DD"),
      วันปัจจุบัน: currentDate.format("YYYY-MM-DD"),
      isOverdue: true,
      isNotOverdue: false,
      overdueMonths: overdueMonths + 1,
      overdueDays: overdueDays,
    });
    return {
      isOverdue: true,
      isNotOverdue: false,
      overdueMonths: overdueMonths + 1,
      overdueDays,
    };
  }

  if (currentDate.isBefore(expirationDate)) {
    const overdueMonths = currentDate.diff(expirationDate, "month");
    const overdueDays = currentDate.diff(expirationDate, "day") % 30;
    if (overdueDays <= 90) {
      console.log("isTaxOverdue:", {
        วันสิ้นอายุ: expirationDate.format("YYYY-MM-DD"),
        วันปัจจุบัน: currentDate.format("YYYY-MM-DD"),
        isOverdue: false,
        isNotOverdue: true,
        overdueMonths: overdueMonths,
        overdueDays: overdueDays,
      });
      return {
        isOverdue: false,
        isNotOverdue: true,
        overdueMonths: overdueMonths,
        overdueDays: overdueDays,
      };
    }
  }

  console.log("isTaxOverdue:", {
    expirationDate: expirationDate.format("YYYY-MM-DD"),
    currentDate: currentDate.format("YYYY-MM-DD"),
    isOverdue: false,
  });

  return {
    isOverdue: false,
    isNotOverdue: true,
    overdueMonths: 0,
    overdueDays: 0,
  };
};

// ฟังก์ชันสำหรับเช็คว่าเกิน 3 ปีไหม
const isMoreThanThreeYears = (expirationDate: Dayjs | null): boolean => {
  if (!expirationDate) return false;

  const currentDate = getNextWorkingDay(dayjs());
  const monthsDifference = currentDate.diff(expirationDate, "month");
  const result = monthsDifference > 36; // เกิน 3 ปี = 36 เดือน
  console.log("isMoreThanThreeYears:", {
    expirationDate: expirationDate.format("YYYY-MM-DD"),
    currentDate: currentDate.format("YYYY-MM-DD"),
    monthsDifference,
    result,
  });
  return result;
};

// ฟังก์ชันตรวจสอบว่าวันจดทะเบียนอยู่ในช่วงได้รับส่วนลดหรือไม่
const isEligibleForElectricTaxDiscount = (
  registerDate: Dayjs | null
): boolean => {
  if (!registerDate) return false;

  const discountStartDate = dayjs("2022-11-09"); // 9 พฤศจิกายน 2565
  const discountEndDate = dayjs("2025-11-10"); // 10 พฤศจิกายน 2568
  const oneYearAfterRegistration = registerDate.add(1, "year");

  const eligible =
    registerDate.isBetween(discountStartDate, discountEndDate, null, "[]") &&
    dayjs().isBefore(oneYearAfterRegistration);
  console.log("isEligibleForElectricTaxDiscount:", {
    registerDate: registerDate.format("YYYY-MM-DD"),
    discountStartDate: discountStartDate.format("YYYY-MM-DD"),
    discountEndDate: discountEndDate.format("YYYY-MM-DD"),
    oneYearAfterRegistration: oneYearAfterRegistration.format("YYYY-MM-DD"),
    currentDate: dayjs().format("YYYY-MM-DD"),
    eligible,
  });
  return eligible;
};

const roundUp = (value: number): number => Math.ceil(value);

// ฟังก์ชันคำนวณภาษี
export const calculateTax = (
  car: CarDetails
): {
  finalTotal: number;
  finalPrb: number;
  finalTax: number;
  lateFee: number;
  inspectionFee: number;
  processingFee: number;
  registrationFee: number;
  taxAnotherYear: number;
} => {
  console.log("===== เริ่มคำนวณภาษีสำหรับรถ =====");
  console.log("ข้อมูลรถที่ได้รับ:", car);

  const carAge = calculateCarAge(car.registerDate);
  console.log("Car Age:", carAge);

  // คำนวณค่าพรบ.
  const basePrbCar = car.isTwoDoor ? 975 : 675;
  console.log("basePrbCar (สำหรับรถยนต์):", basePrbCar);

  // คำนวณค่าพรบ.สำหรับรถจักรยานยนต์
  const basePrbMotorcycle = car.isMotorcycle
    ? car.cc > 150
      ? 695
      : car.cc > 125
      ? 480
      : car.cc >= 77
      ? 350
      : 211
    : 0;
  console.log("basePrbMotorcycle (สำหรับรถจักรยานยนต์):", basePrbMotorcycle);

  // เลือกค่าพรบ.ที่เหมาะสม
  const finalPrb = car.isMotorcycle ? basePrbMotorcycle : basePrbCar;
  console.log("finalPrb (ค่าพรบ.สุทธิ):", finalPrb);

  // คำนวณภาษีสำหรับรถจักรยานยนต์
  const taxMotorcycle = car.isMotorcycle
    ? car.isElectric
      ? 50 + (car.isMotorcycleTrailer ? 50 : 0)
      : 100 + (car.isMotorcycleTrailer ? 50 : 0)
    : 0;
  console.log("taxMotorcycle:", taxMotorcycle);

  // ฟังก์ชันคำนวณภาษีตามน้ำหนักสำหรับรถยนต์
  const calculateTaxByWeight = (
    weight: number,
    type:
      | "personalTruck"
      | "personalMoreThanSevenSeats"
      | "electricVehicles"
      | "electricMoreThanSevenSeats"
  ): number => {
    const taxTable = taxByWeight[type];
    if (!taxTable) {
      console.log(`ไม่พบข้อมูลภาษีสำหรับประเภท ${type}`);
      return 0;
    }

    for (const range of taxTable) {
      const [min, max, tax] = range;
      if (weight >= min && weight <= max) {
        console.log(
          `Tax for weight ${weight} (range ${min}-${max}) in ${type}: ${tax}`
        );
        return tax;
      }
    }
    console.log(`ไม่พบช่วงน้ำหนักที่ตรงกับ weight ${weight} สำหรับ ${type}`);
    return 0;
  };

  // คำนวณภาษีตาม CC สำหรับรถยนต์
  const taxCarCC = car.isCar
    ? car.hasMoreThanSevenSeats
      ? car.isElectric
        ? calculateTaxByWeight(car.weight, "electricMoreThanSevenSeats")
        : calculateTaxByWeight(car.weight, "personalMoreThanSevenSeats")
      : car.isElectric
      ? calculateTaxByWeight(car.weight, "electricVehicles")
      : car.cc <= 600
      ? car.cc * 0.5
      : car.cc <= 1800
      ? (car.cc - 600) * 1.5 + 300
      : (car.cc - 1800) * 4 + 2100
    : 0;
  console.log("taxCarCC:", taxCarCC);

  // คำนวณภาษีตามชนิดรถ
  let baseTax = car.isMotorcycle
    ? taxMotorcycle
    : car.isPickupTruck
    ? calculateTaxByWeight(car.weight, "personalTruck")
    : car.hasMoreThanSevenSeats
    ? calculateTaxByWeight(car.weight, "personalMoreThanSevenSeats")
    : car.isCar
    ? taxCarCC
    : car.isCarTrailer
    ? 100
    : car.isTractorFarmer
    ? 50
    : car.isTractor
    ? 100
    : 0;
  console.log("baseTax (ภาษีตามชนิดรถ):", baseTax);

  let finalTax = baseTax;
  console.log("เริ่มต้น finalTax =", finalTax);

  // ส่วนลดจะเพิ่ม 10% ต่อปีตั้งแต่อายุ 6 ปีขึ้นไป และจำกัดส่วนลดที่ 50%
  const discount =
    car.isCar || car.hasMoreThanSevenSeats || car.isPickupTruck
      ? carAge.years >= 10
        ? 0.5
        : carAge.years >= 6
        ? (carAge.years - 5) * 0.1
        : 0
      : 0;
  console.log("discount rate:", discount);

  let taxAfterDiscount = baseTax * (1 - discount);
  finalTax = taxAfterDiscount;
  console.log("taxAfterDiscount (ภาษีหลังส่วนลด):", taxAfterDiscount);

  // ตรวจสอบสิทธิ์ส่วนลดรถยนต์ไฟฟ้า (EV)
  if (car.isElectric && isEligibleForElectricTaxDiscount(car.registerDate)) {
    taxAfterDiscount = baseTax * 0.2;
    finalTax = taxAfterDiscount;
    console.log("รถ EV ได้ส่วนลด 80%, taxAfterDiscount:", taxAfterDiscount);
  }

  // ตรวจสอบกรณีรถจักรยานยนต์ที่อายุเกิน 3 ปี
  if (isMoreThanThreeYears(dayjs(car.expiryDate)) && car.isMotorcycle) {
    console.log("รถจักรยานยนต์ที่อายุเกิน 3 ปี => กำหนด finalTax เป็น 372");
    finalTax = 372;
  }
  console.log("finalTax หลังปรับปรุง:", finalTax);

  // ฟังก์ชันคำนวณอายุรถเพื่อใช้ตรวจสภาพ (ตรอ.)
  const calculateCarAgeForInspection = (
    registerDate: Dayjs | null,
    expiryDate: Dayjs | null
  ): { years: number; months: number; days: number } => {
    if (!registerDate || !expiryDate) return { years: 0, months: 0, days: 0 };

    const endOfTaxPeriod = dayjs(expiryDate);
    const years = endOfTaxPeriod.diff(registerDate, "year");
    const months = endOfTaxPeriod.diff(
      registerDate.add(years, "year"),
      "month"
    );
    const days = endOfTaxPeriod.diff(
      registerDate.add(years, "year").add(months, "month"),
      "day"
    );

    console.log("CalculateCarAgeForInspection:", {
      registerDate: registerDate.format("YYYY-MM-DD"),
      expiryDate: expiryDate.format("YYYY-MM-DD"),
      years,
      months,
      days,
    });
    return { years, months, days };
  };

  // ฟังก์ชันคำนวณค่าปรับสำหรับการล่าช้า
  const calculateLateFee = (
    car: CarDetails,
    taxAfterDiscount: number
  ): {
    lateFee: number;
    registrationFee: number;
    requiresInspection: boolean;
    isRegistrationCancelled: boolean;
    taxAnotherYear: number;
  } => {
    const { isOverdue, isNotOverdue, overdueMonths, overdueDays } =
      isTaxOverdue(car.expiryDate);
    console.log(
      "ค่าปรับ - isOverdue:",
      isOverdue,
      "overdueMonths:",
      overdueMonths,
      "overdueDays:",
      overdueDays
    );

    if (car.isCarTrailer || car.isTractor || car.isTractorFarmer) {
      console.log(
        "รถประเภท Trailer, Tractor, หรือ TractorFarmer ไม่คิดค่าปรับหรือจดทะเบียนใหม่"
      );
      return {
        lateFee: 0,
        registrationFee: 0,
        requiresInspection: false,
        isRegistrationCancelled: false,
        taxAnotherYear: 0,
      };
    }

    let lateFee = 0;
    let registrationFee = 0;
    let requiresInspection = false;
    let isRegistrationCancelled = false;
    let taxAnotherYear = 0;

    if (isNotOverdue) {
      taxAnotherYear = finalTax;
      console.log(
        "มาชำระภาษีก่อนวันสิ้นอายุ 90 วัน => taxAnotherYear = ",
        taxAnotherYear
      );
    }

    if (isOverdue) {
      // คำนวณค่าปรับ 1% ต่อเดือน (สูงสุด 100% ของค่าภาษี)
      lateFee = Math.min(
        taxAfterDiscount * (overdueMonths * 0.01),
        taxAfterDiscount
      );
      console.log("ค่าปรับล่าช้าคำนวณเบื้องต้น:", lateFee);

      // ตรวจสภาพที่ ตรอ. ถ้าขาดภาษีเกิน 1 ปี (สำหรับรถยนต์และรถจักรยานยนต์)
      if (overdueMonths >= 12) {
        requiresInspection = true;
        console.log("รถขาดภาษีเกิน 1 ปี => ต้องตรวจสภาพ");
      }

      // ถ้าขาดภาษีเกิน 3 ปี ทะเบียนถูกระงับ ต้องขอจดใหม่
      if (overdueMonths > 36) {
        lateFee += 300;
        console.log("รถขาดภาษีเกิน 3 ปี => เพิ่มค่าปรับ 300 เข้าไป");
        const registrationFeeRates = car.isMotorcycle
          ? { chiangRai: 1500, other: 2500 }
          : { chiangRai: 2500, other: 3500 };

        registrationFee = car.isInChiangRai
          ? registrationFeeRates.chiangRai
          : registrationFeeRates.other;

        console.log("อัตราค่าจดทะเบียนใหม่:", {
          registrationFeeRates,
          isInChiangRai: car.isInChiangRai,
          registrationFee,
        });
        requiresInspection = true;
        isRegistrationCancelled = true;
      }
    }

    console.log("Late Fee Result:", {
      lateFee,
      registrationFee,
      requiresInspection,
      isRegistrationCancelled,
    });
    return {
      lateFee,
      registrationFee,
      requiresInspection,
      isRegistrationCancelled,
      taxAnotherYear,
    };
  };

  // ฟังก์ชันคำนวณค่าตรวจสภาพ
  const calculateInspectionFee = (
    car: CarDetails,
    requiresInspection: boolean
  ): { inspectionFee: number } => {
    const carAgeForInspection = calculateCarAgeForInspection(
      car.registerDate,
      car.expiryDate
    );

    let meetsAgeCriteria =
      (car.isCar && carAgeForInspection.years >= 7) ||
      (car.hasMoreThanSevenSeats && carAgeForInspection.years >= 7) ||
      (car.isPickupTruck && carAgeForInspection.years >= 7) ||
      (car.isMotorcycle && carAgeForInspection.years >= 5) ||
      ((car.isCar ||
        car.hasMoreThanSevenSeats ||
        car.isPickupTruck ||
        car.isMotorcycle) &&
        carAgeForInspection.months >= 12);

    console.log("ตรวจสอบเงื่อนไขการตรวจสภาพ:", {
      carAgeForInspection,
      meetsAgeCriteria,
      requiresInspection,
    });
    if (
      (!meetsAgeCriteria && !requiresInspection) ||
      car.isCarTrailer ||
      car.isTractor ||
      car.isTractorFarmer
    ) {
      console.log("ไม่ต้องตรวจสภาพ => inspectionFee = 0");
      return { inspectionFee: 0 };
    }

    let inspectionFee = 0;
    if (car.expiryDate && dayjs(car.expiryDate).isBefore(dayjs(), "day")) {
      inspectionFee = car.isMotorcycle ? 100 : car.isGas ? 900 : 400;
      console.log("กำหนด inspectionFee ตามวันที่หมดอายุ:", inspectionFee);
    }

    if (car.missedTaxPayment !== null) {
      if (["1 ครั้ง", "3 ครั้ง", "5 ครั้ง"].includes(car.missedTaxPayment)) {
        inspectionFee = 0;
        console.log(
          "รถมี missedTaxPayment =",
          car.missedTaxPayment,
          "=> inspectionFee = 0"
        );
      } else if (
        ["ไม่เคย", "2 ครั้ง", "4 ครั้ง"].includes(car.missedTaxPayment)
      ) {
        if (car.isMotorcycle) {
          inspectionFee = 100;
        } else if (car.isGas) {
          inspectionFee = 900;
        } else {
          inspectionFee = 400;
        }
        console.log(
          "รถมี missedTaxPayment =",
          car.missedTaxPayment,
          "=> inspectionFee =",
          inspectionFee
        );
      }
    }
    console.log("inspectionFee สุดท้าย:", inspectionFee);
    return { inspectionFee };
  };

  const { lateFee, registrationFee, requiresInspection, taxAnotherYear } =
    calculateLateFee(car, taxAfterDiscount);
  console.log("ค่าปรับและค่าจดทะเบียน:", {
    lateFee,
    registrationFee,
    requiresInspection,
    taxAnotherYear,
  });

  const { inspectionFee } = calculateInspectionFee(car, requiresInspection);
  console.log("inspectionFee:", inspectionFee);

  const processingFee = car.isMotorcycle ? 300 : 400; // ค่าบริการ
  console.log("processingFee:", processingFee);

  const finalTotal =
    finalPrb +
    roundUp(finalTax) +
    roundUp(taxAnotherYear) +
    roundUp(lateFee) +
    inspectionFee +
    processingFee;
  console.log("ผลรวมทั้งหมด (finalTotal):", finalTotal);

  console.log("===== สรุปผลการคำนวณภาษี =====");
  console.log({
    finalTotal: Math.max(finalTotal, 0),
    finalPrb,
    finalTax: roundUp(finalTax),
    lateFee: roundUp(lateFee),
    taxAnotherYear: roundUp(taxAnotherYear),
    inspectionFee,
    processingFee,
    registrationFee,
  });

  return {
    finalTotal: Math.max(finalTotal, 0),
    finalPrb,
    finalTax,
    lateFee,
    inspectionFee,
    processingFee,
    registrationFee,
    taxAnotherYear,
  };
};
