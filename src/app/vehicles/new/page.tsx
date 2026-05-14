import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import Link from "next/link";
import { createVehicle } from "./actions";
import styles from "../../trips/new/form.module.css";

export default async function NewVehiclePage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div>
          <h1 className={styles.title}>Yangi Mashina Qo'shish</h1>
        </div>
        <Link href="/vehicles" className={styles.backBtn}>
          &larr; Orqaga
        </Link>
      </header>

      <div className={styles.card}>
        <form action={createVehicle} className={styles.formGrid}>
          
          <div className={styles.formGroup}>
            <label className={styles.label}>Davlat raqami</label>
            <input name="plate" type="text" required className={styles.input} placeholder="Masalan: 01 A 123 AA" />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Mashina modeli (Markasi)</label>
            <input name="brand" type="text" required className={styles.input} placeholder="Masalan: ISUZU FVR33" />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Texnika turi</label>
            <select name="type" required className={styles.select}>
              <option value="Yengil avtomobil">Yengil avtomobil</option>
              <option value="Yuk avtomobili">Yuk avtomobili</option>
              <option value="Avtokran">Avtokran</option>
              <option value="Boshqa maxsus texnika">Boshqa maxsus texnika</option>
            </select>
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Yoqilg'i turi</label>
            <select name="fuelType" required className={styles.select}>
              <option value="Dizel">Dizel</option>
              <option value="Benzin">Benzin</option>
              <option value="Propan">Propan</option>
              <option value="Metan">Metan</option>
            </select>
          </div>

          <div className={`${styles.formGroup} ${styles.fullWidth}`}>
            <label className={styles.label}>Asosiy sarf normasi (100 km uchun necha litr)</label>
            <input name="fuelNorm" type="number" step="0.1" required className={styles.input} placeholder="Masalan: 32.5" />
          </div>

          <button type="submit" className={styles.submitBtn}>
            Mashinani Saqlash
          </button>
        </form>
      </div>
    </div>
  );
}
