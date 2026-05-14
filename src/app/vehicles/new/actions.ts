"use server";

import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";

const prisma = new PrismaClient();

export async function createVehicle(formData: FormData) {
  const session = await getServerSession(authOptions);
  if (!session) {
    throw new Error("Unauthorized");
  }

  const brand = formData.get("brand") as string;
  const plate = formData.get("plate") as string;
  const type = formData.get("type") as string;
  const fuelType = formData.get("fuelType") as string;
  const fuelNorm = parseFloat(formData.get("fuelNorm") as string);

  // Mashinani yaratish
  const vehicle = await prisma.vehicle.create({
    data: {
      brand,
      plate,
      type,
      fuelType,
    }
  });

  // Shu mashina uchun bazaviy normani ham yaratish
  await prisma.norm.create({
    data: {
      type: brand,
      location: "Asfalt / Oddiy yo'l",
      season: "Yoz",
      fuelPer100: fuelNorm,
    }
  });

  redirect("/vehicles");
}
