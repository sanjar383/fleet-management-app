import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { PrismaClient } from "@prisma/client";
import { authOptions } from "@/lib/auth";
import Link from "next/link";
import { deleteVehicle } from "./actions";
import DeleteButton from "@/components/DeleteButton";
import styles from "../dashboard/dashboard.module.css";

const prisma = new PrismaClient();

export default async function VehiclesPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  const vehicles = await prisma.vehicle.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <h1 className={styles.title}>Mashinalar Bazasi</h1>
            <p className={styles.subtitle}>Tizimda mavjud bo'lgan barcha texnikalar ro'yxati</p>
          </div>
          <div style={{ display: "flex", gap: "1rem" }}>
            <Link href="/vehicles/new" className={`${styles.actionBtn} ${styles.primaryBtn}`}>
              + Yangi Mashina Qo'shish
            </Link>
            <Link href="/dashboard" className={`${styles.actionBtn} ${styles.secondaryBtn}`}>
              &larr; Orqaga
            </Link>
          </div>
        </div>
      </header>

      <div style={{ background: "rgba(255,255,255,0.03)", borderRadius: "16px", padding: "1.5rem", border: "1px solid rgba(255,255,255,0.05)" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
          <thead>
            <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.1)" }}>
              <th style={{ padding: "1rem", color: "#a0aec0", width: "50px" }}>#</th>
              <th style={{ padding: "1rem", color: "#a0aec0" }}>Davlat raqami</th>
              <th style={{ padding: "1rem", color: "#a0aec0" }}>Markasi</th>
              <th style={{ padding: "1rem", color: "#a0aec0" }}>Turi</th>
              <th style={{ padding: "1rem", color: "#a0aec0" }}>Yoqilg'i</th>
              <th style={{ padding: "1rem", color: "#a0aec0", textAlign: "right" }}>Amallar</th>
            </tr>
          </thead>
          <tbody>
            {vehicles.map((v, i) => (
              <tr key={v.id} style={{ borderBottom: "1px solid rgba(255,255,255,0.05)", transition: "background 0.2s" }} className="tableRow">
                <td style={{ padding: "1rem", color: "#718096" }}>{i + 1}</td>
                <td style={{ padding: "1rem", fontWeight: "bold", color: "#fff" }}>{v.plate}</td>
                <td style={{ padding: "1rem", color: "#e2e8f0" }}>{v.brand}</td>
                <td style={{ padding: "1rem", color: "#a0aec0" }}>{v.type}</td>
                <td style={{ padding: "1rem", color: "#a0aec0" }}>{v.fuelType}</td>
                <td style={{ padding: "1rem", textAlign: "right" }}>
                  <Link href={`/vehicles/${v.id}/edit`} style={{ display: "inline-block", background: "rgba(102, 126, 234, 0.1)", color: "#667eea", border: "1px solid rgba(102, 126, 234, 0.2)", padding: "0.5rem 1rem", borderRadius: "6px", cursor: "pointer", fontSize: "0.85rem", fontWeight: "bold", textDecoration: "none", marginRight: "0.5rem" }}>
                    Tahrirlash
                  </Link>
                  <form action={deleteVehicle} style={{ display: "inline" }}>
                    <input type="hidden" name="id" value={v.id} />
                    <DeleteButton message="Haqiqatan ham o'chirmoqchimisiz? Mashinaga bog'langan yo'l varaqalari xato berishi mumkin!" />
                  </form>
                </td>
              </tr>
            ))}
            {vehicles.length === 0 && (
              <tr>
                <td colSpan={6} style={{ padding: "2rem", textAlign: "center", color: "#718096" }}>Mashinalar topilmadi.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
