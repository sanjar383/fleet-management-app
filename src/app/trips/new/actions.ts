"use server";

import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";

const prisma = new PrismaClient();

export async function createTrip(formData: FormData) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    throw new Error("Unauthorized");
  }

  const driver = formData.get("driver") as string;
  const vehicleInput = formData.get("vehicleId") as string;
  const departureDateStr = formData.get("departureDate") as string;
  const returnDateStr = formData.get("returnDate") as string;
  const workDays = parseFloat(formData.get("workDays") as string) || 0;
  const workHours = parseFloat(formData.get("workHours") as string) || 0;
  const vehicleType = formData.get("vehicleType") as string;
  const organization = formData.get("organization") as string;
  const division = formData.get("division") as string;
  const route = formData.get("route") as string;
  const startKm = parseFloat(formData.get("startKm") as string);
  const endKm = parseFloat(formData.get("endKm") as string);
  const fuelFilled = parseFloat(formData.get("fuelFilled") as string);

  const distance = endKm - startKm;

  // Extract plate from "Cobalt (01A123AA)"
  const plateMatch = vehicleInput.match(/\(([^)]+)\)/);
  const vehiclePlate = plateMatch ? plateMatch[1].trim() : vehicleInput.trim();

  // Get vehicle
  const vehicle = await prisma.vehicle.findUnique({ where: { plate: vehiclePlate } });
  if (!vehicle) throw new Error("Mashina topilmadi!");

  const vehicleId = vehicle.id;

  // Get norm
  const norm = await prisma.norm.findFirst({
    where: { type: vehicle.brand }
  });

  const fuelPer100 = norm?.fuelPer100 || 0;
  const fuelNorm = distance * (fuelPer100 / 100);

  // Here fuelActual can be calculated later based on tank rest, but we just save filled
  const fuelActual = fuelFilled; 
  
  const departureDate = departureDateStr ? new Date(departureDateStr) : new Date();
  const returnDate = returnDateStr ? new Date(returnDateStr) : null;

  const trip = await prisma.trip.create({
    data: {
      driver,
      vehicleId,
      userId: session.user.id,
      departureDate,
      returnDate,
      workDays,
      workHours,
      organization,
      division,
      vehicleType,
      origin: route, // fallback for schema
      destination: "", // fallback for schema
      startKm,
      endKm,
      distance,
      fuelFilled,
      fuelNorm,
      fuelActual,
    }
  });

  // 5. Google Sheetsga yozish!
  try {
    const { appendTripToSheet } = await import("@/lib/sheets");
    await appendTripToSheet({
      id: trip.id,
      date: departureDate,
      returnDate: returnDate,
      workDays: trip.workDays,
      workHours: trip.workHours,
      organization: trip.organization,
      division: trip.division,
      driver: trip.driver,
      vehiclePlate: vehicle.plate,
      vehicleBrand: vehicle.brand,
      route: route,
      startKm: trip.startKm,
      endKm: trip.endKm,
      distance: trip.distance,
      fuelType: vehicle.fuelType,
      fuelUsed: trip.fuelFilled
    });
  } catch (e) {
    console.error("Sheets sync xatosi", e);
  }

  redirect("/dashboard");
}
