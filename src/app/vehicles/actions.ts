"use server";

import { PrismaClient } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";

const prisma = new PrismaClient();

export async function deleteVehicle(formData: FormData) {
  const session = await getServerSession(authOptions);
  if (!session) throw new Error("Unauthorized");

  const id = formData.get("id") as string;
  if (!id) return;

  await prisma.vehicle.delete({
    where: { id }
  });

  revalidatePath("/vehicles");
}

export async function updateVehicle(formData: FormData) {
  const session = await getServerSession(authOptions);
  if (!session) throw new Error("Unauthorized");

  const id = formData.get("id") as string;
  const plate = formData.get("plate") as string;
  const brand = formData.get("brand") as string;
  const type = formData.get("type") as string;
  const fuelType = formData.get("fuelType") as string;

  if (!id || !plate || !brand) return;

  await prisma.vehicle.update({
    where: { id },
    data: { plate, brand, type, fuelType }
  });

  redirect("/vehicles");
}
