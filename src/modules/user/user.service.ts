import { prisma } from "../../lib/prisma";
import { auditService } from "../audit/audit.service";

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
               isEmailVerified: true,
               emailVerifiedAt: true,
               lastLoginAt: true,
               createdAt: true,
               updatedAt: true,
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
               isEmailVerified: true,
               emailVerifiedAt: true,
               lastLoginAt: true,
               createdAt: true,
               updatedAt: true,
          },
     });

     // Side effects
     auditService
          .log({
               userId: id,
               action: "PROFILE_UPDATED",
               entityType: "USER",
               entityId: id,
               details: payload,
          })
          .catch((err) => console.error("Profile update audit log failed:", err));

     return user;
};

export const userService = { getProfile, updateProfile };
