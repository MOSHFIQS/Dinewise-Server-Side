import { prisma } from "../../lib/prisma";

const getProfile = async (id: string) => {
     const user = await prisma.user.findUnique({
          where: { id },
          select: {
               id: true,
               name: true,
               email: true,
               image: true,
               phone: true,
               role: true,
               status: true,
               createdAt: true,
          },
     });
     if (!user) throw new Error("User not found");
     return user;
};

const updateProfile = async (id: string, payload: { name?: string; phone?: string; image?: string }) => {
     const user = await prisma.user.update({
          where: { id },
          data: payload,
          select: {
               id: true,
               name: true,
               email: true,
               image: true,
               phone: true,
               role: true,
               status: true,
               createdAt: true,
          },
     });
     return user;
};

export const userService = { getProfile, updateProfile };
