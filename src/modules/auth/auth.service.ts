import { prisma } from "../../lib/prisma";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { envVars } from "../../config/env";
import { Role } from "../../../generated/prisma/enums";

const JWT_SECRET = envVars.JWT_SECRET || "supersecret";

interface RegisterData {
     name: string;
     email: string;
     password: string;
     role?: Role;
     image: string | null;
}

interface LoginData {
     email: string;
     password: string;
}

const signUpUser = async (payload: RegisterData) => {
     const { name, email, password, role, image } = payload;

     const existing = await prisma.user.findUnique({ where: { email } });
     if (existing) throw new Error("Email already exists");

     const hashed = await bcrypt.hash(password, 10);

     const user = await prisma.user.create({
          data: {
               name,
               email,
               password: hashed,
               role: role === "CHEF" ? "CHEF" : "CUSTOMER",
               image,
          },
     });

     const token = jwt.sign(
          { id: user.id, role: user.role, email: user.email, status: user.status },
          JWT_SECRET,
          { expiresIn: "7d" }
     );

     const { password: _, ...safeUser } = user;

     return { user: safeUser, token };
};

const signInUser = async (payload: LoginData) => {
     const { email, password } = payload;

     const user = await prisma.user.findUnique({ where: { email } });
     if (!user) throw new Error("Invalid credentials");

     if (user.status === "BANNED") {
          throw new Error("Your account has been banned");
     }
     if (user.status === "SUSPENDED") {
          throw new Error("Your account is suspended. Contact support");
     }

     const isMatch = await bcrypt.compare(password, user.password);
     if (!isMatch) throw new Error("Invalid credentials");

     const updatedUser = await prisma.user.update({
          where: { id: user.id },
          data: { lastLoginAt: new Date() },
     });

     const token = jwt.sign(
          { id: updatedUser.id, role: updatedUser.role, email: updatedUser.email, status: updatedUser.status },
          JWT_SECRET,
          { expiresIn: "7d" }
     );

     const { password: _, ...safeUser } = updatedUser;

     return { user: safeUser, token };
};

export const authService = { signUpUser, signInUser };
