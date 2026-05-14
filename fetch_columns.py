import gspread
import pandas as pd
from google.oauth2.service_account import Credentials

SCOPES = ['https://www.googleapis.com/auth/spreadsheets.readonly']
CREDENTIALS_FILE = r"C:\Users\SANJAR\.gemini\antigravity\scratch\google_sheets_project\credentials.json"
SPREADSHEET_ID = "1SUCM48SanOW2yQ8VA9eot1eFFNnbhPR4a_eXSMUh-34"

credentials = Credentials.from_service_account_file(CREDENTIALS_FILE, scopes=SCOPES)
client = gspread.authorize(credentials)
sheet = client.open_by_key(SPREADSHEET_ID)

for sheet_name in ["База авто", "Справочник мгкэ"]:
    try:
        worksheet = sheet.worksheet(sheet_name)
        data = worksheet.get_all_records()
        df = pd.DataFrame(data)
        print(f"\n--- Columns in '{sheet_name}' ---")
        print(df.columns.tolist())
        print("Sample data:")
        print(df.head(2).to_json(force_ascii=False, indent=2))
    except Exception as e:
        print(f"Error reading {sheet_name}: {e}")
