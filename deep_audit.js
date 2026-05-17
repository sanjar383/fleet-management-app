const { google } = require("googleapis");
const fs = require("fs");

const SPREADSHEET_ID = "1SUCM48SanOW2yQ8VA9eot1eFFNnbhPR4a_eXSMUh-34";
const CREDENTIALS_PATH = "C:\\Users\\SANJAR\\.gemini\\antigravity\\scratch\\google_sheets_project\\credentials.json";

async function deepAudit() {
  try {
    const auth = new google.auth.GoogleAuth({
      keyFile: CREDENTIALS_PATH,
      scopes: ["https://www.googleapis.com/auth/spreadsheets.readonly"],
    });

    const sheets = google.sheets({ version: "v4", auth });
    
    // "Иш жадвали"ni AZ gacha tekshirish (ko'proq ustunlar)
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: `'Иш жадвали'!A1:AZ2`,
    });

    const rows = response.data.values;
    if (rows && rows.length > 0) {
      console.log("BARCHA USTUNLAR (A-AZ):");
      rows[0].forEach((header, index) => {
        console.log(`${index + 1}: ${header}`);
      });
    }

  } catch (error) {
    console.error("XATOLIK:", error.message);
  }
}

deepAudit();
