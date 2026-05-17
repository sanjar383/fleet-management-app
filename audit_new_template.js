const { google } = require("googleapis");
const fs = require("fs");

const NEW_SPREADSHEET_ID = "17kfs_eueVdGvWB6whakRx0X70Dv7xZ8eRbTMO55EdIg";
const CREDENTIALS_PATH = "C:\\Users\\SANJAR\\.gemini\\antigravity\\scratch\\google_sheets_project\\credentials.json";

async function auditNewTemplate() {
  try {
    const auth = new google.auth.GoogleAuth({
      keyFile: CREDENTIALS_PATH,
      scopes: ["https://www.googleapis.com/auth/spreadsheets.readonly"],
    });

    const sheets = google.sheets({ version: "v4", auth });
    
    // 1. Listlarni ko'rish
    const spreadsheet = await sheets.spreadsheets.get({
      spreadsheetId: NEW_SPREADSHEET_ID,
    });
    
    console.log("YANGI FAYL LISTLARI:", spreadsheet.data.sheets.map(s => s.properties.title).join(", "));
    
    // 2. Birinchi listning sarlavhalari va formulalarini ko'rish
    const firstSheetName = spreadsheet.data.sheets[0].properties.title;
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: NEW_SPREADSHEET_ID,
      range: `'${firstSheetName}'!A1:AZ3`,
      valueRenderOption: "FORMULA",
    });

    const rows = response.data.values;
    if (rows && rows.length > 0) {
      console.log(`\n'${firstSheetName}' LISTI SARLAVHALARI:`);
      console.log(JSON.stringify(rows[0], null, 2));
      
      console.log("\nFORMULALAR (Agar bo'lsa):");
      rows.forEach((row, i) => {
        row.forEach((cell, j) => {
          if (typeof cell === 'string' && cell.startsWith('=')) {
            console.log(`[R${i+1}C${j+1}]: ${cell}`);
          }
        });
      });
    }

  } catch (error) {
    console.error("XATOLIK:", error.message);
  }
}

auditNewTemplate();
