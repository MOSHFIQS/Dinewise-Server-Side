import { prisma } from "../../lib/prisma";
import { auditService } from "../audit/audit.service";

const createAddress = async (userId: string, payload: any) => {
     const { zipCode, postalCode, title, ...rest } = payload;
     const address = await prisma.address.create({
          data: {
               ...rest,
               userId,
               title: title || "Home",
               postalCode: postalCode || zipCode,
          },
     });

     // Side effect
     auditService
          .log({
               userId,
               action: "ADDRESS_CREATED",
               entityType: "ADDRESS",
               entityId: address.id,
               details: { title: address.title },
          })
          .catch((err) => console.error("Address create audit failed:", err));

     return address;
};

const getAddresses = async (userId: string) => {
     return prisma.address.findMany({ where: { userId } });
};

const updateAddress = async (id: string, userId: string, payload: any) => {
     const { zipCode, postalCode, ...rest } = payload;
     const dataToUpdate = { ...rest };
     if (postalCode || zipCode) {
          dataToUpdate.postalCode = postalCode || zipCode;
     }
     const address = await prisma.address.update({ where: { id, userId }, data: dataToUpdate });

     // Side effect
     auditService
          .log({
               userId,
               action: "ADDRESS_UPDATED",
               entityType: "ADDRESS",
               entityId: id,
               details: payload,
          })
          .catch((err) => console.error("Address update audit failed:", err));

     return address;
};

const deleteAddress = async (id: string, userId: string) => {
     const address = await prisma.address.delete({ where: { id, userId } });

     // Side effect
     auditService
          .log({
               userId,
               action: "ADDRESS_DELETED",
               entityType: "ADDRESS",
               entityId: id,
          })
          .catch((err) => console.error("Address delete audit failed:", err));

     return address;
};

export const addressService = { createAddress, getAddresses, updateAddress, deleteAddress };
