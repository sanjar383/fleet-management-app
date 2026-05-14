import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { PrismaClient } from "@prisma/client";
import { authOptions } from "@/lib/auth";
import Link from "next/link";
import styles from "../dashboard/dashboard.module.css";

const prisma = new PrismaClient();

export default async function NormsPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  const norms = await prisma.norm.findMany({
    orderBy: { type: "asc" },
  });

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <h1 className={styles.title}>Yoqilg'i Normalari</h1>
            <p className={styles.subtitle}>Har bir texnika uchun belgilangan sarf normalari</p>
          </div>
          <Link href="/dashboard" className={`${styles.actionBtn} ${styles.secondaryBtn}`}>
            &larr; Orqaga (Dashboard)
          </Link>
        </div>
      </header>

      <div style={{ background: "rgba(255,255,255,0.03)", borderRadius: "16px", padding: "1.5rem", border: "1px solid rgba(255,255,255,0.05)" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
          <thead>
            <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.1)" }}>
              <th style={{ padding: "1rem", color: "#a0aec0" }}>#</th>
              <th style={{ padding: "1rem", color: "#a0aec0" }}>Texnika Turi / Modeli</th>
              <th style={{ padding: "1rem", color: "#a0aec0" }}>Hudud / Yo'l turi</th>
              <th style={{ padding: "1rem", color: "#a0aec0" }}>Mavsum</th>
              <th style={{ padding: "1rem", color: "#a0aec0" }}>100 km ga norma (litr)</th>
            </tr>
          </thead>
          <tbody>
            {norms.map((n, i) => (
              <tr key={n.id} style={{ borderBottom: "1px solid rgba(255,255,255,0.05)", transition: "background 0.2s" }} className="tableRow">
                <td style={{ padding: "1rem", color: "#718096" }}>{i + 1}</td>
                <td style={{ padding: "1rem", fontWeight: "bold", color: "#fff" }}>{n.type}</td>
                <td style={{ padding: "1rem", color: "#e2e8f0" }}>{n.location === "-" ? "Asfalt / Oddiy yo'l" : n.location}</td>
                <td style={{ padding: "1rem", color: "#a0aec0" }}>{n.season}</td>
                <td style={{ padding: "1rem", color: "#667eea", fontWeight: "bold", fontSize: "1.1rem" }}>{n.fuelPer100} L</td>
              </tr>
            ))}
            {norms.length === 0 && (
              <tr>
                <td colSpan={5} style={{ padding: "2rem", textAlign: "center", color: "#718096" }}>Normalar topilmadi.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
