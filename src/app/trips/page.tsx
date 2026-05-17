import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { PrismaClient } from "@prisma/client";
import { authOptions } from "@/lib/auth";
import Link from "next/link";
import styles from "./trips.module.css";

const prisma = new PrismaClient();

export default async function AllTripsPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  // Barcha qatnovlarni olish (eng yangilari tepada)
  const trips = await prisma.trip.findMany({
    orderBy: { departureDate: "desc" },
    include: { vehicle: true }
  });

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div>
          <Link href="/dashboard" className={styles.backBtn}>
            &larr; Dashboard'ga qaytish
          </Link>
          <h1 className={styles.title}>Barcha Qatnovlar ({trips.length} ta)</h1>
        </div>
        <Link href="/trips/new" style={{ 
          background: "#3b82f6", 
          color: "white", 
          padding: "0.8rem 1.5rem", 
          borderRadius: "12px", 
          fontWeight: "600" 
        }}>
          + Yangi qatnov
        </Link>
      </header>

      <div className={styles.tableCard}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>№</th>
              <th>Chiqish Sanasi</th>
              <th>Kirish Sanasi</th>
              <th>Mashina / Markasi</th>
              <th>Haydovchi</th>
              <th>Tashkilot</th>
              <th>Yo'nalish</th>
              <th>Ish k/s</th>
              <th>Masofa</th>
              <th>Sarflangan (L)</th>
              <th>Norma (L)</th>
            </tr>
          </thead>
          <tbody>
            {trips.map((trip, index) => (
              <tr key={trip.id}>
                <td style={{ color: "#64748b" }}>{trips.length - index}</td>
                <td>{new Date(trip.departureDate || trip.createdAt).toLocaleDateString("uz-UZ")}</td>
                <td>{trip.returnDate ? new Date(trip.returnDate).toLocaleDateString("uz-UZ") : "—"}</td>
                <td>
                  <span className={styles.plate}>{trip.vehicle.plate}</span>
                  <div style={{ fontSize: "0.75rem", marginTop: "4px", color: "#94a3b8" }}>{trip.vehicle.brand}</div>
                </td>
                <td>{trip.driver}</td>
                <td>
                  <div style={{ maxWidth: "150px", overflow: "hidden", textOverflow: "ellipsis" }} title={trip.organization || ""}>
                    {trip.organization || "—"}
                  </div>
                </td>
                <td>{trip.origin}</td>
                <td>{trip.workDays} k / {trip.workHours} s</td>
                <td>{trip.distance} km</td>
                <td>{trip.fuelFilled} L</td>
                <td className={styles.fuelNorm}>{trip.fuelNorm.toFixed(1)} L</td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {trips.length === 0 && (
          <div style={{ textAlign: "center", padding: "3rem", color: "#94a3b8" }}>
            Hali hech qanday qatnov kiritilmagan.
          </div>
        )}
      </div>
    </div>
  );
}
