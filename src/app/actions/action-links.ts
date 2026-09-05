"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function deleteActionLink(id: string) {
  try {
    await prisma.actionLink.delete({
      where: { id },
    });
    revalidatePath("/");
    revalidatePath("/gsg/action-links");
    return { success: true };
  } catch (error) {
    return { success: false, error: "Failed to delete link" };
  }
}
