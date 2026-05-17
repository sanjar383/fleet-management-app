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

  const vehicles = await prisma.vehicle.findMany({ orderBy: { plate: "asc" } });
  const drivers = await prisma.driver.findMany({ orderBy: { name: "asc" } });
  const norms = await prisma.norm.findMany({ select: { type: true, location: true } });
  
  const allTrips = await prisma.trip.findMany({
    select: { organization: true, division: true, origin: true }
  });

  const uniqueOrganizations = Array.from(new Set(allTrips.map(t => t.organization).filter(Boolean)));
  const uniqueDivisions = Array.from(new Set(allTrips.map(t => t.division).filter(Boolean)));
  const uniqueRoutes = Array.from(new Set(allTrips.map(t => t.origin).filter(Boolean)));
  const uniqueVehicleTypes = Array.from(new Set(vehicles.map(v => v.type)));

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.title}>Professional Yo'l Varaqasi</h1>
        <Link href="/dashboard" className={styles.backBtn}>&larr; Orqaga</Link>
      </header>

      <div className={styles.card}>
        <form action={createTrip}>
          
          <datalist id="orgList">{uniqueOrganizations.map((o, i) => <option key={i} value={o!} />)}</datalist>
          <datalist id="divList">{uniqueDivisions.map((d, i) => <option key={i} value={d!} />)}</datalist>
          <datalist id="routeList">{uniqueRoutes.map((r, i) => <option key={i} value={r!} />)}</datalist>
          <datalist id="driverList">{drivers.map(d => <option key={d.id} value={d.name} />)}</datalist>

          <div className={styles.sectionTitle}>1. Umumiy ma'lumotlar</div>
          <div className={styles.formGrid}>
            <div className={styles.formGroup}>
              <label className={styles.label}>Yo'l varaqasi №</label>
              <input name="waybillNumber" type="text" className={styles.input} placeholder="00123" />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.label}>Chiqish sanasi</label>
              <input name="departureDate" type="date" required className={styles.input} />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.label}>Kirish sanasi</label>
              <input name="returnDate" type="date" className={styles.input} />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.label}>Tashkilot</label>
              <input name="organization" type="text" list="orgList" className={styles.input} />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.label}>Bo'linma</label>
              <input name="division" type="text" list="divList" className={styles.input} />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.label}>Haydovchi</label>
              <input name="driver" type="text" list="driverList" required className={styles.input} />
            </div>
          </div>

          <div className={styles.sectionTitle}>2. Texnik holat va Transport</div>
          <div className={styles.formGrid}>
            <div className={styles.formGroup}>
              <label className={styles.label}>GPS holati</label>
              <select name="gpsStatus" className={styles.input}>
                <option value="Ishlamoqda">Ishlamoqda</option>
                <option value="Ishlamayapti">Ishlamayapti</option>
              </select>
            </div>
            <div className={styles.formGroup}>
              <label className={styles.label}>Konditsioner / Kompressor</label>
              <select name="acStatus" className={styles.input}>
                <option value="Yo'q">Yo'q</option>
                <option value="Ishlatildi">Ishlatildi</option>
              </select>
            </div>
            <VehicleSelector vehicles={vehicles} norms={norms} />
          </div>

          <div className={styles.sectionTitle}>3. Yo'nalish va Spidometr</div>
          <div className={styles.formGrid}>
            <div className={`${styles.formGroup} ${styles.fullWidth}`}>
              <label className={styles.label}>Yo'nalish</label>
              <input name="route" type="text" list="routeList" required className={styles.input} />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.label}>Spidometr (Chiqishda)</label>
              <input name="startKm" type="number" step="0.1" required className={styles.input} />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.label}>Spidometr (Kirishda)</label>
              <input name="endKm" type="number" step="0.1" required className={styles.input} />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.label}>Yoqilg'i quyildi (L/Kub)</label>
              <input name="fuelFilled" type="number" step="0.1" required className={styles.input} defaultValue="0" />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.label}>Qum-tosh yo'lda (km)</label>
              <input name="sandGravel" type="number" step="0.1" className={styles.input} defaultValue="0" />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.label}>Mavsum koeffitsienti</label>
              <input name="seasonCoeff" type="number" step="0.01" className={styles.input} defaultValue="0" />
            </div>
          </div>

          <button type="submit" className={styles.submitBtn}>Saqlash va Sheets'ga yuborish</button>
        </form>
      </div>
    </div>
  );
}
