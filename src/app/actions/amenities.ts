"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function deleteAmenity(id: string) {
  try {
    await prisma.amenity.delete({
      where: { id },
    });
    revalidatePath("/");
    revalidatePath("/gsg/amenities");
    return { success: true };
  } catch (error) {
    return { success: false, error: "Failed to delete amenity" };
  }
}
