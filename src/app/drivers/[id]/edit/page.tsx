import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import Link from "next/link";
import { PrismaClient } from "@prisma/client";
import { updateDriver } from "../../actions";
import styles from "../../../trips/new/form.module.css";

const prisma = new PrismaClient();

export default async function EditDriverPage(props: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  const { id } = await props.params;

  const driver = await prisma.driver.findUnique({
    where: { id }
  });

  if (!driver) {
    redirect("/drivers");
  }

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div>
          <h1 className={styles.title}>Haydovchini Tahrirlash</h1>
        </div>
        <Link href="/drivers" className={styles.backBtn}>
          &larr; Orqaga
        </Link>
      </header>

      <div className={styles.card}>
        <form action={updateDriver} className={styles.formGrid}>
          <input type="hidden" name="id" value={driver.id} />
          
          <div className={`${styles.formGroup} ${styles.fullWidth}`}>
            <label className={styles.label}>Haydovchining Ism-Familiyasi</label>
            <input name="name" type="text" required className={styles.input} defaultValue={driver.name} />
          </div>

          <div className={`${styles.formGroup} ${styles.fullWidth}`}>
            <label className={styles.label}>Holati</label>
            <select name="isActive" className={styles.select} defaultValue={driver.isActive ? "true" : "false"}>
              <option value="true">Faol (Ishlayapti)</option>
              <option value="false">Faol emas (Ishdan bo'shagan / Ta'tilda)</option>
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
