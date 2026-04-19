import bcrypt from "bcrypt";
import { Role } from "../../generated/prisma/enums";
import { envVars } from "../config/env";
import { prisma } from "../lib/prisma";

export const seedAdmin = async () => {
     try {
          const isAdminExist = await prisma.user.findFirst({
               where: {
                    role: Role.ADMIN,
               },
          });

          if (isAdminExist) {
               console.log("Admin already exists, skipping seed.");
               return;
          }

          const hashedPassword = await bcrypt.hash(envVars.ADMIN_PASSWORD, 10);

          await prisma.user.create({
               data: {
                    name: "Admin",
                    email: envVars.ADMIN_EMAIL,
                    password: hashedPassword,
                    role: Role.ADMIN,
                    isEmailVerified: true,
                    emailVerifiedAt: new Date(),
               },
          });

          console.log("✅ Admin user created successfully.");
     } catch (error) {
          console.error("❌ Error seeding admin: ", error);
     }
};
