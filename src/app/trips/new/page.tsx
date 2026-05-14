import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { PrismaClient } from "@prisma/client";
import { authOptions } from "@/lib/auth";
import Link from "next/link";
import { createTrip } from "./actions";
import styles from "./form.module.css";
import VehicleSelector from "./VehicleSelector";

const prisma = new PrismaClient();

export default async function NewTripPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  const vehicles = await prisma.vehicle.findMany({
    orderBy: { plate: "asc" }
  });

  const drivers = await prisma.driver.findMany({
    orderBy: { name: "asc" }
  });

  const allTrips = await prisma.trip.findMany({
    select: { organization: true, division: true, origin: true, vehicleType: true }
  });

  const uniqueOrganizations = Array.from(new Set(allTrips.map(t => t.organization).filter(Boolean)));
  const uniqueDivisions = Array.from(new Set(allTrips.map(t => t.division).filter(Boolean)));
  const uniqueRoutes = Array.from(new Set(allTrips.map(t => t.origin).filter(Boolean)));
  const tripVehicleTypes = allTrips.map(t => t.vehicleType).filter(Boolean);
  const dbVehicleTypes = vehicles.map(v => v.type).filter(Boolean);
  const uniqueVehicleTypes = Array.from(new Set([...tripVehicleTypes, ...dbVehicleTypes]));

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div>
          <h1 className={styles.title}>Yangi Qatnov (Yo'l varaqasi)</h1>
        </div>
        <Link href="/dashboard" className={styles.backBtn}>
          &larr; Orqaga
        </Link>
      </header>

      <div className={styles.card}>
        <form action={createTrip} className={styles.formGrid}>
          
          <datalist id="orgList">
            {uniqueOrganizations.map((org, i) => <option key={i} value={org as string} />)}
          </datalist>

          <datalist id="divisionList">
            {uniqueDivisions.map((div, i) => <option key={i} value={div as string} />)}
          </datalist>

          <datalist id="routeList">
            {uniqueRoutes.map((route, i) => <option key={i} value={route as string} />)}
          </datalist>

          <div className={styles.formGroup}>
            <label className={styles.label}>Chiqish sanasi</label>
            <input name="departureDate" type="date" required className={styles.input} style={{ transition: "all 0.3s ease" }} />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Kirish sanasi</label>
            <input name="returnDate" type="date" className={styles.input} style={{ transition: "all 0.3s ease" }} />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Ish kuni (kun)</label>
            <input name="workDays" type="number" step="1" min="0" className={styles.input} placeholder="Masalan: 1 yoki 2" />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Ish soati (soat)</label>
            <input name="workHours" type="number" step="1" min="0" className={styles.input} placeholder="Masalan: 8 yoki 12" />
          </div>

          <div className={`${styles.formGroup} ${styles.fullWidth}`}>
            <label className={styles.label}>Tashkilot (Ekspeditsiya)</label>
            <input name="organization" type="text" list="orgList" className={styles.input} placeholder="Masalan: Markaziy geologiya qidiruv ekspeditsiyasi" />
          </div>

          <div className={`${styles.formGroup} ${styles.fullWidth}`}>
            <label className={styles.label}>Tarkibiy bo'linma</label>
            <input name="division" type="text" list="divisionList" className={styles.input} placeholder="Masalan: Qashqadaryo DE" />
          </div>

          <datalist id="driverList">
            {drivers.map(d => <option key={d.id} value={d.name} />)}
          </datalist>

          <div className={`${styles.formGroup} ${styles.fullWidth}`}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem" }}>
              <label className={styles.label} style={{ marginBottom: 0 }}>Haydovchi (Ism-Familiyasi)</label>
              <Link href="/drivers/new" style={{ color: "#667eea", fontSize: "0.85rem", textDecoration: "none", fontWeight: "bold" }}>
                + Yangi qo'shish
              </Link>
            </div>
            <input name="driver" type="text" list="driverList" required className={styles.input} placeholder="-- Haydovchini tanlang yoki yozing --" />
          </div>

          <VehicleSelector vehicles={vehicles} uniqueVehicleTypes={uniqueVehicleTypes} />

          <div className={`${styles.formGroup} ${styles.fullWidth}`}>
            <label className={styles.label}>Chiqish va kirish joyi (Yo'nalish)</label>
            <input name="route" type="text" list="routeList" required className={styles.input} placeholder="Masalan: Baza - Oqota - Baza" />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Spidometr (Chiqishda)</label>
            <input name="startKm" type="number" step="0.1" required className={styles.input} placeholder="Masalan: 125000" />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Spidometr (Kirishda)</label>
            <input name="endKm" type="number" step="0.1" required className={styles.input} placeholder="Masalan: 125150" />
          </div>

          <div className={`${styles.formGroup} ${styles.fullWidth}`}>
            <label className={styles.label}>Yoqilg'i quyildi (Litr yoki Kub)</label>
            <input name="fuelFilled" type="number" step="0.1" required className={styles.input} placeholder="Masalan: 40" defaultValue="0" />
          </div>

          <button type="submit" className={styles.submitBtn}>
            Yo'l varaqasini saqlash
          </button>
        </form>
      </div>
    </div>
  );
}
