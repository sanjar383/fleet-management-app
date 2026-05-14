"use server";

import { PrismaClient } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";

const prisma = new PrismaClient();

export async function deleteDriver(formData: FormData) {
  const session = await getServerSession(authOptions);
  if (!session) throw new Error("Unauthorized");

  const id = formData.get("id") as string;
  if (!id) return;

  await prisma.driver.delete({
    where: { id }
  });

  revalidatePath("/drivers");
}

export async function updateDriver(formData: FormData) {
  const session = await getServerSession(authOptions);
  if (!session) throw new Error("Unauthorized");

  const id = formData.get("id") as string;
  const name = formData.get("name") as string;
  const isActive = formData.get("isActive") === "true";

  if (!id || !name) return;

  await prisma.driver.update({
    where: { id },
    data: { name, isActive }
  });

  redirect("/drivers");
}
