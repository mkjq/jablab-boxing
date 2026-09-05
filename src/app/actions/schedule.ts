"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function deleteSchedule(id: string) {
  try {
    await prisma.classSession.delete({
      where: { id },
    });
    revalidatePath("/");
    revalidatePath("/gsg/schedule");
    return { success: true };
  } catch (error) {
    return { success: false, error: "Failed to delete schedule session" };
  }
}
