import prisma from "~/lib/prisma";
import { defineEventHandler, readBody, createError } from "h3";

export default defineEventHandler(async (event) => {
  const body = await readBody(event);

  try {
    console.log("Body data:", JSON.stringify(body, null, 2));

    // Validasi input
    if (!body.userId || body.amount === undefined || body.amount === null || isNaN(body.amount) || !body.reason) {
      throw createError({
        statusCode: 400,
        statusMessage: "Validation Error",
        message: "userId, amount (number), and reason are required",
      });
    }
    


    // Cek apakah user ada
    const user = await prisma.user.findUnique({
      where: { id: body.userId },
    });

    if (!user) {
      throw createError({
        statusCode: 404,
        statusMessage: "User Not Found",
        message: "User with the given ID does not exist",
      });
    }

    // Jika ada peminjaman terkait, cek apakah peminjaman valid
    let peminjaman = null;
    if (body.peminjamanId) {
      peminjaman = await prisma.peminjaman.findUnique({
        where: { id: body.peminjamanId },
      });
      if (!peminjaman) {
        throw createError({
          statusCode: 404,
          statusMessage: "Peminjaman Not Found",
          message: "Peminjaman with the given ID does not exist",
        });
      }
    }

    // Buat entri denda baru
    const denda = await prisma.denda.create({
      data: {
        userId: body.userId,
        peminjamanId: body.peminjamanId || null,
        amount: body.amount || 0,
        reason: body.reason,
        status: "BELUM_LUNAS",
        createdAt: new Date(),
      },
    });

    // Update totalDenda user
    await prisma.user.update({
      where: { id: body.userId },
      data: {
        totalDenda: {
          increment: body.amount,
        },
      },
    });

    return {
      success: true,
      message: "Denda created successfully",
      data: denda,
    };
  } catch (error) {
    return createError({
      statusCode:  500,
      statusMessage:"Internal Server Error",
      message: "Something went wrong",
    });
  }
});