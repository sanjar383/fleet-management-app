import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { PrismaClient } from "@prisma/client";
import { authOptions } from "@/lib/auth";
import Link from "next/link";
import { deleteDriver } from "./actions";
import DeleteButton from "@/components/DeleteButton";
import styles from "../dashboard/dashboard.module.css";

const prisma = new PrismaClient();

export default async function DriversPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  const drivers = await prisma.driver.findMany({
    orderBy: { name: "asc" },
  });

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <h1 className={styles.title}>Haydovchilar Bazasi</h1>
            <p className={styles.subtitle}>Tizimda mavjud bo'lgan barcha haydovchilar ro'yxati</p>
          </div>
          <div style={{ display: "flex", gap: "1rem" }}>
            <Link href="/drivers/new" className={`${styles.actionBtn} ${styles.primaryBtn}`}>
              + Yangi Haydovchi Qo'shish
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
              <th style={{ padding: "1rem", color: "#a0aec0" }}>Haydovchining Ism-Familiyasi</th>
              <th style={{ padding: "1rem", color: "#a0aec0" }}>Holati</th>
              <th style={{ padding: "1rem", color: "#a0aec0", textAlign: "right" }}>Amallar</th>
            </tr>
          </thead>
          <tbody>
            {drivers.map((d, i) => (
              <tr key={d.id} style={{ borderBottom: "1px solid rgba(255,255,255,0.05)", transition: "background 0.2s" }} className="tableRow">
                <td style={{ padding: "1rem", color: "#718096" }}>{i + 1}</td>
                <td style={{ padding: "1rem", fontWeight: "bold", color: "#fff" }}>{d.name}</td>
                <td style={{ padding: "1rem", color: "#e2e8f0" }}>
                  <span style={{ padding: "0.25rem 0.75rem", background: d.isActive ? "rgba(72, 187, 120, 0.2)" : "rgba(245, 101, 101, 0.2)", color: d.isActive ? "#48bb78" : "#f56565", borderRadius: "999px", fontSize: "0.85rem" }}>
                    {d.isActive ? "Faol" : "Faol emas"}
                  </span>
                </td>
                <td style={{ padding: "1rem", textAlign: "right" }}>
                  <Link href={`/drivers/${d.id}/edit`} style={{ display: "inline-block", background: "rgba(102, 126, 234, 0.1)", color: "#667eea", border: "1px solid rgba(102, 126, 234, 0.2)", padding: "0.5rem 1rem", borderRadius: "6px", cursor: "pointer", fontSize: "0.85rem", fontWeight: "bold", textDecoration: "none", marginRight: "0.5rem" }}>
                    Tahrirlash
                  </Link>
                  <form action={deleteDriver} style={{ display: "inline" }}>
                    <input type="hidden" name="id" value={d.id} />
                    <DeleteButton />
                  </form>
                </td>
              </tr>
            ))}
            {drivers.length === 0 && (
              <tr>
                <td colSpan={4} style={{ padding: "2rem", textAlign: "center", color: "#718096" }}>Haydovchilar topilmadi.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
