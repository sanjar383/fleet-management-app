const { google } = require("googleapis");
const fs = require("fs");

const SPREADSHEET_ID = "1SUCM48SanOW2yQ8VA9eot1eFFNnbhPR4a_eXSMUh-34";
const CREDENTIALS_PATH = "C:\\Users\\SANJAR\\.gemini\\antigravity\\scratch\\google_sheets_project\\credentials.json";

async function readFormulas() {
  try {
    const auth = new google.auth.GoogleAuth({
      keyFile: CREDENTIALS_PATH,
      scopes: ["https://www.googleapis.com/auth/spreadsheets.readonly"],
    });

    const sheets = google.sheets({ version: "v4", auth });
    
    // Formulalarni o'qish uchun valueRenderOption: "FORMULA" ishlatamiz
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: `'Иш жадвали'!A3:AZ5`, // Bir nechta ma'lumot bor qatorlar
      valueRenderOption: "FORMULA",
    });

    const rows = response.data.values;
    if (rows && rows.length > 0) {
      console.log("SHEETS FORMULALARI (Namuna):");
      rows.forEach((row, i) => {
        console.log(`\n--- Qator ${i + 3} ---`);
        row.forEach((cell, j) => {
          if (typeof cell === 'string' && cell.startsWith('=')) {
            console.log(`Ustun ${j + 1}: ${cell}`);
          }
        });
      });
    } else {
      console.log("Formulalar topilmadi.");
    }

  } catch (error) {
    console.error("XATOLIK:", error.message);
  }
}

readFormulas();
