const { google } = require("googleapis");
const fs = require("fs");

const SPREADSHEET_ID = "1SUCM48SanOW2yQ8VA9eot1eFFNnbhPR4a_eXSMUh-34";
const CREDENTIALS_PATH = "C:\\Users\\SANJAR\\.gemini\\antigravity\\scratch\\google_sheets_project\\credentials.json";

async function getTestData() {
  try {
    const auth = new google.auth.GoogleAuth({
      keyFile: CREDENTIALS_PATH,
      scopes: ["https://www.googleapis.com/auth/spreadsheets.readonly"],
    });

    const sheets = google.sheets({ version: "v4", auth });
    
    // Oxirgi qatorlarni topish uchun avval barcha ma'lumotlarni o'qiymiz
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: `'Иш жадвали'!A1:AZ`,
    });

    const rows = response.data.values;
    if (rows && rows.length > 5) {
      const last5 = rows.slice(-5);
      console.log("OXIRGI 5 TA QATOR MA'LUMOTI:");
      console.log(JSON.stringify(last5, null, 2));
    } else {
      console.log("Yetarli ma'lumot topilmadi.");
    }

  } catch (error) {
    console.error("XATOLIK:", error.message);
  }
}

getTestData();
