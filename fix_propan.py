import gspread
import pandas as pd
from google.oauth2.service_account import Credentials
import sqlite3

SCOPES = ['https://www.googleapis.com/auth/spreadsheets.readonly']
CREDENTIALS_FILE = r"C:\Users\SANJAR\.gemini\antigravity\scratch\google_sheets_project\credentials.json"
SPREADSHEET_ID = "1SUCM48SanOW2yQ8VA9eot1eFFNnbhPR4a_eXSMUh-34"

credentials = Credentials.from_service_account_file(CREDENTIALS_FILE, scopes=SCOPES)
client = gspread.authorize(credentials)
sheet = client.open_by_key(SPREADSHEET_ID)

worksheet = sheet.worksheet("Справочник норма")
df = pd.DataFrame(worksheet.get_all_records())

DB_FILE = r"C:\Users\SANJAR\.gemini\antigravity\scratch\fleet-management-app\prisma\dev.db"
conn = sqlite3.connect(DB_FILE)
cursor = conn.cursor()

updated = 0
for index, row in df.iterrows():
    plate = str(row.get("Гос.№", "")).strip()
    brand = str(row.get("Наименование\nмарки и модели автомобиля", "")).strip()
    
    if not plate or plate == "-":
        continue
        
    propan = str(row.get("Пропан", "")).strip()
    if propan != "":
        fuel_norm = 0.0
        try:
            fuel_norm = float(propan.replace(',', '.'))
        except:
            pass
            
        # Mashinaning yoqilg'i turini yangilash
        cursor.execute("UPDATE Vehicle SET fuelType = 'Propan' WHERE plate = ? AND fuelType = 'Noma''lum'", (plate,))
        if cursor.rowcount > 0:
            updated += 1
            # Normani yangilash
            cursor.execute("UPDATE Norm SET fuelPer100 = ? WHERE type = ?", (fuel_norm, brand))

conn.commit()
conn.close()
print(f"Propan yoqilg'isi tekshirildi. Yangilangan mashinalar soni: {updated}")
