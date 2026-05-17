const { google } = require("googleapis");
const fs = require("fs");

const SPREADSHEET_ID = "1SUCM48SanOW2yQ8VA9eot1eFFNnbhPR4a_eXSMUh-34";
const CREDENTIALS_PATH = "C:\\Users\\SANJAR\\.gemini\\antigravity\\scratch\\google_sheets_project\\credentials.json";

async function checkIshJadvali() {
  try {
    const auth = new google.auth.GoogleAuth({
      keyFile: CREDENTIALS_PATH,
      scopes: ["https://www.googleapis.com/auth/spreadsheets.readonly"],
    });

    const sheets = google.sheets({ version: "v4", auth });
    
    // "Иш жадвали" listini tekshirish
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: `'Иш жадвали'!A1:Z5`, // Ko'proq ustunlarni ko'rish uchun
    });

    const rows = response.data.values;
    if (rows && rows.length > 0) {
      console.log("ISH JADVALI SARLAVHALARI:");
      console.log(JSON.stringify(rows[0], null, 2));
      console.log("\nMA'LUMOTLAR SONI (taxminan):", rows.length);
      console.log("\nBIRINCHI MA'LUMOT QATORI:");
      console.log(JSON.stringify(rows[1] || [], null, 2));
    } else {
      console.log("Ish жадвали topilmadi yoki bo'sh.");
    }

  } catch (error) {
    console.error("XATOLIK:", error.message);
  }
}

checkIshJadvali();
