import gspread
import pandas as pd
from google.oauth2.service_account import Credentials
import sqlite3
import uuid
import datetime
import time

SCOPES = ['https://www.googleapis.com/auth/spreadsheets.readonly']
CREDENTIALS_FILE = r"C:\Users\SANJAR\.gemini\antigravity\scratch\google_sheets_project\credentials.json"
SPREADSHEET_ID = "1SUCM48SanOW2yQ8VA9eot1eFFNnbhPR4a_eXSMUh-34"

credentials = Credentials.from_service_account_file(CREDENTIALS_FILE, scopes=SCOPES)
client = gspread.authorize(credentials)
sheet = client.open_by_key(SPREADSHEET_ID)

# 1. Import Drivers
worksheet = sheet.worksheet("Справочник мгкэ")
df = pd.DataFrame(worksheet.get_all_records())

DB_FILE = r"C:\Users\SANJAR\.gemini\antigravity\scratch\fleet-management-app\prisma\dev.db"
conn = sqlite3.connect(DB_FILE)
cursor = conn.cursor()

def cuid_ish():
    return "cuid" + str(uuid.uuid4()).replace("-", "")[:20]

now_ms = int(time.time() * 1000)

added_drivers = 0
for index, row in df.iterrows():
    driver_name = str(row.get("Хайдовчилар", "")).strip()
    if not driver_name:
        continue
        
    cursor.execute("SELECT id FROM Driver WHERE name = ?", (driver_name,))
    if not cursor.fetchone():
        cursor.execute(
            "INSERT INTO Driver (id, name, isActive, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?)",
            (cuid_ish(), driver_name, 1, now_ms, now_ms)
        )
        added_drivers += 1

# 2. Import Actual Vehicles
worksheet_auto = sheet.worksheet("База авто")
df_auto = pd.DataFrame(worksheet_auto.get_all_records())

added_vehicles = 0
for index, row in df_auto.iterrows():
    plate = str(row.get("Давлат раками", "")).strip()
    brand = str(row.get("Наименование\nмарки и модели автомобиля", "")).strip()
    v_type = str(row.get("Тип автомобили", "")).strip()
    
    if not plate:
        continue
        
    # See if already exists
    cursor.execute("SELECT id FROM Vehicle WHERE plate = ?", (plate,))
    if not cursor.fetchone():
        cursor.execute(
            "INSERT INTO Vehicle (id, brand, plate, type, fuelType, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?)",
            (cuid_ish(), brand, plate, v_type, "Noma'lum", now_ms, now_ms)
        )
        added_vehicles += 1

conn.commit()
conn.close()

print(f"Import yakunlandi! Qo'shilgan haydovchilar: {added_drivers}, Yangi mashinalar: {added_vehicles}")
