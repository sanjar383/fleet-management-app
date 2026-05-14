import { google } from "googleapis";
import fs from "fs";
import path from "path";

const SPREADSHEET_ID = "1SUCM48SanOW2yQ8VA9eot1eFFNnbhPR4a_eXSMUh-34";
const CREDENTIALS_PATH = "C:\\Users\\SANJAR\\.gemini\\antigravity\\scratch\\google_sheets_project\\credentials.json";

export async function appendTripToSheet(tripData: any) {
  try {
    const auth = new google.auth.GoogleAuth({
      keyFile: CREDENTIALS_PATH,
      scopes: ["https://www.googleapis.com/auth/spreadsheets"],
    });

    const sheets = google.sheets({ version: "v4", auth });
    
    // Yoziladigan list nomi
    const sheetName = "Qatnovlar_Hisoboti";

    // 1. Avval bu list bormi tekshiramiz
    const spreadsheet = await sheets.spreadsheets.get({
      spreadsheetId: SPREADSHEET_ID,
    });
    
    const sheetExists = spreadsheet.data.sheets?.some(
      (s) => s.properties?.title === sheetName
    );

    // 2. Agar yo'q bo'lws, yangi list yaratamiz va sarlavhalarni qo'shamiz
    if (!sheetExists) {
      await sheets.spreadsheets.batchUpdate({
        spreadsheetId: SPREADSHEET_ID,
        requestBody: {
          requests: [
            {
              addSheet: {
                properties: {
                  title: sheetName,
                },
              },
            },
          ],
        },
      });

      // Sarlavhalarni yozamiz
      await sheets.spreadsheets.values.append({
        spreadsheetId: SPREADSHEET_ID,
        range: `${sheetName}!A1:Q1`,
        valueInputOption: "USER_ENTERED",
        requestBody: {
          values: [
            [
              "ID",
              "Chiqish Sanasi",
              "Kirish Sanasi",
              "Ish kuni",
              "Ish soati",
              "Tashkilot (Ekspeditsiya)",
              "Tarkibiy bo'linma",
              "Haydovchi",
              "Transport vositasi turi",
              "Markasi",
              "Davlat raqami yoki inventar raqami",
              "Yo'nalish",
              "Spidometr Boshida",
              "Spidometr Oxirida",
              "Masofa (km)",
              "Yoqilg'i Turi",
              "Sarflangan Yoqilg'i (Litr / Kub)"
            ],
          ],
        },
      });
    }

    // 3. Yangi qatnovni qo'shamiz
    const formattedDepDate = tripData.date ? new Date(tripData.date).toLocaleDateString("ru-RU") : "-";
    const formattedRetDate = tripData.returnDate ? new Date(tripData.returnDate).toLocaleDateString("ru-RU") : "-";

    await sheets.spreadsheets.values.append({
      spreadsheetId: SPREADSHEET_ID,
      range: `${sheetName}!A:Q`,
      valueInputOption: "USER_ENTERED",
      requestBody: {
        values: [
          [
            tripData.id,
            formattedDepDate,
            formattedRetDate,
            tripData.workDays || 0,
            tripData.workHours || 0,
            tripData.organization || "-",
            tripData.division || "-",
            tripData.driver,
            tripData.vehicleType || "-",
            tripData.vehicleBrand,
            tripData.vehiclePlate,
            tripData.route,
            tripData.startKm,
            tripData.endKm,
            tripData.distance,
            tripData.fuelType,
            tripData.fuelUsed.toFixed(2).replace(".", ",")
          ],
        ],
      },
    });

    console.log("Trip successfully synced to Google Sheets!");
  } catch (error) {
    console.error("Error syncing to Google Sheets:", error);
  }
}
