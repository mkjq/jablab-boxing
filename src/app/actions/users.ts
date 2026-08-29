"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import bcrypt from "bcryptjs";
import { getSession } from "@/lib/auth";

export async function getUsers() {
  const session = await getSession();
  if (session?.role !== "SUPER_ADMIN") return { success: false, error: "غير مصرح لك" };

  try {
    const users = await prisma.admin.findMany({
      select: { id: true, username: true, role: true, createdAt: true },
      orderBy: { createdAt: 'asc' }
    });
    return { success: true, users };
  } catch (error) {
    return { success: false, error: "فشل في جلب المستخدمين" };
  }
}

export async function createUser(data: { username: string; password?: string; role: string }) {
  const session = await getSession();
  if (session?.role !== "SUPER_ADMIN") return { success: false, error: "غير مصرح لك" };

  if (!data.username || !data.password) return { success: false, error: "يجب إدخال اسم مستخدم وكلمة سر" };

  try {
    const existing = await prisma.admin.findUnique({ where: { username: data.username } });
    if (existing) return { success: false, error: "اسم المستخدم موجود مسبقاً" };

    const passwordHash = await bcrypt.hash(data.password, 10);
    
    await prisma.admin.create({
      data: {
        username: data.username,
        passwordHash,
        role: data.role as any
      }
    });
    
    revalidatePath("/gsg/users");
    return { success: true };
  } catch (error) {
    return { success: false, error: "فشل في إنشاء المستخدم" };
  }
}

export async function updateUser(id: string, data: { username: string; password?: string; role: string }) {
  const session = await getSession();
  if (session?.role !== "SUPER_ADMIN") return { success: false, error: "غير مصرح لك" };

  try {
    const updateData: any = { username: data.username, role: data.role as any };
    if (data.password) {
      updateData.passwordHash = await bcrypt.hash(data.password, 10);
    }

    await prisma.admin.update({
      where: { id },
      data: updateData
    });

    revalidatePath("/gsg/users");
    return { success: true };
  } catch (error) {
    return { success: false, error: "فشل في تعديل المستخدم" };
  }
}

export async function deleteUser(id: string) {
  const session = await getSession();
  if (session?.role !== "SUPER_ADMIN") return { success: false, error: "غير مصرح لك" };

  if (session.userId === id) return { success: false, error: "لا يمكنك حذف حسابك الشخصي" };

  try {
    await prisma.admin.delete({ where: { id } });
    revalidatePath("/gsg/users");
    return { success: true };
  } catch (error) {
    return { success: false, error: "فشل في حذف المستخدم" };
  }
}
