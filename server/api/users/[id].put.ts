import { defineEventHandler, readBody, createError } from 'h3'
import prisma from '~/lib/prisma'

export default defineEventHandler(async (event) => {
  const id = event.context.params?.id;
  const body = await readBody(event);

  if (!id) {
    throw createError({ statusCode: 400, statusMessage: 'User ID is required' });
  }

  try {
    const updatedUser = await prisma.user.update({
      where: { id },
      data: {
        fullname: body.fullname,
        email: body.email,
        username: body.username,
        phone: body.phone,
        gender: body.gender,
        role: body.role,
        photo: body.photo,
        address: body.address,
        is_verify: body.is_verify,
        is_active: body.is_active,
        nik: body.nik,
      },
    });

    return { success: true, user: updatedUser };
  } catch (err: any) {
    throw createError({ statusCode: 500, statusMessage: err.message });
  }
});
