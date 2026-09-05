"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function deletePricing(id: string) {
  try {
    await prisma.pricingTier.delete({
      where: { id },
    });
    revalidatePath("/");
    revalidatePath("/gsg/pricing");
    return { success: true };
  } catch (error) {
    return { success: false, error: "Failed to delete pricing tier" };
  }
}
