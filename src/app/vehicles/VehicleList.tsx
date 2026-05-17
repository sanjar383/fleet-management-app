"use client";

import { useState } from "react";
import Link from "next/link";
import DeleteButton from "@/components/DeleteButton";
import { deleteVehicle } from "./actions";
import styles from "./vehicles.module.css";

interface Vehicle {
  id: string;
  plate: string;
  brand: string;
  type: string;
  fuelType: string;
}

interface Props {
  vehicles: Vehicle[];
}

export default function VehicleList({ vehicles }: Props) {
  const [search, setSearch] = useState("");
  const filtered = vehicles.filter(v =>
    v.plate.toLowerCase().includes(search.toLowerCase()) ||
    v.brand.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className={styles.container}>
      <div className={styles.toolbar}>
        <input
          type="text"
          placeholder="Qidirish (plate yoki brand)..."
          className={styles.searchInput}
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <Link href="/vehicles/new" className={styles.addButton}>
          + Yangi Mashina Qo'shish
        </Link>
        <Link href="/dashboard" className={styles.backButton}>
          ← Orqaga
        </Link>
      </div>
      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>#</th>
              <th>Davlat raqami</th>
              <th>Markasi</th>
              <th>Turi</th>
              <th>Yoqilg'i</th>
              <th>Amallar</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((v, i) => (
              <tr key={v.id} className={styles.tableRow}>
                <td>{i + 1}</td>
                <td className={styles.bold}>{v.plate}</td>
                <td>{v.brand}</td>
                <td>{v.type}</td>
                <td>{v.fuelType}</td>
                <td className={styles.actions}>
                  <Link href={`/vehicles/${v.id}/edit`} className={styles.editLink}>
                    Tahrirlash
                  </Link>
                  <form action={deleteVehicle} className={styles.deleteForm}>
                    <input type="hidden" name="id" value={v.id} />
                    <DeleteButton message="Haqiqatan ham o'chirmoqchimisiz? Mashinaga bog'langan yo'l varaqalari xato berishi mumkin!" />
                  </form>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={6} className={styles.empty}>Mos keluvchi mashina topilmadi.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
