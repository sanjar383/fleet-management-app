import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { PrismaClient } from "@prisma/client";
import { authOptions } from "@/lib/auth";
import Link from "next/link";
import styles from "./dashboard.module.css";
import DeleteTripButton from "../trips/new/DeleteTripButton";

const prisma = new PrismaClient();

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  // Ma'lumotlarni parallel olish
  const [vehiclesCount, tripsCount, usersCount, recentTrips] = await Promise.all([
    prisma.vehicle.count(),
    prisma.trip.count(),
    prisma.user.count(),
    prisma.trip.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
      include: { vehicle: true }
    })
  ]);

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.title}>Asosiy Oyna</h1>
        <p className={styles.subtitle}>
          Xush kelibsiz, <strong>{session.user?.name}</strong>! Tizim ko'rsatkichlari bilan tanishing.
        </p>
      </header>

      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div className={styles.statTitle}>🚗 Jami Mashinalar</div>
          <div className={styles.statValue}>{vehiclesCount}</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statTitle}>🛣️ Jami Qatnovlar</div>
          <div className={styles.statValue}>{tripsCount}</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statTitle}>👥 Foydalanuvchilar</div>
          <div className={styles.statValue}>{usersCount}</div>
        </div>
      </div>

      <div className={styles.menuSection}>
        <h2 className={styles.menuTitle}>Tezkor menyu</h2>
        <div className={styles.btnGroup}>
          <Link href="/trips/new" className={`${styles.actionBtn} ${styles.primaryBtn}`}>
            <span>+</span> Yangi qatnov qo'shish
          </Link>
          <Link href="/vehicles" className={`${styles.actionBtn} ${styles.secondaryBtn}`}>
            Mashinalar bazasi
          </Link>
          <Link href="/drivers" className={`${styles.actionBtn} ${styles.secondaryBtn}`}>
            Haydovchilar
          </Link>
          <Link href="/norms" className={`${styles.actionBtn} ${styles.secondaryBtn}`}>
            Yoqilg'i normalari
          </Link>
        </div>
      </div>

      <div className={styles.tableSection}>
        <h2 className={styles.menuTitle}>Oxirgi Qatnovlar</h2>
        
        {recentTrips.length === 0 ? (
          <p style={{ color: "#718096", padding: "1rem" }}>Hali hech qanday qatnov kiritilmagan.</p>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Sana</th>
                  <th>Mashina</th>
                  <th>Haydovchi</th>
                  <th>Tashkilot / Bo'linma</th>
                  <th>Yo'nalish</th>
                  <th>Ish k/s</th>
                  <th>Masofa</th>
                  <th>Sarf (L)</th>
                </tr>
              </thead>
              <tbody>
                {recentTrips.map((trip) => (
                  <tr key={trip.id}>
                    <td>{new Date(trip.departureDate || trip.createdAt).toLocaleDateString("uz-UZ")}</td>
                    <td>
                      <span className={styles.plateBadge}>{trip.vehicle.plate}</span>
                    </td>
                    <td>{trip.driver}</td>
                    <td>
                      <div style={{ fontSize: "0.85rem" }}>{trip.organization || "—"}</div>
                      <div style={{ fontSize: "0.75rem", color: "#94a3b8" }}>{trip.division || "—"}</div>
                    </td>
                    <td>{trip.origin}</td>
                    <td>
                      <span title="Ish kunlari">{trip.workDays} k</span> / <span title="Ish soatlari">{trip.workHours} s</span>
                    </td>
                    <td>{trip.distance} km</td>
                    <td style={{ color: "#10b981", fontWeight: "600" }}>{trip.fuelNorm.toFixed(1)}</td>
                    <td>
                      <Link href={`/trips/${trip.id}/edit`} className={styles.editBtn}>
                        ✏️
                      </Link>
                      <DeleteTripButton tripId={trip.id} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
