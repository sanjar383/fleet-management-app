import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import Link from "next/link";
import { createDriver } from "./actions";
import styles from "../../trips/new/form.module.css";

export default async function NewDriverPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div>
          <h1 className={styles.title}>Yangi Haydovchi Qo'shish</h1>
        </div>
        <Link href="/trips/new" className={styles.backBtn}>
          &larr; Orqaga
        </Link>
      </header>

      <div className={styles.card}>
        <form action={createDriver} className={styles.formGrid}>
          
          <div className={`${styles.formGroup} ${styles.fullWidth}`}>
            <label className={styles.label}>Haydovchining Ism-Familiyasi</label>
            <input name="name" type="text" required className={styles.input} placeholder="Masalan: Eshmatov Toshmat" />
          </div>

          <button type="submit" className={styles.submitBtn}>
            Saqlash
          </button>
        </form>
      </div>
    </div>
  );
}
