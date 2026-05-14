"use client";

import { useState } from "react";
import styles from "./form.module.css";

interface Vehicle {
  id: string;
  brand: string;
  plate: string;
  type: string;
}

interface Props {
  vehicles: Vehicle[];
  uniqueVehicleTypes: string[];
}

export default function VehicleSelector({ vehicles, uniqueVehicleTypes }: Props) {
  const [selectedType, setSelectedType] = useState("");
  const [selectedBrand, setSelectedBrand] = useState("");

  // 1. Filtr by type
  const filteredByType = selectedType 
    ? vehicles.filter(v => v.type.toLowerCase().includes(selectedType.toLowerCase()))
    : vehicles;

  // Unique brands for the second dropdown
  const uniqueBrands = Array.from(new Set(filteredByType.map(v => v.brand)));

  // 2. Filtr by brand
  const filteredByBrand = selectedBrand
    ? filteredByType.filter(v => v.brand === selectedBrand)
    : filteredByType;

  return (
    <>
      <datalist id="vehicleTypeList">
        {uniqueVehicleTypes.map((vType, i) => <option key={i} value={vType as string} />)}
      </datalist>

      <div className={`${styles.formGroup} ${styles.fullWidth}`}>
        <label className={styles.label}>Transport vositasi turi</label>
        <input 
          name="vehicleType" 
          type="text" 
          list="vehicleTypeList" 
          className={styles.input} 
          placeholder="Masalan: Легковые автомобили..." 
          value={selectedType}
          onChange={(e) => {
            setSelectedType(e.target.value);
            setSelectedBrand(""); // Reset brand when type changes
          }}
        />
      </div>

      <div className={`${styles.formGroup} ${styles.fullWidth}`}>
        <label className={styles.label}>Markasi</label>
        <select 
          className={styles.select || styles.input} 
          value={selectedBrand}
          onChange={(e) => setSelectedBrand(e.target.value)}
        >
          <option value="">-- Markani tanlang --</option>
          {uniqueBrands.map((brand, i) => (
            <option key={i} value={brand}>
              {brand}
            </option>
          ))}
        </select>
      </div>

      <div className={`${styles.formGroup} ${styles.fullWidth}`}>
        <label className={styles.label}>Davlat raqami yoki inventar raqami</label>
        <select 
          name="vehicleId" 
          required 
          className={styles.select || styles.input} 
        >
          <option value="">-- Raqamni tanlang --</option>
          {filteredByBrand.map(v => (
            <option key={v.id} value={v.plate}>
              {v.plate}
            </option>
          ))}
        </select>
      </div>
    </>
  );
}
