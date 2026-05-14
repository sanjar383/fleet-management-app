import gspread
import pandas as pd
from google.oauth2.service_account import Credentials
import sqlite3
import uuid
import datetime

# Setup Google Sheets API
SCOPES = ['https://www.googleapis.com/auth/spreadsheets.readonly']
CREDENTIALS_FILE = r"C:\Users\SANJAR\.gemini\antigravity\scratch\google_sheets_project\credentials.json"
SPREADSHEET_ID = "1SUCM48SanOW2yQ8VA9eot1eFFNnbhPR4a_eXSMUh-34"

credentials = Credentials.from_service_account_file(CREDENTIALS_FILE, scopes=SCOPES)
client = gspread.authorize(credentials)

sheet = client.open_by_key(SPREADSHEET_ID)
worksheet = sheet.worksheet("Справочник норма")

data = worksheet.get_all_records()
df = pd.DataFrame(data)

# Connect to SQLite Database
DB_FILE = r"C:\Users\SANJAR\.gemini\antigravity\scratch\fleet-management-app\prisma\dev.db"
conn = sqlite3.connect(DB_FILE)
cursor = conn.cursor()

def cuid_ish():
    return "cuid" + str(uuid.uuid4()).replace("-", "")[:20]

now = datetime.datetime.utcnow().isoformat() + "Z"
# ISO 8601 string for Prisma is usually YYYY-MM-DDTHH:MM:SS.mmmZ
# Let's just use unix epoch milliseconds for createdAt in sqlite if prisma stored it as integer, wait prisma stores datetime as string or unix in sqlite?
# Prisma stores DateTime as integer (unix timestamp in milliseconds) in SQLite!
import time
now_ms = int(time.time() * 1000)

added_vehicles = 0

for index, row in df.iterrows():
    brand = str(row.get("Наименование\nмарки и модели автомобиля", "")).strip()
    plate = str(row.get("Гос.№", "")).strip()
    v_type = str(row.get("Тип автомобили", "")).strip()
    
    if not plate or plate == "-":
        continue
    
    # Determine Fuel Type
    fuel_type = "Noma'lum"
    fuel_norm = 0.0
    
    if str(row.get("Дизель", "")).strip() != "":
        fuel_type = "Дизель"
        fuel_norm = float(str(row.get("Дизель")).replace(',', '.'))
    elif str(row.get("Бензин Ai 92", "")).strip() != "":
        fuel_type = "Бензин"
        fuel_norm = float(str(row.get("Бензин Ai 92")).replace(',', '.'))
    elif str(row.get("Метан", "")).strip() != "":
        fuel_type = "Метан"
        try:
             fuel_norm = float(str(row.get("Метан")).replace(',', '.'))
        except:
             fuel_norm = 0.0
             
    # Insert Vehicle if not exists
    cursor.execute("SELECT id FROM Vehicle WHERE plate = ?", (plate,))
    existing = cursor.fetchone()
    if not existing:
        v_id = cuid_ish()
        cursor.execute(
            "INSERT INTO Vehicle (id, brand, plate, type, fuelType, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?)",
            (v_id, brand, plate, v_type, fuel_type, now_ms, now_ms)
        )
        added_vehicles += 1
        
        # Also let's insert a Base Norm for this vehicle based on the columns
        n_id = cuid_ish()
        region = str(row.get("Регион", "Umumiy")).strip()
        cursor.execute(
            "INSERT INTO Norm (id, type, location, season, fuelPer100, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?)",
            (n_id, brand, region, "Yoz", fuel_norm, now_ms, now_ms)
        )

conn.commit()
conn.close()

print(f"Baza muvaffaqiyatli import qilindi! Qo'shilgan yangi mashinalar: {added_vehicles}")
