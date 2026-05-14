import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import Link from "next/link";
import { PrismaClient } from "@prisma/client";
import { updateVehicle } from "../../actions";
import styles from "../../../trips/new/form.module.css";

const prisma = new PrismaClient();

export default async function EditVehiclePage(props: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  const { id } = await props.params;

  const vehicle = await prisma.vehicle.findUnique({
    where: { id }
  });

  if (!vehicle) {
    redirect("/vehicles");
  }

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div>
          <h1 className={styles.title}>Mashinani Tahrirlash</h1>
        </div>
        <Link href="/vehicles" className={styles.backBtn}>
          &larr; Orqaga
        </Link>
      </header>

      <div className={styles.card}>
        <form action={updateVehicle} className={styles.formGrid}>
          <input type="hidden" name="id" value={vehicle.id} />
          
          <div className={styles.formGroup}>
            <label className={styles.label}>Davlat raqami</label>
            <input name="plate" type="text" required className={styles.input} defaultValue={vehicle.plate} />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Mashina modeli (Markasi)</label>
            <input name="brand" type="text" required className={styles.input} defaultValue={vehicle.brand} />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Texnika turi</label>
            <select name="type" required className={styles.select} defaultValue={vehicle.type}>
              <option value="Yengil avtomobil">Yengil avtomobil</option>
              <option value="Yuk avtomobili">Yuk avtomobili</option>
              <option value="Avtokran">Avtokran</option>
              <option value="Boshqa maxsus texnika">Boshqa maxsus texnika</option>
              <option value="Легковые автомобили">Легковые автомобили</option>
            </select>
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Yoqilg'i turi</label>
            <select name="fuelType" required className={styles.select} defaultValue={vehicle.fuelType}>
              <option value="Dizel">Dizel</option>
              <option value="Benzin">Benzin</option>
              <option value="Propan">Propan</option>
              <option value="Метан">Метан</option>
              <option value="Noma'lum">Noma'lum</option>
            </select>
          </div>

          <button type="submit" className={styles.submitBtn}>
            O'zgarishlarni Saqlash
          </button>
        </form>
      </div>
    </div>
  );
}
