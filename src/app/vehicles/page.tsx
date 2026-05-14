"use client";

import Link from "next/link";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { PrismaClient } from "@prisma/client";
import { authOptions } from "@/lib/auth";
import styles from "../dashboard/dashboard.module.css";
import VehicleList from "./VehicleList";

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
              ← Orqaga
            </Link>
          </div>
        </div>
      </header>
      <VehicleList vehicles={vehicles} />
    </div>
  );
}
