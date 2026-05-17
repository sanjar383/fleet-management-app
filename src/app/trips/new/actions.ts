"use server";

import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";

const prisma = new PrismaClient();

export async function createTrip(formData: FormData) {
  const session = await getServerSession(authOptions);
  const userId = (session?.user as any)?.id;
  if (!userId) throw new Error("Siz tizimga kirmagansiz.");

  const getStr = (key: string) => (formData.get(key) as string) || "";
  const getNum = (key: string) => {
    const val = parseFloat(formData.get(key) as string);
    return isNaN(val) ? 0 : val;
  };

  const vehicleId = getStr("vehicleId"); // ENDI ID KELYAPTI!
  const vehicle = await prisma.vehicle.findUnique({ where: { id: vehicleId } });
  if (!vehicle) throw new Error(`Mashina topilmadi (ID: ${vehicleId})`);

  const departureDate = getStr("departureDate") ? new Date(getStr("departureDate")) : new Date();
  const returnDate = getStr("returnDate") ? new Date(getStr("returnDate")) : null;

  const trip = await prisma.trip.create({
    data: {
      driver: getStr("driver"),
      origin: getStr("route"),
      destination: getStr("route"),
      startKm: getNum("startKm"),
      endKm: getNum("endKm"),
      distance: Math.max(0, getNum("endKm") - getNum("startKm")),
      fuelFilled: getNum("fuelFilled"),
      fuelNorm: 0,
      fuelActual: 0,
      fuelStart: getNum("fuelStart"),
      fuelEnd: 0,
      vehicleId: vehicle.id,
      userId,
      departureDate,
      returnDate,
      organization: getStr("organization"),
      division: getStr("division"),
      vehicleType: vehicle.type,
      waybillNumber: getStr("waybillNumber"),
      gpsStatus: getStr("gpsStatus"),
      acStatus: getStr("acStatus"),
      regionNorm: getStr("regionNorm"),
      m500_1500: getNum("m500_1500"),
      m1501_2000: getNum("m1501_2000"),
      m2001_3000: getNum("m2001_3000"),
      m3001_plus: getNum("m3001_plus"),
      sandGravel: getNum("sandGravel"),
      seasonCoeff: getNum("seasonCoeff") || 1
    }
  });

  try {
    const { appendTripToIshJadvali } = await import("@/lib/sheets");
    const rowNumber = await appendTripToIshJadvali(trip, vehicle);
    if (rowNumber) {
      await (prisma.trip as any).update({
        where: { id: trip.id },
        data: { sheetsRow: rowNumber }
      });
    }
  } catch (e) {
    console.error("Sheets sync error:", e);
  }

  redirect("/dashboard");
}

export async function updateTrip(tripId: string, formData: FormData) {
  // Tahrirlash logikasi xuddi shunday
  const getStr = (key: string) => (formData.get(key) as string) || "";
  const getNum = (key: string) => parseFloat(formData.get(key) as string) || 0;

  const trip = await prisma.trip.update({
    where: { id: tripId },
    data: {
      driver: getStr("driver"),
      origin: getStr("route"),
      startKm: getNum("startKm"),
      endKm: getNum("endKm"),
      fuelStart: getNum("fuelStart"),
      fuelFilled: getNum("fuelFilled"),
      departureDate: new Date(getStr("departureDate")),
      returnDate: getStr("returnDate") ? new Date(getStr("returnDate")) : null,
      waybillNumber: getStr("waybillNumber"),
      gpsStatus: getStr("gpsStatus"),
      acStatus: getStr("acStatus"),
      regionNorm: getStr("regionNorm"),
      m500_1500: getNum("m500_1500"),
      m1501_2000: getNum("m1501_2000"),
      seasonCoeff: getNum("seasonCoeff"),
    }
  });

  if ((trip as any).sheetsRow) {
    try {
      const { updateTripInIshJadvali } = await import("@/lib/sheets");
      const vehicle = await prisma.vehicle.findUnique({ where: { id: trip.vehicleId } });
      await updateTripInIshJadvali((trip as any).sheetsRow, trip, vehicle);
    } catch (e) {
      console.error("Sheets update error:", e);
    }
  }
  redirect("/dashboard");
}

export async function deleteTrip(tripId: string) {
  const trip = await prisma.trip.findUnique({ where: { id: tripId } });
  if (!trip) throw new Error("Qatnov topilmadi.");
  const rowNumber = (trip as any).sheetsRow;
  await prisma.trip.delete({ where: { id: tripId } });
  if (rowNumber) {
    try {
      const { deleteTripFromIshJadvali } = await import("@/lib/sheets");
      await deleteTripFromIshJadvali(rowNumber);
      await (prisma.trip as any).updateMany({
        where: { sheetsRow: { gt: rowNumber } },
        data: { sheetsRow: { decrement: 1 } }
      });
    } catch (e) {
      console.error("Sheets delete error:", e);
    }
  }
  redirect("/dashboard");
}
