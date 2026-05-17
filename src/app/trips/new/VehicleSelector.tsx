"use client";

import { useState, useEffect } from "react";
import styles from "./form.module.css";

interface Vehicle {
  id: string;
  plate: string;
  model: string;
  type: string;
  brand: string;
}

export default function VehicleSelector({ vehicles, norms }: { vehicles: Vehicle[]; norms: any[] }) {
  const [selectedVehicleId, setSelectedVehicleId] = useState("");
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [availableRegions, setAvailableRegions] = useState<string[]>([]);

  const handleVehicleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const id = e.target.value;
    setSelectedVehicleId(id);
    const vehicle = vehicles.find((v) => v.id === id) || null;
    setSelectedVehicle(vehicle);

    if (vehicle) {
      // SOLISHTIRISH: Sheets dagi 'Справочник норма' mantiqi bo'yicha 
      // Markasi va Turi bittada mos kelsa hududlarni chiqaramiz
      const regions = norms
        .filter(n => 
          n.type?.trim() === vehicle.type?.trim() && 
          n.brand?.trim() === vehicle.brand?.trim()
        )
        .map(n => n.location)
        .filter((v, i, a) => v && v !== "-" && a.indexOf(v) === i);

      setAvailableRegions(regions.length > 0 ? regions : ["-"]);
    } else {
      setAvailableRegions([]);
    }
  };

  return (
    <>
      <div className={styles.sectionTitle}>2. Texnik holat va Hudud</div>
      <div className={styles.formGrid}>
        <div className={styles.formGroup}>
          <label className={styles.label}>Mashina (Raqami)</label>
          <select
            name="vehicleId"
            required
            className={styles.input}
            value={selectedVehicleId}
            onChange={handleVehicleChange}
          >
            <option value="">Tanlang...</option>
            {vehicles.map((v) => (
              <option key={v.id} value={v.id}>
                {v.plate} | {v.brand}
              </option>
            ))}
          </select>
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>Hudud (Normativ)</label>
          <select name="regionNorm" required className={styles.input}>
            {availableRegions.length === 0 ? (
              <option value="">Mashinani tanlang...</option>
            ) : (
              availableRegions.map((reg, idx) => (
                <option key={idx} value={reg}>{reg}</option>
              ))
            )}
          </select>
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>Konditsioner</label>
          <select name="acStatus" className={styles.input} required>
            <option value="Yo'q">без кондиционера</option>
            <option value="Ishlatildi">с кондиционером</option>
          </select>
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>GPS holati</label>
          <select name="gpsStatus" className={styles.input}>
            <option value="Ishlamoqda">Ishlamoqda</option>
            <option value="Ishlamayapti">Ishlamayapti</option>
          </select>
        </div>
      </div>

      {selectedVehicle && (
        selectedVehicle.type.includes("Бортовые") || 
        selectedVehicle.type.includes("Самосвал") || 
        selectedVehicle.type.includes("Специальный") ||
        selectedVehicle.type.includes("Механизм")
      ) && (
        <div className={styles.elevationSection}>
          <div className={styles.sectionTitle}>Maxsus koeffitsientlar (Balandlik va h.k.)</div>
          <div className={styles.formGrid}>
            <div className={styles.formGroup}>
              <label className={styles.label}>500-1500m (km)</label>
              <input name="m500_1500" type="number" step="0.1" className={styles.input} defaultValue="0" />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.label}>1501-2000m (km)</label>
              <input name="m1501_2000" type="number" step="0.1" className={styles.input} defaultValue="0" />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.label}>Qum-tosh (km)</label>
              <input name="sandGravel" type="number" step="0.1" className={styles.input} defaultValue="0" />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.label}>Mavsum koeff.</label>
              <input name="seasonCoeff" type="number" step="0.01" className={styles.input} defaultValue="1" />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
