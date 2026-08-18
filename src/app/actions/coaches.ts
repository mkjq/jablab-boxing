"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function getCoaches() {
  try {
    const coaches = await prisma.coach.findMany({
      orderBy: { id: "asc" }
    });
    return { success: true, coaches };
  } catch (error) {
    return { success: false, error: "Failed to fetch coaches" };
  }
}

export async function updateCoach(id: string, data: any) {
  try {
    const updated = await prisma.coach.update({
      where: { id },
      data,
    });
    revalidatePath("/");
    revalidatePath("/gsg/coaches");
    return { success: true, coach: updated };
  } catch (error) {
    return { success: false, error: "Failed to update coach" };
  }
}

export async function createCoach(data: any) {
  try {
    const created = await prisma.coach.create({
      data,
    });
    revalidatePath("/");
    revalidatePath("/gsg/coaches");
    return { success: true, coach: created };
  } catch (error) {
    return { success: false, error: "Failed to create coach" };
  }
}

export async function deleteCoach(id: string) {
  try {
    await prisma.coach.delete({
      where: { id },
    });
    revalidatePath("/");
    revalidatePath("/gsg/coaches");
    return { success: true };
  } catch (error) {
    return { success: false, error: "Failed to delete coach" };
  }
}
