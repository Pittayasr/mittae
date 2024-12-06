//calculateDelivery.ts
type ZoneMapping = {
  [key: number]: string[]; // แผนที่โซนกับชื่อจังหวัด
};

const zones: ZoneMapping = {
  1: ["กรุงเทพมหานคร", "นนทบุรี", "ปทุมธานี", "สมุทรปราการ"],
  2: [
    "สระแก้ว",
    "ปราจีนบุรี",
    "ฉะเชิงเทรา",
    "ชลบุรี",
    "ระยอง",
    "จันทบุรี",
    "ตราด",
  ],
  3: [
    "นครปฐม",
    "กาญจนบุรี",
    "ราชบุรี",
    "สมุทรสาคร",
    "สมุทรสงคราม",
    "เพชรบุรี",
    "ประจวบคีรีขันธ์",
  ],
  4: [
    "อุทัยธานี",
    "สิงห์บุรี",
    "ชัยนาท",
    "ลพบุรี",
    "สระบุรี",
    "อ่างทอง",
    "พระนครศรีอยุธยา",
    "สุพรรณบุรี",
    "นครนายก",
  ],
  5: [
    "อุตรดิตถ์",
    "สุโขทัย",
    "ตาก",
    "พิษณุโลก",
    "กำแพงเพชร",
    "พิจิตร",
    "เพชรบูรณ์",
    "นครสวรรค์",
  ],
  6: [
    "แม่ฮ่องสอน",
    "เชียงราย",
    "พะเยา",
    "เชียงใหม่",
    "ลำพูน",
    "น่าน",
    "ลำปาง",
    "แพร่",
  ],
  7: [
    "กาฬสินธุ์",
    "มุกดาหาร",
    "ร้อยเอ็ด",
    "มหาสารคาม",
    "ชัยภูมิ",
    "อำนาจเจริญ",
    "ยโสธร",
    "ศรีสะเกษ",
    "อุบลราชธานี",
    "บุรีรัมย์",
    "สุรินทร์",
    "นครราชสีมา",
  ],
  8: [
    "หนองคาย",
    "บึงกาฬ",
    "เลย",
    "อุดรธานี",
    "นครพนม",
    "สกลนคร",
    "หนองบัวลำภู",
    "ขอนแก่น",
  ],
  9: ["ชุมพร", "ระนอง", "สุราษฎร์ธานี", "พังงา", "นครศรีธรรมราช"],
  10: [
    "กระบี่",
    "ภูเก็ต",
    "ตรัง",
    "พัทลุง",
    "สงขลา",
    "ปัตตานี",
    "สตูล",
    "ยะลา",
    "นราธิวาส",
  ],
};

type PriceTable = {
  [key: number]: { max150: number; from150to400: number; over400: number };
};

const priceTable: PriceTable = {
  1: { max150: 1680, from150to400: 2100, over400: 4020 },
  2: { max150: 2400, from150to400: 3000, over400: 5100 },
  3: { max150: 1680, from150to400: 2100, over400: 4020 },
  4: { max150: 1680, from150to400: 2100, over400: 4020 },
  5: { max150: 1200, from150to400: 1500, over400: 3300 },
  6: { max150: 1200, from150to400: 1500, over400: 3300 },
  7: { max150: 2880, from150to400: 3600, over400: 5820 },
  8: { max150: 3120, from150to400: 3900, over400: 6180 },
  9: { max150: 3120, from150to400: 3900, over400: 6180 },
  10: { max150: 3120, from150to400: 3900, over400: 6180 },
};

function getZoneByProvince(province: string): number | null {
  for (const [zone, provinces] of Object.entries(zones)) {
    if (provinces.includes(province)) {
      return parseInt(zone, 10);
    }
  }
  return null; // ไม่พบโซน
}

function calculateDelivery(province: string, engineCC: number): number | null {
  const zone = getZoneByProvince(province);

  if (!zone) {
    console.error(`ไม่พบโซนสำหรับจังหวัด ${province}`);
    return null;
  }

  const prices = priceTable[zone];
  if (!prices) {
    console.error(`ไม่มีราคาสำหรับโซน ${zone}`);
    return null;
  }

  if (engineCC <= 150) {
    return prices.max150;
  } else if (engineCC <= 400) {
    return prices.from150to400;
  } else {
    return prices.over400;
  }
}

export { calculateDelivery, getZoneByProvince };
