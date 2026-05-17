const { google } = require("googleapis");
const fs = require("fs");

const SPREADSHEET_ID = "1SUCM48SanOW2yQ8VA9eot1eFFNnbhPR4a_eXSMUh-34";
const CREDENTIALS_PATH = "C:\\Users\\SANJAR\\.gemini\\antigravity\\scratch\\google_sheets_project\\credentials.json";

async function checkConditionalFormats() {
  try {
    const auth = new google.auth.GoogleAuth({
      keyFile: CREDENTIALS_PATH,
      scopes: ["https://www.googleapis.com/auth/spreadsheets.readonly"],
    });

    const sheets = google.sheets({ version: "v4", auth });
    
    // "Иш жадвали" listining formatlarini olish
    const response = await sheets.spreadsheets.get({
      spreadsheetId: SPREADSHEET_ID,
      includeGridData: false, // Faqat metadata
    });

    const sheet = response.data.sheets.find(s => s.properties.title === "Иш жадвали");
    
    if (sheet && sheet.conditionalFormats) {
      console.log(`\n'Иш жадвали'DA ${sheet.conditionalFormats.length} TA SHARTLI FORMAT TOPILDI:`);
      sheet.conditionalFormats.forEach((cf, i) => {
        console.log(`\n--- Format ${i + 1} ---`);
        console.log("Diapazon:", JSON.stringify(cf.ranges));
        if (cf.booleanRule) {
          console.log("Shart:", cf.booleanRule.condition.type);
          if (cf.booleanRule.condition.values) {
            console.log("Qiymatlar:", JSON.stringify(cf.booleanRule.condition.values));
          }
          console.log("Stil (Rang):", JSON.stringify(cf.booleanRule.format));
        }
      });
    } else {
      console.log("Shartli formatlar topilmadi.");
    }

  } catch (error) {
    console.error("XATOLIK:", error.message);
  }
}

checkConditionalFormats();
