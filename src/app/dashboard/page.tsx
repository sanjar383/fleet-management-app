import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { PrismaClient } from "@prisma/client";
import { authOptions } from "@/lib/auth";
import Link from "next/link";
import styles from "./dashboard.module.css";

const prisma = new PrismaClient();

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  const vehiclesCount = await prisma.vehicle.count();
  const tripsCount = await prisma.trip.count();
  const usersCount = await prisma.user.count();

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
          <div className={styles.statTitle}>Jami Mashinalar</div>
          <div className={styles.statValue}>{vehiclesCount}</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statTitle}>Jami Qatnovlar</div>
          <div className={styles.statValue}>{tripsCount}</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statTitle}>Foydalanuvchilar</div>
          <div className={styles.statValue}>{usersCount}</div>
        </div>
      </div>

      <div className={styles.menuSection}>
        <h2 className={styles.menuTitle}>Tezkor menyu</h2>
        <div className={styles.btnGroup}>
          <Link href="/trips/new" className={`${styles.actionBtn} ${styles.primaryBtn}`}>
            + Yangi qatnov qo'shish
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

      <div style={{ marginTop: "3rem", background: "rgba(255,255,255,0.03)", borderRadius: "16px", padding: "1.5rem", border: "1px solid rgba(255,255,255,0.05)" }}>
        <h2 className={styles.menuTitle}>Oxirgi Qatnovlar</h2>
        
        {tripsCount === 0 ? (
          <p style={{ color: "#718096" }}>Hali hech qanday qatnov kiritilmagan.</p>
        ) : (
          <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.1)" }}>
                <th style={{ padding: "1rem", color: "#a0aec0" }}>Sana</th>
                <th style={{ padding: "1rem", color: "#a0aec0" }}>Haydovchi</th>
                <th style={{ padding: "1rem", color: "#a0aec0" }}>Yo'nalish</th>
                <th style={{ padding: "1rem", color: "#a0aec0" }}>Masofa</th>
                <th style={{ padding: "1rem", color: "#a0aec0" }}>Norma sarf</th>
              </tr>
            </thead>
            <tbody>
              {/* Bu yerda keyinchalik oxirgi 5 ta qatnovni chiqarib qo'yish mumkin */}
              <tr>
                <td colSpan={5} style={{ padding: "1rem", color: "#718096" }}>Jami {tripsCount} ta qatnov bazada saqlanmoqda. (Tez kunda shu yerda to'liq jadval chiqadi)</td>
              </tr>
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
