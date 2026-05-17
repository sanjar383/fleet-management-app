import { getServerSession } from "next-auth";
import { redirect, notFound } from "next/navigation";
import { PrismaClient } from "@prisma/client";
import { authOptions } from "@/lib/auth";
import Link from "next/link";
import { updateTrip } from "../../new/actions";
import styles from "../../new/form.module.css";
import VehicleSelector from "../../new/VehicleSelector";

const prisma = new PrismaClient();

export default async function EditTripPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");

  const trip = await prisma.trip.findUnique({
    where: { id },
    include: { vehicle: true }
  });

  if (!trip) notFound();

  const vehicles = await prisma.vehicle.findMany({ orderBy: { plate: "asc" } });
  const norms = await prisma.norm.findMany({ select: { type: true, location: true } });

  const updateWithId = updateTrip.bind(null, trip.id);

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.title}>Qatnovni tahrirlash</h1>
        <Link href="/dashboard" className={styles.backBtn}>&larr; Bekor qilish</Link>
      </header>

      <div className={styles.card}>
        <form action={updateWithId}>
          <div className={styles.sectionTitle}>1. Umumiy ma'lumotlar</div>
          <div className={styles.formGrid}>
            <div className={styles.formGroup}>
              <label className={styles.label}>Yo'l varaqasi №</label>
              <input name="waybillNumber" type="text" className={styles.input} defaultValue={trip.waybillNumber || ""} />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.label}>Chiqish sanasi</label>
              <input name="departureDate" type="date" required className={styles.input} defaultValue={trip.departureDate?.toISOString().split('T')[0]} />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.label}>Kirish sanasi</label>
              <input name="returnDate" type="date" className={styles.input} defaultValue={trip.returnDate?.toISOString().split('T')[0] || ""} />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.label}>Haydovchi</label>
              <input name="driver" type="text" required className={styles.input} defaultValue={trip.driver} />
            </div>
          </div>

          <div className={styles.sectionTitle}>2. Texnik holat</div>
          <div className={styles.formGrid}>
            <div className={styles.formGroup}>
              <label className={styles.label}>GPS holati</label>
              <select name="gpsStatus" className={styles.input} defaultValue={trip.gpsStatus || ""}>
                <option value="Ishlamoqda">Ishlamoqda</option>
                <option value="Ishlamayapti">Ishlamayapti</option>
              </select>
            </div>
            <div className={styles.formGroup}>
              <label className={styles.label}>Konditsioner</label>
              <select name="acStatus" className={styles.input} defaultValue={trip.acStatus || ""}>
                <option value="Yo'q">Yo'q</option>
                <option value="Ishlatildi">Ishlatildi</option>
              </select>
            </div>
            <div className={styles.formGroup}>
              <label className={styles.label}>Mashina</label>
              <input name="vehicleId" type="text" readOnly className={styles.input} value={trip.vehicle.plate} style={{ background: "rgba(255,255,255,0.05)" }} />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.label}>Hudud (Normativ)</label>
              <input name="regionNorm" type="text" className={styles.input} defaultValue={trip.regionNorm || ""} />
            </div>
          </div>

          <div className={styles.sectionTitle}>3. Spidometr va Yoqilg'i</div>
          <div className={styles.formGrid}>
            <div className={`${styles.formGroup} ${styles.fullWidth}`}>
              <label className={styles.label}>Yo'nalish</label>
              <input name="route" type="text" required className={styles.input} defaultValue={trip.origin} />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.label}>Spidometr (Chiqish)</label>
              <input name="startKm" type="number" step="0.1" required className={styles.input} defaultValue={trip.startKm} />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.label}>Spidometr (Kirish)</label>
              <input name="endKm" type="number" step="0.1" required className={styles.input} defaultValue={trip.endKm} />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.label}>Yoqilg'i qoldig'i (Chiqish)</label>
              <input name="fuelStart" type="number" step="0.1" required className={styles.input} defaultValue={trip.fuelStart || 0} />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.label}>Yoqilg'i quyildi (L)</label>
              <input name="fuelFilled" type="number" step="0.1" required className={styles.input} defaultValue={trip.fuelFilled} />
            </div>
          </div>

          <div className={styles.sectionTitle}>4. Maxsus sharoitlar (km)</div>
          <div className={styles.formGrid}>
            <div className={styles.formGroup}>
              <label className={styles.label}>500-1500m</label>
              <input name="m500_1500" type="number" step="0.1" className={styles.input} defaultValue={trip.m500_1500 || 0} />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.label}>1501-2000m</label>
              <input name="m1501_2000" type="number" step="0.1" className={styles.input} defaultValue={trip.m1501_2000 || 0} />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.label}>Qum-tosh</label>
              <input name="sandGravel" type="number" step="0.1" className={styles.input} defaultValue={trip.sandGravel || 0} />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.label}>Mavsum koeff.</label>
              <input name="seasonCoeff" type="number" step="0.01" className={styles.input} defaultValue={trip.seasonCoeff || 1} />
            </div>
          </div>

          <button type="submit" className={styles.submitBtn}>O'zgarishlarni saqlash</button>
        </form>
      </div>
    </div>
  );
}
