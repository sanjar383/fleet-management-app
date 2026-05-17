import { google } from "googleapis";
import path from "path";

const SPREADSHEET_ID = "1SUCM48SanOW2yQ8VA9eot1eFFNnbhPR4a_eXSMUh-34";
const CREDENTIALS_PATH = path.join(process.cwd(), "google_sheets_project", "credentials.json");

export async function appendTripToIshJadvali(trip: any, vehicle: any) {
  try {
    const auth = new google.auth.GoogleAuth({
      keyFile: CREDENTIALS_PATH,
      scopes: ["https://www.googleapis.com/auth/spreadsheets"],
    });

    const sheets = google.sheets({ version: "v4", auth });
    
    // 52 ta ustunli bo'sh qator tayyorlaymiz
    const row = new Array(52).fill("");

    // 1-ustun (A): Oy (Formula bor, bo'sh qoldiramiz)
    row[1] = trip.departureDate ? trip.departureDate.toISOString().split('T')[0] : ""; // B (2): Sana
    row[2] = trip.returnDate ? trip.returnDate.toISOString().split('T')[0] : "";    // C (3): Kirish sanasi
    row[3] = trip.workDays || 1;    // D (4): Ish kuni
    row[4] = trip.workHours || 8;   // E (5): Ish soati
    // F (6): Tashkilot nomi (Formula bor)
    row[6] = trip.organization || "-"; // G (7): Tashkilot
    row[7] = trip.division || "-";     // H (8): Bo'linma
    row[8] = trip.origin || "-";       // I (9): Manzil
    row[9] = "Буюртма";               // J (10): Buyurtma turi
    row[10] = trip.driver;             // K (11): Haydovchi
    row[11] = trip.waybillNumber || "-"; // L (12): Yo'l varaqasi №
    row[12] = trip.vehicleType || "-";   // M (13): Mashina turi
    row[13] = vehicle.brand || "-";     // N (14): Markasi
    row[14] = vehicle.plate;            // O (15): Davlat raqami
    // P (16): Yili (Formula bor)
    row[16] = trip.gpsStatus || "-";    // Q (17): GPS
    row[17] = trip.regionNorm || "-";   // R (18): Hudud (Normativ)
    row[18] = "-";                      // S (19): Hudud (Fakt)
    
    // T (20): Konditsioner - MUHIM FORMAT!
    row[19] = trip.acStatus === "Ishlatildi" ? "с кондиционером" : "без кондиционера";

    // U-Z (21-26): Koeffitsientlar
    row[20] = trip.m500_1500 > 0 ? 1.05 : ""; // Misol: koeffitsient qiymati
    row[21] = trip.m1501_2000 > 0 ? 1.10 : "";
    row[22] = trip.m2001_3000 > 0 ? 1.15 : "";
    row[23] = trip.m3001_plus > 0 ? 1.20 : "";
    row[24] = trip.sandGravel > 0 ? 1.10 : "";
    row[25] = trip.seasonCoeff !== 1 ? trip.seasonCoeff : "";

    // Hisob-kitoblar (27-34): FORMULALAR bor, bo'sh qoldiramiz

    row[34] = trip.startKm; // AI (35): Spidometr boshida
    // AJ-AP: Bo'sh
    row[42] = trip.fuelFilled; // AQ (43): Quyilgan yoqilg'i
    
    // Oxirgi ustunlar (AR-AZ): Asosan formulalar

    const response = await sheets.spreadsheets.values.append({
      spreadsheetId: SPREADSHEET_ID,
      range: "'Иш жадвали'!A:AZ",
      valueInputOption: "USER_ENTERED",
      insertDataOption: "INSERT_ROWS",
      requestBody: { values: [row] },
    });

    const updatedRange = response.data.updates?.updatedRange;
    const match = updatedRange?.match(/A(\d+)/);
    return match ? parseInt(match[1]) : null;

  } catch (error) {
    console.error("Sheets sync error:", error);
    return null;
  }
}

export async function updateTripInIshJadvali(rowNumber: number, trip: any, vehicle: any) {
  try {
    const auth = new google.auth.GoogleAuth({
      keyFile: CREDENTIALS_PATH,
      scopes: ["https://www.googleapis.com/auth/spreadsheets"],
    });

    const sheets = google.sheets({ version: "v4", auth });
    
    const row = new Array(52).fill(null); // null qilsak Sheets'dagi formulalar o'chib ketmaydi

    row[1] = trip.departureDate ? trip.departureDate.toISOString().split('T')[0] : null;
    row[2] = trip.returnDate ? trip.returnDate.toISOString().split('T')[0] : null;
    row[3] = trip.workDays || 1;
    row[4] = trip.workHours || 8;
    row[6] = trip.organization || "-";
    row[7] = trip.division || "-";
    row[8] = trip.origin || "-";
    row[10] = trip.driver;
    row[11] = trip.waybillNumber || "-";
    row[12] = trip.vehicleType || "-";
    row[13] = vehicle.brand || "-";
    row[14] = vehicle.plate;
    row[16] = trip.gpsStatus || "-";
    row[17] = trip.regionNorm || "-";
    row[19] = trip.acStatus === "Ishlatildi" ? "с кондиционером" : "без кондиционера";
    row[34] = trip.startKm;
    row[42] = trip.fuelFilled;

    await sheets.spreadsheets.values.update({
      spreadsheetId: SPREADSHEET_ID,
      range: `'Иш жадвали'!A${rowNumber}:AZ${rowNumber}`,
      valueInputOption: "USER_ENTERED",
      requestBody: { values: [row] },
    });

  } catch (error) {
    console.error("Sheets update error:", error);
  }
}

export async function deleteTripFromIshJadvali(rowNumber: number) {
  try {
    const auth = new google.auth.GoogleAuth({
      keyFile: CREDENTIALS_PATH,
      scopes: ["https://www.googleapis.com/auth/spreadsheets"],
    });

    const sheets = google.sheets({ version: "v4", auth });
    const spreadsheet = await sheets.spreadsheets.get({ spreadsheetId: SPREADSHEET_ID });
    const sheetId = spreadsheet.data.sheets?.find(s => s.properties?.title === "Иш жадвали")?.properties?.sheetId;

    if (!sheetId) throw new Error("Sheet ID topilmadi");

    await sheets.spreadsheets.batchUpdate({
      spreadsheetId: SPREADSHEET_ID,
      requestBody: {
        requests: [{
          deleteDimension: {
            range: { sheetId, dimension: "ROWS", startIndex: rowNumber - 1, endIndex: rowNumber }
          }
        }]
      }
    });
  } catch (error) {
    console.error("Sheets delete error:", error);
  }
}
