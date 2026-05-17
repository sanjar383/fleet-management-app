"use client";

import { deleteTrip } from "./actions";
import styles from "../../dashboard/dashboard.module.css";

export default function DeleteTripButton({ tripId }: { tripId: string }) {
  const handleDelete = async () => {
    const ok = confirm("Ushbu qatnovni o'chirishga rozimisiz? Bu ma'lumot Google Sheets dan ham o'chiriladi.");
    if (ok) {
      try {
        await deleteTrip(tripId);
      } catch (err) {
        alert("O'chirishda xatolik yuz berdi.");
      }
    }
  };

  return (
    <button onClick={handleDelete} className={styles.editBtn} style={{ color: "#ef4444", marginLeft: "8px" }} title="O'chirish">
      🗑️
    </button>
  );
}
