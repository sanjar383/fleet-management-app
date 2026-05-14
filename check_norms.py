import gspread
import pandas as pd
from google.oauth2.service_account import Credentials

SCOPES = ['https://www.googleapis.com/auth/spreadsheets.readonly']
CREDENTIALS_FILE = r"C:\Users\SANJAR\.gemini\antigravity\scratch\google_sheets_project\credentials.json"
SPREADSHEET_ID = "1SUCM48SanOW2yQ8VA9eot1eFFNnbhPR4a_eXSMUh-34"

credentials = Credentials.from_service_account_file(CREDENTIALS_FILE, scopes=SCOPES)
client = gspread.authorize(credentials)
sheet = client.open_by_key(SPREADSHEET_ID)

worksheet = sheet.worksheet("Справочник норма")
df = pd.DataFrame(worksheet.get_all_records())
print("Columns in Справочник норма:")
print(df.columns.tolist())
print(df.head(2).to_json(force_ascii=False, indent=2))
