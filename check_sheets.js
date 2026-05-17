const { google } = require("googleapis");
const fs = require("fs");

const SPREADSHEET_ID = "1SUCM48SanOW2yQ8VA9eot1eFFNnbhPR4a_eXSMUh-34";
const CREDENTIALS_PATH = "C:\\Users\\SANJAR\\.gemini\\antigravity\\scratch\\google_sheets_project\\credentials.json";

async function checkSheetsStructure() {
  try {
    const auth = new google.auth.GoogleAuth({
      keyFile: CREDENTIALS_PATH,
      scopes: ["https://www.googleapis.com/auth/spreadsheets.readonly"],
    });

    const sheets = google.sheets({ version: "v4", auth });
    
    // Listlarni olish
    const spreadsheet = await sheets.spreadsheets.get({
      spreadsheetId: SPREADSHEET_ID,
    });
    
    console.log("Listlar:", spreadsheet.data.sheets.map(s => s.properties.title).join(", "));
    
    const sheetName = "Qatnovlar_Hisoboti";
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: `${sheetName}!A1:Q2`, // Sarlavha va birinchi qator
    });

    const rows = response.data.values;
    if (rows && rows.length > 0) {
      console.log("SHEETS SARLAVHALARI:");
      console.log(JSON.stringify(rows[0], null, 2));
      console.log("\nMA'LUMOTLAR SONI:", rows.length - 1);
      if (rows[1]) {
        console.log("\nBIRINCHI QATOR NAMUNASI:");
        console.log(JSON.stringify(rows[1], null, 2));
      }
    } else {
      console.log("Sheet topildi, lekin u yerda ma'lumot yo'q.");
    }

  } catch (error) {
    console.error("XATOLIK:", error.message);
  }
}

checkSheetsStructure();
