import prisma from "~/lib/prisma"
import { userSchema } from "~/server/validation/userSchema"
import bcrypt from "bcrypt"

export default defineEventHandler(async (event) => {
  const body = await readBody(event)

  let parsedData;
  try {
    parsedData = userSchema.parse(body);
  } catch (error) {
    throw createError({
      statusCode: 400,
      statusMessage: "Validation Error",
      message: "Invalid input"
    });
  }

  const existingUser = await prisma.user.findFirst({
    where: {
      OR: [
        { email: parsedData.email },
        { username: parsedData.username },
        { phone: parsedData.phone }
      ]
    }
  });

  if (existingUser) {
    throw createError({
      statusCode: 400,
      statusMessage: "Bad Request",
      message: "Email, username, or phone already exists"
    });
  }

  const hashedPassword = await bcrypt.hash(parsedData.password, 10);

  const user = await prisma.user.create({
    data: {
      ...parsedData,
      gender: parsedData.gender || "",
      password: hashedPassword
    }
  });

  return {
    success: true,
    statusCode: 201,
    message: "User created successfully",
    ...user,
    password: undefined
  };
});
